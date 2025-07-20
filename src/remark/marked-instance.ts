/**
 * markedインスタンスを取得するためのユーティリティ
 */

/**
 * window.markedに期待される型
 */
interface Marked {
  parse: (markdown: string) => string;
  setOptions: (options: object) => void;
}

/**
 * windowからmarkedインスタンスを安全に取得する
 * @returns Markedのインスタンス
 * @throws window.markedが定義されていない場合にエラーを投げる
 */
export function getMarkedInstance(): Marked {
  if (typeof window !== 'undefined' && 'marked' in window) {
    return (window as Window & { marked: Marked }).marked;
  }
  throw new Error('marked library is not loaded');
}
