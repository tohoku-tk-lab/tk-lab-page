/**
 * markedインスタンスを取得するためのユーティリティ
 */

import { marked } from 'marked';

/**
 * 同期版のmarkedインスタンスを提供する
 * 新しいバージョンのmarkedは非同期だが、エディターでは同期処理が必要
 */
interface MarkedSync {
  parse: (markdown: string) => string;
  setOptions: (options: any) => void;
}

/**
 * markedの同期版インスタンスを取得する
 * @returns 同期版Markedのインスタンス
 */
export function getMarkedInstance(): MarkedSync {
  return {
    parse: (markdown: string): string => {
      // marked.parseがPromiseを返す場合は、markedを直接関数として呼び出す
      const result = marked(markdown);
      if (typeof result === 'string') {
        return result;
      }
      // 非同期の場合はエラーとして処理（エディターでは同期処理が必要）
      throw new Error('Marked returned a Promise, but synchronous parsing is required');
    },
    setOptions: (options: any) => {
      marked.setOptions(options);
    }
  };
}
