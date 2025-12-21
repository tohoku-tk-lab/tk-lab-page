/**
 * テキストエディターのフォーマット機能
 * Markdown記法の挿入やテキスト編集のユーティリティ関数
 */

/**
 * textareaの更新後の共通処理
 */
function finalizeEdit(
    textarea: HTMLTextAreaElement,
    newStart: number,
    newEnd: number = newStart,
): void {
    textarea.setSelectionRange(newStart, newEnd);
    textarea.focus();
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * インライン書式をトグルする共通関数
 * @param textarea - テキストエリア要素
 * @param marker - 書式のマーカー（例: '**', '*', '~~', '`'）
 * @param isFormatted - カスタムの書式チェック関数（オプション）
 */
function toggleInlineFormat(
    textarea: HTMLTextAreaElement,
    marker: string,
    isFormatted?: (before: string, after: string) => boolean,
): void {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    const len = marker.length;

    const hasFormat = isFormatted
        ? isFormatted(before, after)
        : before.endsWith(marker) && after.startsWith(marker);

    if (hasFormat) {
        // 書式を削除
        textarea.value = before.slice(0, -len) + selectedText + after.slice(len);
        finalizeEdit(textarea, start - len, end - len);
    } else if (selectedText.length > 0) {
        // 選択テキストに書式を適用
        textarea.value = before + marker + selectedText + marker + after;
        finalizeEdit(textarea, start + len, end + len);
    } else {
        // 空のマーカーを挿入してカーソルを中央に
        textarea.value = before + marker + marker + after;
        finalizeEdit(textarea, start + len);
    }
}

/**
 * 見出しをトグルする（カーソルがある行の先頭の#を切り替える）
 * - 既存の見出しがない場合：見出しを追加
 * - 同じレベルの見出しがある場合：見出しを削除
 * - 異なるレベルの見出しがある場合：そのレベルに変更
 * @param textarea - テキストエリア要素
 * @param level - 見出しレベル（1, 2, または 3）
 */
export function toggleHeading(
    textarea: HTMLTextAreaElement,
    level: 1 | 2 | 3,
): void {
    const cursorPosition = textarea.selectionStart;
    const text = textarea.value;

    // カーソル位置から行の先頭・終端を見つける
    let lineStart = cursorPosition;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') {
        lineStart--;
    }
    let lineEnd = cursorPosition;
    while (lineEnd < text.length && text[lineEnd] !== '\n') {
        lineEnd++;
    }

    const lineText = text.substring(lineStart, lineEnd);
    const headingMatch = lineText.match(/^(#{1,6})\s/);
    const existingLevel = headingMatch ? headingMatch[1].length : 0;

    const before = text.substring(0, lineStart);
    const after = text.substring(lineEnd);

    let newLineText: string;
    let cursorOffset: number;

    if (existingLevel === level) {
        // 同じレベル → 見出しを削除
        newLineText = lineText.replace(/^#{1,6}\s/, '');
        cursorOffset = -(level + 1);
    } else if (existingLevel > 0) {
        // 異なるレベル → レベルを変更
        const newHeadingMark = `${'#'.repeat(level)} `;
        newLineText = lineText.replace(/^#{1,6}\s/, newHeadingMark);
        cursorOffset = level - existingLevel;
    } else {
        // 見出しがない → 追加
        const headingMark = `${'#'.repeat(level)} `;
        newLineText = headingMark + lineText;
        cursorOffset = level + 1;
    }

    textarea.value = before + newLineText + after;
    const newPosition = Math.max(lineStart, cursorPosition + cursorOffset);
    finalizeEdit(textarea, newPosition);
}

/**
 * カーソル位置にテキストを挿入する
 * @param textarea - テキストエリア要素
 * @param text - 挿入するテキスト
 */
export function insertTextAtCursor(
    textarea: HTMLTextAreaElement,
    text: string,
): void {
    const start = textarea.selectionStart;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(textarea.selectionEnd);

    textarea.value = before + text + after;
    finalizeEdit(textarea, start + text.length);
}

/** 太字をトグルする */
export function toggleBold(textarea: HTMLTextAreaElement): void {
    toggleInlineFormat(textarea, '**');
}

/** イタリックをトグルする */
export function toggleItalic(textarea: HTMLTextAreaElement): void {
    toggleInlineFormat(
        textarea,
        '*',
        (before, after) =>
            before.endsWith('*') &&
            after.startsWith('*') &&
            !before.endsWith('**') &&
            !after.startsWith('**'),
    );
}

/** 打ち消し線をトグルする */
export function toggleStrikethrough(textarea: HTMLTextAreaElement): void {
    toggleInlineFormat(textarea, '~~');
}

/** インラインコードをトグルする */
export function toggleCode(textarea: HTMLTextAreaElement): void {
    toggleInlineFormat(textarea, '`');
}
