/**
 * @file エディター関連の型定義
 */

/**
 * エディターのデータ構造を定義するインターフェース
 */
export interface EditorData {
  title: string;
  date: string;
  lead: string;
  tags: string[];
  markdown: string;
  savedAt: string;
}
