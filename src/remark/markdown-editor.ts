/**
 * Markdownエディターの主要な機能を管理するTypeScriptモジュール
 * アラート処理、プレビュー更新、タグ管理などの機能を提供
 */

import type {
  EditorData,
  EditorError,
  LocalStorageManagerInterface,
  TagManagerInterface,
} from '../types/editor.ts';
import { EDITOR_CONSTANTS } from '../types/editor.ts';
import { DEFAULT_GITHUB_ICONS } from './icons.ts';
import { getMarkedInstance } from './marked-instance.ts';
import {
  sanitizeAlertContent,
  sanitizeAlertHtml,
  sanitizeBasicHtml,
} from './sanitizer.ts';

/**
 * フロントマターの型定義
 */
interface Frontmatter {
  title?: string;
  date?: string;
  lead?: string;
  tags?: string[];
}

/**
 * バリデーション機能
 */

/**
 * タグのバリデーション
 */
export function validateTag(tag: string): EditorError | null {
  if (!tag || typeof tag !== 'string') {
    return {
      type: 'validation',
      message: 'タグは文字列である必要があります',
      details: { tag },
    };
  }

  const trimmedTag = tag.trim();
  if (trimmedTag.length === 0) {
    return {
      type: 'validation',
      message: 'タグは空にできません',
      details: { tag },
    };
  }

  if (trimmedTag.length > 50) {
    return {
      type: 'validation',
      message: 'タグは50文字以内である必要があります',
      details: { tag, length: trimmedTag.length },
    };
  }

  // 特殊文字のチェック（XSS対策）
  const invalidChars = /[<>\"'&]/;
  if (invalidChars.test(trimmedTag)) {
    return {
      type: 'validation',
      message: 'タグに特殊文字は使用できません',
      details: { tag },
    };
  }

  return null;
}

/**
 * タイトルのバリデーション
 */
export function validateTitle(title: string): EditorError | null {
  if (typeof title !== 'string') {
    return {
      type: 'validation',
      message: 'タイトルは文字列である必要があります',
      details: { title },
    };
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length > EDITOR_CONSTANTS.MAX_TITLE_LENGTH) {
    return {
      type: 'validation',
      message: `タイトルは${EDITOR_CONSTANTS.MAX_TITLE_LENGTH}文字以内である必要があります`,
      details: { title, length: trimmedTitle.length },
    };
  }

  return null;
}

/**
 * リード文のバリデーション
 */
export function validateLead(lead: string): EditorError | null {
  if (lead && typeof lead !== 'string') {
    return {
      type: 'validation',
      message: 'リード文は文字列である必要があります',
      details: { lead },
    };
  }

  if (lead && lead.length > EDITOR_CONSTANTS.MAX_LEAD_LENGTH) {
    return {
      type: 'validation',
      message: `リード文は${EDITOR_CONSTANTS.MAX_LEAD_LENGTH}文字以内である必要があります`,
      details: { lead, length: lead.length },
    };
  }

  return null;
}

/**
 * Markdownのバリデーション
 */
export function validateMarkdown(markdown: string): EditorError | null {
  if (!markdown || typeof markdown !== 'string') {
    return {
      type: 'validation',
      message: 'Markdownは文字列である必要があります',
      details: { markdown },
    };
  }

  if (markdown.length > EDITOR_CONSTANTS.MAX_MARKDOWN_LENGTH) {
    return {
      type: 'validation',
      message: `Markdownは${EDITOR_CONSTANTS.MAX_MARKDOWN_LENGTH}文字以内である必要があります`,
      details: { markdown, length: markdown.length },
    };
  }

  return null;
}

/**
 * カスタムアラートの型定義
 */
interface CustomAlert {
  class: string;
  icon: string;
  color: string;
}

/**
 * アラート設定の定義
 * 各アラートタイプに対応するCSSクラス、アイコン、色を定義
 */
export const CUSTOM_ALERTS_CONFIG: Record<string, CustomAlert> = {
  NOTE: {
    class: 'markdown-alert-note',
    icon: DEFAULT_GITHUB_ICONS.info,
    color: 'var(--alert-note-color)',
  },
  TIP: {
    class: 'markdown-alert-tip',
    icon: DEFAULT_GITHUB_ICONS.light_bulb,
    color: 'var(--alert-tip-color)',
  },
  IMPORTANT: {
    class: 'markdown-alert-important',
    icon: DEFAULT_GITHUB_ICONS.report,
    color: 'var(--alert-important-color)',
  },
  WARNING: {
    class: 'markdown-alert-warning',
    icon: DEFAULT_GITHUB_ICONS.alert,
    color: 'var(--alert-warning-color)',
  },
  CAUTION: {
    class: 'markdown-alert-caution',
    icon: DEFAULT_GITHUB_ICONS.stop,
    color: 'var(--alert-caution-color)',
  },
  MEMO: {
    class: 'markdown-alert-custom markdown-alert-custom-memo',
    icon: DEFAULT_GITHUB_ICONS.memo,
    color: '#f59e0b',
  },
  HINT: {
    class: 'markdown-alert-custom markdown-alert-custom-hint',
    icon: DEFAULT_GITHUB_ICONS.hint,
    color: '#3b82f6',
  },
  ひとことメモ: {
    class: 'markdown-alert-custom markdown-alert-custom-ひとことメモ',
    icon: DEFAULT_GITHUB_ICONS.ひとことメモ,
    color: '#10b981',
  },
  CUSTOM: {
    class: 'markdown-alert-custom',
    icon: DEFAULT_GITHUB_ICONS.custom,
    color: '#6b7280',
  },
};

/**
 * SVGからpath要素を抽出する
 * @param svg - 完全なSVG要素
 * @returns path要素の文字列
 */
function extractSvgPath(svg: string): string {
  const pathMatch = svg.match(/<path[^>]*>/);
  return pathMatch ? pathMatch[0] : '';
}

/**
 * アラートの種類を定義
 */
const ALERT_TYPES =
  'NOTE|TIP|IMPORTANT|WARNING|CAUTION|MEMO|HINT|ひとことメモ|CUSTOM';

/**
 * アラートのタイトル行を検出する正規表現
 */
const ALERT_TITLE_REGEX = new RegExp(`\\[!(${ALERT_TYPES})\\](\\s*.*)?`, 'i');

/**
 * アラートの開始行を検出する正規表現
 */
const ALERT_START_REGEX = new RegExp(
  `^(\\s*>?\\s*)\\[!(${ALERT_TYPES})\\]`,
  'i',
);

/**
 * アラートブロックを処理してHTMLに変換する
 * @param alertText - アラートのテキスト内容
 * @returns 処理されたHTML文字列
 */
export function processAlertBlock(alertText: string): string {
  // アラートの種類を特定
  const alertMatch = alertText.match(ALERT_TITLE_REGEX);
  if (!alertMatch) return alertText;

  const alertType = alertMatch[1].toUpperCase();
  let title =
    alertType === 'CUSTOM'
      ? alertType
      : alertType.charAt(0) + alertType.slice(1).toLowerCase();
  let icon = CUSTOM_ALERTS_CONFIG[alertType]?.icon;
  let color = CUSTOM_ALERTS_CONFIG[alertType]?.color || '#6b7280'; // デフォルトの色

  // カスタムアラートの特別な処理
  if (alertType === 'CUSTOM') {
    const parameters = alertMatch[2]?.trim().split(' ') || [];
    if (parameters.length >= 2) {
      color = parameters[0]; // 最初のパラメータが色
      const iconName = parameters[1]; // 2番目のパラメータがアイコン名
      icon =
        DEFAULT_GITHUB_ICONS[iconName as keyof typeof DEFAULT_GITHUB_ICONS] ||
        DEFAULT_GITHUB_ICONS.custom;
      title = parameters.slice(2).join(' ') || 'CUSTOM'; // 残りがタイトル
    }
  }

  // アラート内容の抽出（複数行対応）
  const [_, ...lines] = alertText.split('\n'); // 最初の行はアラートタイプなので除去
  const content = lines
    .map((line) => line.replace(/^>\s*/, ''))
    .filter(Boolean)
    .join('\n\n');

  // アラートHTMLを生成
  return createAlertHtml(alertType, content, title, icon, color);
}

/**
 * アラートHTMLを生成する
 * @param type - アラートタイプ
 * @param content - アラート内容
 * @param title - アラートタイトル
 * @param icon - アラートアイコン
 * @param color - アラート色
 * @returns 生成されたHTML文字列
 */
export function createAlertHtml(
  type: string,
  content: string,
  title?: string,
  icon?: string,
  color?: string,
): string {
  const config = CUSTOM_ALERTS_CONFIG[type];
  if (!config) return content;

  // markedライブラリを使用してMarkdownをHTMLに変換
  const processedContent = getMarkedInstance().parse(content);

  // アラートコンテンツをサニタイズ（XSS対策）
  const sanitizedContent = sanitizeAlertContent(processedContent);

  // カスタムアラートの場合は渡されたパラメータを使用、そうでなければconfigを使用
  const finalTitle = title || type;
  const finalIcon = icon || config.icon;
  const finalColor = color || config.color;

  // SVGアイコンからpath要素を抽出
  const svgPath = extractSvgPath(finalIcon);

  return `
    <div class="markdown-alert not-prose ${config.class} ${`bg-${finalColor}-100 border-${finalColor}-500`}">
      <div class="markdown-alert-title ${`text-${finalColor}-500`}">
        <span class="octicon octicon-${type.toLowerCase()}" style="display: inline-flex;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="16" width="16" viewBox="0 0 16 16" style="width: 100%; height: 100%;">
            ${svgPath}
          </svg>
        </span>
        ${finalTitle}
      </div>
      <div class="markdown-alert-content">
        ${sanitizedContent}
      </div>
    </div>
  `;
}

/**
 * HTML内の画像パスをローカルストレージの画像データに置き換える
 * @param html - 処理対象のHTML文字列
 * @param imageManager - 画像管理クラスのインスタンス
 * @returns 処理されたHTML文字列
 */
function processImagePathsInHtml(
  html: string,
  imageManager: ImageManager,
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const images = doc.querySelectorAll('img');

  images.forEach((img) => {
    const src = img.getAttribute('src');

    if (src && src.startsWith('./')) {
      const imageName = src.substring(2); // './' を除去
      const imageData = imageManager.getImageDataByName(imageName);

      if (imageData) {
        img.setAttribute('src', imageData);
      } else {
        // 画像が見つからない場合の処理
        img.setAttribute('alt', `画像が見つかりません: ${imageName}`);
        img.style.backgroundColor = '#f3f4f6';
        img.style.border = '2px dashed #d1d5db';
        img.style.padding = '20px';
        img.style.display = 'inline-block';
        img.style.minWidth = '200px';
        img.style.minHeight = '100px';
      }
    }
  });

  return doc.body.innerHTML;
}

/**
 * Markdownテキストをプレビュー用HTMLに変換する（基本版）
 * @param markdown - 変換対象のMarkdownテキスト
 * @returns 変換されたHTML文字列
 */
export function updatePreview(markdown: string): string {
  const lines = markdown.split('\n');
  const processedParts: string[] = [];
  let i = 0;
  let markdownBuffer: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const alertStartMatch = line.match(ALERT_START_REGEX);

    if (alertStartMatch) {
      // バッファに溜まったMarkdownを処理
      if (markdownBuffer.length > 0) {
        processedParts.push(markdownBuffer.join('\n'));
        markdownBuffer = [];
      }

      const alertLines = [line];
      let j = i + 1;

      // 続くブロック引用行を収集するが、次のアラートが始まったら止める
      while (
        j < lines.length &&
        lines[j].match(/^\s*>/) &&
        !lines[j].match(ALERT_START_REGEX)
      ) {
        alertLines.push(lines[j]);
        j++;
      }

      const alertBlock = alertLines.join('\n');
      const alertHtml = processAlertBlock(alertBlock);
      processedParts.push(alertHtml); // HTMLを直接パーツとして追加

      i = j;
    } else {
      markdownBuffer.push(line);
      i++;
    }
  }

  // ループ終了後、残りのMarkdownバッファを処理
  if (markdownBuffer.length > 0) {
    processedParts.push(markdownBuffer.join('\n'));
  }

  // 各パーツを処理して結合
  const finalHtml = processedParts
    .map((part) => {
      // アラートHTMLはそのまま、それ以外はmarkedでパースしてサニタイズ
      if (part.trim().startsWith('<div class="markdown-alert')) {
        return part;
      }
      const parsed = getMarkedInstance().parse(part);
      return sanitizeBasicHtml(parsed);
    })
    .join('');

  // 最終的なHTMLをアラート構造を保持しつつサニタイズ
  return sanitizeAlertHtml(finalHtml);
}

/**
 * 画像処理機能付きのMarkdownテキストをプレビュー用HTMLに変換する
 * @param markdown - 変換対象のMarkdownテキスト
 * @param imageManager - 画像管理クラスのインスタンス
 * @returns 変換されたHTML文字列
 */
export function updatePreviewWithImages(
  markdown: string,
  imageManager: ImageManager,
): string {
  // 基本的なMarkdown変換を実行
  let html = updatePreview(markdown);

  // もし画像タグが含まれていない場合、手動で変換
  if (!html.includes('<img') && markdown.includes('![')) {
    // 画像のMarkdown構文を手動でHTMLに変換
    const imageRegex = /!\[([^\]]*)\]\(([^\s']+)(?:\s+'([^']+)')?\)/g;
    const imageHtml = markdown.replace(imageRegex, (match, alt, src, title) => {
      return `<img src="${src}" alt="${alt}" title="${title || ''}">`;
    });

    // 他のMarkdown構文も簡易変換
    html = imageHtml
      .replace(/### (.+)/g, '<h3>$1</h3>')
      .replace(/## (.+)/g, '<h2>$1</h2>')
      .replace(/# (.+)/g, '<h1>$1</h1>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    html = `<p>${html}</p>`;
  }

  // ローカルストレージの画像データでパスを置換
  return processImagePathsInHtml(html, imageManager);
}

/**
 * タグ管理クラス
 * タグの追加、削除、表示更新を管理
 */
export class TagManager implements TagManagerInterface {
  private tags: string[] = [];
  private readonly maxTags = EDITOR_CONSTANTS.MAX_TAGS;

  /**
   * タグを追加する
   * @param tag - 追加するタグ
   * @returns 追加が成功したかどうか
   */
  addTag(tag: string): boolean {
    try {
      // バリデーション
      const validationError = validateTag(tag);
      if (validationError) {
        console.error('タグのバリデーションエラー:', validationError.message);
        alert(validationError.message);
        return false;
      }

      const trimmedTag = tag.trim();

      // 最大数チェック
      if (this.tags.length >= this.maxTags) {
        alert(`タグは最大${this.maxTags}個までです`);
        return false;
      }

      // 重複チェック
      if (this.tags.includes(trimmedTag)) {
        console.warn('タグが既に存在します:', trimmedTag);
        return false;
      }

      this.tags.push(trimmedTag);
      return true;
    } catch (error) {
      console.error('タグの追加に失敗:', error);
      alert('タグの追加に失敗しました');
      return false;
    }
  }

  /**
   * タグを削除する
   * @param tag - 削除するタグ
   */
  removeTag(tag: string): void {
    try {
      const trimmedTag = tag.trim();
      this.tags = this.tags.filter((t) => t !== trimmedTag);
    } catch (error) {
      console.error('タグの削除に失敗:', error);
    }
  }

  /**
   * 現在のタグリストを取得する
   * @returns タグの配列（読み取り専用）
   */
  getTags(): string[] {
    return [...this.tags];
  }

  /**
   * タグリストを設定する
   * @param tags - 設定するタグの配列
   */
  setTags(tags: string[]): void {
    try {
      if (!Array.isArray(tags)) {
        console.error('タグは配列である必要があります');
        return;
      }

      // 各タグをバリデーション
      const validatedTags: string[] = [];
      for (const tag of tags) {
        const validationError = validateTag(tag);
        if (validationError) {
          console.error('タグのバリデーションエラー:', validationError.message);
          continue;
        }
        validatedTags.push(tag.trim());
      }

      // 最大数チェック
      if (validatedTags.length > this.maxTags) {
        console.warn(
          `タグが最大数(${this.maxTags})を超えています。最初の${this.maxTags}個のみ使用します。`,
        );
        this.tags = validatedTags.slice(0, this.maxTags);
      } else {
        this.tags = validatedTags;
      }
    } catch (error) {
      console.error('タグの設定に失敗:', error);
    }
  }

  /**
   * タグが選択されているかチェックする
   * @param tag - チェックするタグ
   * @returns 選択されているかどうか
   */
  isTagSelected(tag: string): boolean {
    const trimmedTag = tag.trim();
    return this.tags.includes(trimmedTag);
  }

  /**
   * タグの最大数に達しているかチェックする
   * @returns 最大数に達しているかどうか
   */
  isMaxTagsReached(): boolean {
    return this.tags.length >= this.maxTags;
  }
}

/**
 * ローカルストレージ管理クラス
 * エディターデータの保存と復元を管理
 */
export class LocalStorageManager implements LocalStorageManagerInterface {
  private readonly storageKey = 'markdownEditor';

  /**
   * エディターデータをローカルストレージに保存する
   * @param data - 保存するデータ
   * @returns 保存が成功したかどうか
   */
  saveData(data: EditorData): boolean {
    try {
      // データのバリデーション
      const titleError = validateTitle(data.title);
      if (titleError) {
        console.error('タイトルのバリデーションエラー:', titleError.message);
        alert(titleError.message);
        return false;
      }

      const leadError = validateLead(data.lead);
      if (leadError) {
        console.error('リード文のバリデーションエラー:', leadError.message);
        alert(leadError.message);
        return false;
      }

      const markdownError = validateMarkdown(data.markdown);
      if (markdownError) {
        console.error('Markdownのバリデーションエラー:', markdownError.message);
        alert(markdownError.message);
        return false;
      }

      const dataString = JSON.stringify(data);

      // データサイズの確認
      if (dataString.length > EDITOR_CONSTANTS.MAX_STORAGE_SIZE) {
        alert(
          'データが大きすぎるため保存できません。コンテンツを減らしてください。',
        );
        return false;
      }

      localStorage.setItem(this.storageKey, dataString);
      return true;
    } catch (error) {
      console.error('ローカルストレージへの保存に失敗:', error);

      // QuotaExceededErrorの場合の特別な処理
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        alert(
          'ローカルストレージの容量が不足しています。他のデータを削除するか、ブラウザのストレージをクリアしてください。',
        );
      } else {
        alert(
          'データの保存に失敗しました。ブラウザがローカルストレージをサポートしていない可能性があります。',
        );
      }
      return false;
    }
  }

  /**
   * ローカルストレージからエディターデータを読み込む
   * @returns 読み込まれたデータ、またはnull
   */
  loadData(): EditorData | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) {
        return null;
      }

      const parsedData = JSON.parse(saved) as EditorData;

      // 読み込んだデータのバリデーション
      const titleError = validateTitle(parsedData.title);
      if (titleError) {
        console.error(
          '読み込んだタイトルのバリデーションエラー:',
          titleError.message,
        );
        this.clearData();
        return null;
      }

      const leadError = validateLead(parsedData.lead);
      if (leadError) {
        console.error(
          '読み込んだリード文のバリデーションエラー:',
          leadError.message,
        );
        this.clearData();
        return null;
      }

      const markdownError = validateMarkdown(parsedData.markdown);
      if (markdownError) {
        console.error(
          '読み込んだMarkdownのバリデーションエラー:',
          markdownError.message,
        );
        this.clearData();
        return null;
      }

      // 必須フィールドの確認
      if (!parsedData.date || !parsedData.savedAt) {
        console.warn('読み込んだデータに必須フィールドが不足しています');
        this.clearData();
        return null;
      }

      return parsedData;
    } catch (error) {
      console.error('ローカルストレージからの読み込みに失敗:', error);

      // データが破損している場合の処理
      if (error instanceof SyntaxError) {
        console.warn('保存されたデータが破損しています。クリアします。');
        this.clearData();
      }
      return null;
    }
  }

  /**
   * ローカルストレージのデータをクリアする
   */
  clearData(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('ローカルストレージのクリアに失敗:', error);
    }
  }
}

/**
 * Markdownファイルのフロントマター部分を解析する
 */

/**
 * フロントマター解析結果の型定義
 */
interface ParsedMarkdown {
  frontmatter: Frontmatter;
  markdown: string;
}

/**
 * Markdownコンテンツを解析し、フロントマターとMarkdown本文を分離する
 * @param content - Markdownコンテンツ
 * @returns 解析結果
 */
function parse(content: string): ParsedMarkdown {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, markdown: content };
  }

  const frontmatterText = match[1];
  const markdown = content.substring(match[0].length);
  const frontmatter: Frontmatter = {};

  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const trimmedKey = key.trim();
      const value = valueParts
        .join(':')
        .trim()
        .replace(/^['"]|['"]$/g, '');

      if (trimmedKey === 'tag') {
        // 配列リテラル形式 ['blog', 'event'] を解析
        if (value.startsWith('[') && value.endsWith(']')) {
          // 配列の中身を抽出
          const arrayContent = value.slice(1, -1);
          if (arrayContent.trim()) {
            frontmatter.tags = arrayContent
              .split(',')
              .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
              .filter(Boolean);
          } else {
            frontmatter.tags = [];
          }
        }
      } else if (
        trimmedKey === 'title' ||
        trimmedKey === 'date' ||
        trimmedKey === 'lead'
      ) {
        frontmatter[trimmedKey] = value;
      }
    }
  }

  return { frontmatter, markdown };
}

/**
 * Markdownから最初の画像パスを抽出する
 * @param markdown - Markdownテキスト
 * @returns 最初の画像パス、またはnull
 */
function extractFirstImagePath(markdown: string): string | null {
  const imageRegex = /!\[([^\]]*)\]\(([^\s']+)(?:\s+'([^']+)')?\)/g;
  const match = imageRegex.exec(markdown);
  return match ? match[2] : null;
}

/**
 * フロントマターデータを文字列に変換する
 * @param data - エディターデータ
 * @returns フロントマター文字列
 */
function generate(data: EditorData): string {
  let frontmatter = '---\n';

  // 基本フィールドを順序通りに追加
  for (const [key, value] of Object.entries(data)) {
    if (key === 'markdown' || key === 'savedAt' || key === 'cover') continue;

    if (key === 'tags' && Array.isArray(value)) {
      frontmatter += `tag: [${value.map((tag) => `'${tag}'`).join(', ')}]\n`;
    } else if (value) {
      frontmatter += `${key}: "${value}"\n`;
    }
  }

  // 画像が存在する場合、coverフィールドをauthor_name_mainの前に追加
  const firstImagePath = extractFirstImagePath(data.markdown);
  if (firstImagePath) {
    frontmatter += `cover: "${firstImagePath}"\n`;
  }

  frontmatter += '---\n';
  frontmatter += data.markdown || '';
  return frontmatter;
}

export const FrontmatterParser = {
  parse,
  generate,
};

/**
 * 画像処理とローカルストレージ保存のクラス
 */
export class ImageManager {
  private imageCounter = 0;

  constructor() {
    this.loadImageCounter();
  }

  private loadImageCounter(): void {
    const stored = localStorage.getItem('blog-editor-image-counter');
    this.imageCounter = stored ? Number.parseInt(stored, 10) : 0;
  }

  private saveImageCounter(): void {
    localStorage.setItem(
      'blog-editor-image-counter',
      this.imageCounter.toString(),
    );
  }

  /**
   * 画像をリサイズしてJPGに変換
   */
  private async resizeAndConvertImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // Object URLを作成して変数に保存
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        try {
          // アスペクト比を保持しながら横幅720pxにリサイズ
          const targetWidth = 720;
          const aspectRatio = img.height / img.width;
          const targetHeight = Math.round(targetWidth * aspectRatio);

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          if (ctx) {
            // 白背景を設定（透明な画像の場合）
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, targetWidth, targetHeight);

            // 画像を描画
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // JPEGとして出力（品質0.8）
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
          } else {
            reject(new Error('Canvas context not available'));
          }
        } finally {
          // 処理完了後にObject URLを解放（メモリリーク防止）
          URL.revokeObjectURL(objectUrl);
        }
      };

      img.onerror = () => {
        // エラー時もObject URLを解放
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image loading failed'));
      };

      img.src = objectUrl;
    });
  }

  /**
   * ローカルストレージに画像を保存
   */
  async saveImage(
    file: File,
  ): Promise<{ imageName: string; imageKey: string }> {
    try {
      // 画像をリサイズ・変換
      const dataUrl = await this.resizeAndConvertImage(file);

      // 画像番号をインクリメント
      this.imageCounter++;
      const imageName = `image_${this.imageCounter}`;
      const imageKey = `blog-editor-image-${imageName}`;

      // localStorage容量チェック
      try {
        localStorage.setItem(imageKey, dataUrl);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          throw new Error('ストレージ容量が不足しています。不要な画像を削除してください。');
        }
        throw e;
      }

      this.saveImageCounter();

      return { imageName, imageKey };
    } catch (error) {
      console.error('画像の保存に失敗しました:', error);
      throw error;
    }
  }

  /**
   * 保存された画像をBase64データURLとして取得
   */
  getImageData(imageKey: string): string | null {
    return localStorage.getItem(imageKey);
  }

  /**
   * 画像名からBase64データを取得
   */
  getImageDataByName(imageName: string): string | null {
    const imageKey = `blog-editor-image-${imageName}`;
    return localStorage.getItem(imageKey);
  }

  /**
   * すべての保存された画像のリストを取得
   */
  getAllImages(): Array<{ key: string; name: string }> {
    const images: Array<{ key: string; name: string }> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('blog-editor-image-')) {
        const name = key.replace('blog-editor-image-', '');
        images.push({ key, name });
      }
    }
    return images;
  }
}
