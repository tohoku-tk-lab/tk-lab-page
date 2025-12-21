/**
 * UI管理クラス
 * タグ表示、ボタン状態管理、イベントハンドラーを管理
 */

import type { EditorData } from '../types/editor.ts';
import { FrontmatterParser } from './markdown-editor.ts';
import type { LocalStorageManager, TagManager } from './markdown-editor.ts';

/**
 * UI要素の管理クラス
 * DOM要素の参照と操作を管理
 */
export class UIManager {
  private elements: {
    titleInput?: HTMLInputElement;
    dateInput?: HTMLInputElement;
    leadInput?: HTMLTextAreaElement;
    authorInput?: HTMLInputElement;
    markdownEditor?: HTMLTextAreaElement;
    preview?: HTMLElement;
    saveBtn?: HTMLButtonElement;
    loadBtn?: HTMLButtonElement;
    downloadBtn?: HTMLButtonElement;
    fileInput?: HTMLInputElement;
    autoSaveStatus?: HTMLElement;
    lastUpdate?: HTMLElement;
    selectedTags?: HTMLElement;
    customTagInput?: HTMLInputElement;
    addCustomTagBtn?: HTMLButtonElement;
    predefinedTagButtons?: NodeListOf<HTMLButtonElement>;
  } = {};

  /**
   * DOM要素を初期化する
   */
  initializeElements(): void {
    this.elements = {
      titleInput: document.getElementById('title') as HTMLInputElement,
      dateInput: document.getElementById('date') as HTMLInputElement,
      leadInput: document.getElementById('lead') as HTMLTextAreaElement,
      authorInput: document.getElementById('author') as HTMLInputElement,
      markdownEditor: document.getElementById(
        'markdownEditor',
      ) as HTMLTextAreaElement,
      preview: document.getElementById('preview') || undefined,
      saveBtn: document.getElementById('saveBtn') as HTMLButtonElement,
      loadBtn: document.getElementById('loadBtn') as HTMLButtonElement,
      downloadBtn: document.getElementById('downloadBtn') as HTMLButtonElement,
      fileInput: document.getElementById('fileInput') as HTMLInputElement,
      autoSaveStatus: document.getElementById('autoSaveStatus') || undefined,
      lastUpdate: document.getElementById('lastUpdate') || undefined,
      selectedTags: document.getElementById('selectedTags') || undefined,
      customTagInput: document.getElementById('customTag') as HTMLInputElement,
      addCustomTagBtn: document.getElementById(
        'addCustomTag',
      ) as HTMLButtonElement,
      predefinedTagButtons: document.querySelectorAll(
        '#predefinedTags .tag-button',
      ),
    };
  }

  /**
   * 指定された要素を取得する
   * @param key - 要素のキー
   * @returns 要素、またはundefined
   */
  getElement<K extends keyof UIManager['elements']>(
    key: K,
  ): UIManager['elements'][K] {
    return this.elements[key];
  }

  /**
   * プレビュー要素を更新する
   * @param html - 表示するHTML
   */
  updatePreview(html: string): void {
    if (this.elements.preview) {
      this.elements.preview.innerHTML = html;
    }
  }

  /**
   * 自動保存ステータスを更新する
   * @param status - ステータステキスト
   */
  updateAutoSaveStatus(status: string): void {
    if (this.elements.autoSaveStatus) {
      this.elements.autoSaveStatus.textContent = status;
    }
  }

  /**
   * 最終更新時刻を更新する
   */
  updateLastUpdate(): void {
    if (this.elements.lastUpdate) {
      this.elements.lastUpdate.textContent = new Date().toLocaleString('ja-JP');
    }
  }

  /**
   * タグ表示を更新する
   * @param tagManager - タグ管理クラス
   */
  updateTagDisplay(tagManager: TagManager): void {
    if (!this.elements.selectedTags) return;

    // 選択されたタグの表示をクリア
    this.elements.selectedTags.innerHTML = '';

    // 選択されたタグを表示
    for (const tag of tagManager.getTags()) {
      const tagElement = document.createElement('span');
      tagElement.className =
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800';

      // XSS攻撃を防止するため、textContentを使用してタグ名を安全に設定
      const tagText = document.createTextNode(tag);
      tagElement.appendChild(tagText);

      // 削除ボタンを安全に作成
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'ml-2 text-blue-600 hover:text-blue-800';
      removeButton.textContent = '×';
      removeButton.addEventListener('click', () => {
        if (window.removeTag) {
          window.removeTag(tag);
        }
      });

      tagElement.appendChild(removeButton);
      this.elements.selectedTags?.appendChild(tagElement);
    }

    // 定義済みタグボタンの状態を更新
    this.updatePredefinedTagButtons(tagManager);
  }

  /**
   * 定義済みタグボタンの状態を更新する
   * @param tagManager - タグ管理クラス
   */
  private updatePredefinedTagButtons(tagManager: TagManager): void {
    if (!this.elements.predefinedTagButtons) return;

    for (const btn of this.elements.predefinedTagButtons) {
      const tag = btn.dataset.tag;
      if (!tag) continue;

      // 選択状態の更新
      if (tagManager.isTagSelected(tag)) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }

      // 最大数制限の更新
      if (tagManager.isMaxTagsReached() && !tagManager.isTagSelected(tag)) {
        btn.classList.add('disabled');
        btn.disabled = true;
      } else {
        btn.classList.remove('disabled');
        btn.disabled = false;
      }
    }
  }

  /**
   * 初期値を設定する
   * @param initialTemplate - 初期Markdownテンプレート
   */
  setInitialValues(initialTemplate: string): void {
    // 現在の日付を設定
    const today = new Date().toISOString().split('T')[0];
    if (this.elements.dateInput) {
      this.elements.dateInput.value = today;
    }

    // 初期テンプレートを設定
    if (this.elements.markdownEditor) {
      this.elements.markdownEditor.value = initialTemplate;
    }
  }

  /**
   * エディターデータをUIに反映する
   * @param data - エディターデータ
   * @param tagManager - タグ管理クラス
   */
  setEditorData(data: Partial<EditorData>, tagManager: TagManager): void {
    if (this.elements.titleInput) {
      this.elements.titleInput.value = data.title || '';
    }
    if (this.elements.dateInput) {
      this.elements.dateInput.value =
        data.date || new Date().toISOString().split('T')[0];
    }
    if (this.elements.leadInput) {
      this.elements.leadInput.value = data.lead || '';
    }
    if (this.elements.authorInput) {
      // デフォルトメッセージの場合は空にする
      const isDefaultMessage = data.author_name_main === '著者名を入力(不要な場合には行全体を削除)';
      this.elements.authorInput.value = isDefaultMessage ? '' : (data.author_name_main || '');
    }
    if (this.elements.markdownEditor) {
      this.elements.markdownEditor.value = data.markdown || '';
    }

    // タグを設定
    tagManager.setTags(data.tags || []);
    this.updateTagDisplay(tagManager);
  }

  /**
   * 現在のUIからエディターデータを取得する
   * @param tagManager - タグ管理クラス
   * @returns エディターデータ
   */
  getEditorData(tagManager: TagManager): EditorData {
    const authorValue = this.elements.authorInput?.value?.trim() || '';
    return {
      title: this.elements.titleInput?.value || '',
      date: this.elements.dateInput?.value || '',
      lead: this.elements.leadInput?.value || '',
      tags: tagManager.getTags(),
      author_name_main: authorValue || '著者名を入力(不要な場合には行全体を削除)',
      markdown: this.elements.markdownEditor?.value || '',
      savedAt: new Date().toISOString(),
    };
  }
}

/**
 * イベントハンドラー管理クラス
 * UI要素のイベントリスナーを管理
 */
export class EventHandlerManager {
  private uiManager: UIManager;
  private tagManager: TagManager;
  private localStorageManager: LocalStorageManager;
  private updatePreviewFunction: (markdown: string) => string;
  private autoSaveInterval?: number;

  constructor(
    uiManager: UIManager,
    tagManager: TagManager,
    localStorageManager: LocalStorageManager,
    updatePreviewFunction: (markdown: string) => string,
  ) {
    this.uiManager = uiManager;
    this.tagManager = tagManager;
    this.localStorageManager = localStorageManager;
    this.updatePreviewFunction = updatePreviewFunction;
  }

  /**
   * すべてのイベントリスナーを設定する
   */
  setupEventListeners(): void {
    this.setupMarkdownEditorListener();
    this.setupFormInputListeners();
    this.setupButtonListeners();
    this.setupTagListeners();
    this.setupFileInputListener();
    this.setupAutoSave();
  }

  /**
   * Markdownエディターのイベントリスナーを設定する
   */
  private setupMarkdownEditorListener(): void {
    const markdownEditor = this.uiManager.getElement('markdownEditor');
    if (markdownEditor) {
      markdownEditor.addEventListener('input', () => {
        const markdown = markdownEditor.value;
        const html = this.updatePreviewFunction(markdown);
        this.uiManager.updatePreview(html);
        this.uiManager.updateAutoSaveStatus('自動保存: 未保存');
      });
    }
  }

  /**
   * フォーム入力要素のイベントリスナーを設定する
   */
  private setupFormInputListeners(): void {
    const inputs = [
      this.uiManager.getElement('titleInput'),
      this.uiManager.getElement('dateInput'),
      this.uiManager.getElement('leadInput'),
      this.uiManager.getElement('authorInput'),
    ];

    for (const input of inputs) {
      if (input) {
        input.addEventListener('input', () => {
          this.uiManager.updateAutoSaveStatus('自動保存: 未保存');
        });
      }
    }
  }

  /**
   * ボタンのイベントリスナーを設定する
   */
  private setupButtonListeners(): void {
    // 保存ボタン
    const saveBtn = this.uiManager.getElement('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const data = this.uiManager.getEditorData(this.tagManager);
        const success = this.localStorageManager.saveData(data);
        if (success) {
          this.uiManager.updateAutoSaveStatus('自動保存: 保存済み');
          this.uiManager.updateLastUpdate();
        } else {
          this.uiManager.updateAutoSaveStatus('自動保存: 保存失敗');
        }
      });
    }

    // ダウンロードボタン
    const downloadBtn = this.uiManager.getElement('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadMarkdown();
      });
    }

    // ファイル読み込みボタン
    const loadBtn = this.uiManager.getElement('loadBtn');
    const fileInput = this.uiManager.getElement('fileInput');
    if (loadBtn && fileInput) {
      loadBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }
  }

  /**
   * タグ関連のイベントリスナーを設定する
   */
  private setupTagListeners(): void {
    // 定義済みタグボタン
    const predefinedTagButtons = this.uiManager.getElement(
      'predefinedTagButtons',
    );
    if (predefinedTagButtons) {
      for (const btn of predefinedTagButtons) {
        btn.addEventListener('click', () => {
          const tag = btn.dataset.tag;
          if (!tag) return;

          if (this.tagManager.isTagSelected(tag)) {
            this.tagManager.removeTag(tag);
          } else {
            this.tagManager.addTag(tag);
          }
          this.uiManager.updateTagDisplay(this.tagManager);
          this.saveToLocalStorage();
        });
      }
    }

    // カスタムタグ追加
    const addCustomTagBtn = this.uiManager.getElement('addCustomTagBtn');
    const customTagInput = this.uiManager.getElement('customTagInput');
    if (addCustomTagBtn && customTagInput) {
      addCustomTagBtn.addEventListener('click', () => {
        const customTag = customTagInput.value.trim();
        if (customTag) {
          this.tagManager.addTag(customTag);
          this.uiManager.updateTagDisplay(this.tagManager);
          customTagInput.value = '';
          this.saveToLocalStorage();
        }
      });

      customTagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (addCustomTagBtn) {
            addCustomTagBtn.click();
          }
        }
      });
    }
  }

  /**
   * ファイル入力のイベントリスナーを設定する
   */
  private setupFileInputListener(): void {
    const fileInput = this.uiManager.getElement('fileInput');
    if (fileInput) {
      fileInput.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file && file.type === 'text/markdown') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target && (e.target.result as string);
            if (content) {
              this.parseFrontmatter(content);
            }
          };
          reader.readAsText(file);
        }
      });
    }
  }

  /**
   * 自動保存の設定
   */
  private setupAutoSave(): void {
    this.autoSaveInterval = window.setInterval(() => {
      const autoSaveStatus = this.uiManager.getElement('autoSaveStatus');
      if (autoSaveStatus?.textContent?.includes('未保存')) {
        this.saveToLocalStorage();
      }
    }, 5000);
  }

  /**
   * イベントリスナーとタイマーをクリーンアップする
   */
  cleanup(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }
  }

  /**
   * ローカルストレージに保存する
   */
  private saveToLocalStorage(): void {
    const data = this.uiManager.getEditorData(this.tagManager);
    const success = this.localStorageManager.saveData(data);
    if (success) {
      this.uiManager.updateAutoSaveStatus('自動保存: 保存済み');
      this.uiManager.updateLastUpdate();
    } else {
      this.uiManager.updateAutoSaveStatus('自動保存: 保存失敗');
    }
  }

  /**
   * Markdownファイルと画像をZIPファイルとしてダウンロードする
   */
  private async downloadMarkdown(): Promise<void> {
    try {
      const data = this.uiManager.getEditorData(this.tagManager);
      const frontmatter = FrontmatterParser.generate(data);

      // エディター内で実際に使用されている画像のみを取得
      const usedImages = this.getUsedImagesFromMarkdown(data.markdown);

      if (usedImages.length === 0) {
        // 画像がない場合はMarkdownファイルのみダウンロード
        this.downloadMarkdownOnly(data, frontmatter);
        return;
      }

      // ZIPファイルを生成
      await this.createAndDownloadZip(data, frontmatter, usedImages);
    } catch (error) {
      console.error('ZIPファイルの生成に失敗しました:', error);
      alert(
        'ZIPファイルの生成に失敗しました。Markdownファイルのみダウンロードします。',
      );

      // フォールバック: Markdownファイルのみダウンロード
      const data = this.uiManager.getEditorData(this.tagManager);
      const frontmatter = FrontmatterParser.generate(data);
      this.downloadMarkdownOnly(data, frontmatter);
    }
  }

  /**
   * Markdownファイルのみをダウンロードする（フォールバック用）
   */
  private downloadMarkdownOnly(_data: EditorData, frontmatter: string): void {
    const blob = new Blob([frontmatter], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Markdownテキストから実際に使用されている画像を抽出
   */
  private getUsedImagesFromMarkdown(
    markdown: string,
  ): Array<{ name: string; data: string }> {
    const usedImages: Array<{ name: string; data: string }> = [];

    // Markdown内の画像構文を抽出する正規表現
    const imageRegex = /!\[([^\]]*)\]\(([^\s']+)(?:\s+'([^']+)')?\)/g;
    let match: RegExpExecArray | null = imageRegex.exec(markdown);

    while (match !== null) {
      const imagePath = match[2]; // 画像のパス部分

      // ローカル画像パス（./image_name）の場合のみ処理
      if (imagePath.startsWith('./')) {
        const imageName = imagePath.substring(2); // './' を除去
        const imageData = localStorage.getItem(
          `blog-editor-image-${imageName}`,
        );

        if (imageData) {
          usedImages.push({ name: imageName, data: imageData });
        }
      }

      match = imageRegex.exec(markdown);
    }

    return usedImages;
  }

  /**
   * ZIPファイルを作成してダウンロードする
   */
  private async createAndDownloadZip(
    data: EditorData,
    frontmatter: string,
    images: Array<{ name: string; data: string }>,
  ): Promise<void> {
    // JSZipライブラリを動的にインポート
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // MarkdownファイルをZIPに追加
    zip.file('blog.md', frontmatter);

    // 画像ファイルをZIPに追加
    for (const image of images) {
      const imageExtension = this.getImageExtension(image.data);
      const base64Data = image.data.split(',')[1]; // data:image/jpeg;base64, の部分を除去

      // Base64データをバイナリに変換
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      zip.file(`${image.name}.${imageExtension}`, bytes);
    }

    // ZIPファイルを生成してダウンロード
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title || 'blog'}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Base64データURLから画像の拡張子を取得
   */
  private getImageExtension(dataUrl: string): string {
    if (dataUrl.startsWith('data:image/jpeg')) return 'jpeg';
    if (dataUrl.startsWith('data:image/png')) return 'png';
    if (dataUrl.startsWith('data:image/webp')) return 'webp';
    if (dataUrl.startsWith('data:image/gif')) return 'gif';
    return 'jpeg'; // デフォルト
  }

  /**
   * フロントマターを解析してUIに反映する
   * @param content - Markdownコンテンツ
   */
  private parseFrontmatter(content: string): void {
    const { frontmatter, markdown } = FrontmatterParser.parse(content);

    // フロントマターの値をUIに設定
    const titleInput = this.uiManager.getElement('titleInput');
    if (frontmatter.title && titleInput) {
      titleInput.value = frontmatter.title;
    }
    const dateInput = this.uiManager.getElement('dateInput');
    if (frontmatter.date && dateInput) {
      dateInput.value = frontmatter.date;
    }
    const leadInput = this.uiManager.getElement('leadInput');
    if (frontmatter.lead && leadInput) {
      leadInput.value = frontmatter.lead;
    }
    const authorInput = this.uiManager.getElement('authorInput');
    if (authorInput) {
      // デフォルトメッセージの場合は空にする
      const isDefaultMessage = frontmatter.author_name_main === '著者名を入力(不要な場合には行全体を削除)';
      authorInput.value = isDefaultMessage ? '' : (frontmatter.author_name_main || '');
    }
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      this.tagManager.setTags(frontmatter.tags);
      this.uiManager.updateTagDisplay(this.tagManager);
    }

    // Markdownをエディターに設定
    const markdownEditor = this.uiManager.getElement('markdownEditor');
    if (markdownEditor) {
      markdownEditor.value = markdown;
    }

    // プレビューを更新
    const html = this.updatePreviewFunction(markdown);
    this.uiManager.updatePreview(html);

    // ローカルストレージに保存
    this.saveToLocalStorage();
  }
}

/**
 * グローバル関数としてタグ削除機能を提供
 * @param tag - 削除するタグ
 */
declare global {
  interface Window {
    removeTag: (tag: string) => void;
  }
}

/**
 * グローバル関数としてタグ削除機能を設定する
 * @param tagManager - タグ管理クラス
 * @param uiManager - UI管理クラス
 * @param localStorageManager - ローカルストレージ管理クラス
 */
export function setupGlobalFunctions(
  tagManager: TagManager,
  uiManager: UIManager,
  localStorageManager: LocalStorageManager,
): void {
  window.removeTag = (tag: string) => {
    tagManager.removeTag(tag);
    uiManager.updateTagDisplay(tagManager);

    // ローカルストレージに保存
    const data = uiManager.getEditorData(tagManager);
    const success = localStorageManager.saveData(data);
    if (success) {
      uiManager.updateAutoSaveStatus('自動保存: 保存済み');
      uiManager.updateLastUpdate();
    } else {
      uiManager.updateAutoSaveStatus('自動保存: 保存失敗');
    }
  };
}
