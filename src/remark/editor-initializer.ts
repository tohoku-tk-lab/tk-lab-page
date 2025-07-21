/**
 * エディター初期化クラス
 * エディターの初期化とイベント管理を担当
 */

import type { LocalStorageManager, TagManager } from './markdown-editor.ts';
import { getMarkedInstance } from './marked-instance.ts';
import type { EventHandlerManager, UIManager } from './ui-manager.ts';
import { setupGlobalFunctions } from './ui-manager.ts';

/**
 * 初期テンプレートの定義
 * エディター起動時に表示されるサンプルMarkdown
 */
export const INITIAL_TEMPLATE = `# サンプル記事

## 見出し2

これは**太字**、これは*斜体*のテキストです。

### 見出し3

- リストアイテム1
- リストアイテム2
- リストアイテム3

#### コードブロック

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

#### GitHub Alerts

> [!NOTE]
> これは情報メモです。

#### カスタムアラート

> [!CUSTOM] purple rocket this is custom title
> これはカスタムアラートです。

#### テーブル

| 項目 | 値 |
|------|-----|
| 名前 | 例 |
| 年齢 | 20 |

#### リンク

[リンクテキスト](https://example.com)

#### チェックリスト

- [x] 完了済みタスク
- [ ] 未完了タスク
- [ ] 別の未完了タスク
`;

/**
 * Markdownパーサーの設定を初期化する
 * markedライブラリの設定を行う
 */
export function initializeMarkdownParser(): void {
    try {
        const marked = getMarkedInstance();
        marked.setOptions({
            breaks: true,
            gfm: true,
            sanitize: true,
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * エディターの初期化処理を実行する
 * @param uiManager - UI管理クラス
 * @param tagManager - タグ管理クラス
 * @param localStorageManager - ローカルストレージ管理クラス
 * @param eventHandlerManager - イベントハンドラー管理クラス
 * @param updatePreviewFunction - プレビュー更新関数
 */
export function initializeEditor(
    uiManager: UIManager,
    tagManager: TagManager,
    localStorageManager: LocalStorageManager,
    eventHandlerManager: EventHandlerManager,
    updatePreviewFunction: (markdown: string) => string,
): void {
    // DOM要素を初期化
    uiManager.initializeElements();

    // Markdownパーサーを初期化
    initializeMarkdownParser();

    // 初期値を設定
    uiManager.setInitialValues(INITIAL_TEMPLATE);

    // ローカルストレージから復元
    loadFromLocalStorage(
        uiManager,
        tagManager,
        localStorageManager,
        updatePreviewFunction,
    );

    // イベントリスナーを設定
    eventHandlerManager.setupEventListeners();

    // グローバル関数を設定
    setupGlobalFunctions(tagManager, uiManager, localStorageManager);

    // 初期プレビューを更新
    updateEditorPreview(uiManager, updatePreviewFunction);

    // 最終更新時刻を更新
    uiManager.updateLastUpdate();
}

/**
 * プレビューエリアを更新する
 * @param uiManager - UI管理クラス
 * @param updatePreviewFunction - プレビュー更新関数
 */
function updateEditorPreview(
    uiManager: UIManager,
    updatePreviewFunction: (markdown: string) => string,
): void {
    const markdownEditor = uiManager.getElement('markdownEditor');
    if (markdownEditor) {
        const html = updatePreviewFunction(markdownEditor.value);
        uiManager.updatePreview(html);
    }
}

/**
 * ローカルストレージからデータを復元する
 * @param uiManager - UI管理クラス
 * @param tagManager - タグ管理クラス
 * @param localStorageManager - ローカルストレージ管理クラス
 * @param updatePreviewFunction - プレビュー更新関数
 */
function loadFromLocalStorage(
    uiManager: UIManager,
    tagManager: TagManager,
    localStorageManager: LocalStorageManager,
    updatePreviewFunction: (markdown: string) => string,
): void {
    const savedData = localStorageManager.loadData();
    if (!savedData) {
        return;
    }

    try {
        // 保存されたデータをUIに反映
        uiManager.setEditorData(savedData, tagManager);
        updateEditorPreview(uiManager, updatePreviewFunction);
        uiManager.updateAutoSaveStatus('自動保存: 復元済み');
    } catch (err) {
        console.error('ローカルストレージからの復元に失敗:', err);
    }
}
