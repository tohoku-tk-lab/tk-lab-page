/**
 * Markdownエディターの主要な機能を管理するTypeScriptモジュール
 * アラート処理、プレビュー更新、タグ管理などの機能を提供
 */

import type { EditorData, EditorError, TagManagerInterface, LocalStorageManagerInterface } from '../types/editor.ts';
import { EDITOR_CONSTANTS } from '../types/editor.ts';
import { DEFAULT_GITHUB_ICONS } from './icons.ts';
import { getMarkedInstance } from './marked-instance.ts';

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
export class EditorValidator {
    /**
     * タグのバリデーション
     */
    static validateTag(tag: string): EditorError | null {
        if (!tag || typeof tag !== 'string') {
            return {
                type: 'validation',
                message: 'タグは文字列である必要があります',
                details: { tag }
            };
        }

        const trimmedTag = tag.trim();
        if (trimmedTag.length === 0) {
            return {
                type: 'validation',
                message: 'タグは空にできません',
                details: { tag }
            };
        }

        if (trimmedTag.length > 50) {
            return {
                type: 'validation',
                message: 'タグは50文字以内である必要があります',
                details: { tag, length: trimmedTag.length }
            };
        }

        // 特殊文字のチェック（XSS対策）
        const invalidChars = /[<>\"'&]/;
        if (invalidChars.test(trimmedTag)) {
            return {
                type: 'validation',
                message: 'タグに特殊文字は使用できません',
                details: { tag }
            };
        }

        return null;
    }

    /**
     * タイトルのバリデーション
     */
    static validateTitle(title: string): EditorError | null {
        if (typeof title !== 'string') {
            return {
                type: 'validation',
                message: 'タイトルは文字列である必要があります',
                details: { title }
            };
        }

        const trimmedTitle = title.trim();
        if (trimmedTitle.length > EDITOR_CONSTANTS.MAX_TITLE_LENGTH) {
            return {
                type: 'validation',
                message: `タイトルは${EDITOR_CONSTANTS.MAX_TITLE_LENGTH}文字以内である必要があります`,
                details: { title, length: trimmedTitle.length }
            };
        }

        return null;
    }

    /**
     * リード文のバリデーション
     */
    static validateLead(lead: string): EditorError | null {
        if (lead && typeof lead !== 'string') {
            return {
                type: 'validation',
                message: 'リード文は文字列である必要があります',
                details: { lead }
            };
        }

        if (lead && lead.length > EDITOR_CONSTANTS.MAX_LEAD_LENGTH) {
            return {
                type: 'validation',
                message: `リード文は${EDITOR_CONSTANTS.MAX_LEAD_LENGTH}文字以内である必要があります`,
                details: { lead, length: lead.length }
            };
        }

        return null;
    }

    /**
     * Markdownのバリデーション
     */
    static validateMarkdown(markdown: string): EditorError | null {
        if (!markdown || typeof markdown !== 'string') {
            return {
                type: 'validation',
                message: 'Markdownは文字列である必要があります',
                details: { markdown }
            };
        }

        if (markdown.length > EDITOR_CONSTANTS.MAX_MARKDOWN_LENGTH) {
            return {
                type: 'validation',
                message: `Markdownは${EDITOR_CONSTANTS.MAX_MARKDOWN_LENGTH}文字以内である必要があります`,
                details: { markdown, length: markdown.length }
            };
        }

        return null;
    }
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
        ${processedContent}
      </div>
    </div>
  `;
}

/**
 * Markdownテキストをプレビュー用HTMLに変換する
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
            // アラートHTMLはそのまま、それ以外はmarkedでパース
            if (part.trim().startsWith('<div class="markdown-alert')) {
                return part;
            }
            return getMarkedInstance().parse(part);
        })
        .join('');

    return finalHtml;
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
            const validationError = EditorValidator.validateTag(tag);
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
                const validationError = EditorValidator.validateTag(tag);
                if (validationError) {
                    console.error('タグのバリデーションエラー:', validationError.message);
                    continue;
                }
                validatedTags.push(tag.trim());
            }

            // 最大数チェック
            if (validatedTags.length > this.maxTags) {
                console.warn(`タグが最大数(${this.maxTags})を超えています。最初の${this.maxTags}個のみ使用します。`);
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
            const titleError = EditorValidator.validateTitle(data.title);
            if (titleError) {
                console.error('タイトルのバリデーションエラー:', titleError.message);
                alert(titleError.message);
                return false;
            }

            const leadError = EditorValidator.validateLead(data.lead);
            if (leadError) {
                console.error('リード文のバリデーションエラー:', leadError.message);
                alert(leadError.message);
                return false;
            }

            const markdownError = EditorValidator.validateMarkdown(data.markdown);
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
            const titleError = EditorValidator.validateTitle(parsedData.title);
            if (titleError) {
                console.error('読み込んだタイトルのバリデーションエラー:', titleError.message);
                this.clearData();
                return null;
            }

            const leadError = EditorValidator.validateLead(parsedData.lead);
            if (leadError) {
                console.error('読み込んだリード文のバリデーションエラー:', leadError.message);
                this.clearData();
                return null;
            }

            const markdownError = EditorValidator.validateMarkdown(parsedData.markdown);
            if (markdownError) {
                console.error('読み込んだMarkdownのバリデーションエラー:', markdownError.message);
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
 * フロントマターデータを文字列に変換する
 * @param data - エディターデータ
 * @returns フロントマター文字列
 */
function generate(data: EditorData): string {
    let frontmatter = '---\n';
    for (const [key, value] of Object.entries(data)) {
        if (key === 'markdown' || key === 'savedAt') continue;

        if (key === 'tags' && Array.isArray(value)) {
            frontmatter += `tag: [${value.map((tag) => `'${tag}'`).join(', ')}]\n`;
        } else if (value) {
            frontmatter += `${key}: "${value}"\n`;
        }
    }
    frontmatter += '---\n';
    frontmatter += data.markdown || '';
    return frontmatter;
}

export const FrontmatterParser = {
    parse,
    generate,
};
