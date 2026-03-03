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
  author_name_main: string;
  cover?: string;
  markdown: string;
  savedAt: string;
}

/**
 * エディター定数
 */
export const EDITOR_CONSTANTS = {
  MAX_TAGS: 5,
  AUTO_SAVE_INTERVAL: 5000, // 5秒
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_TITLE_LENGTH: 100,
  MAX_LEAD_LENGTH: 500,
  MAX_MARKDOWN_LENGTH: 100000, // 100KB
} as const;

/**
 * フロントマターの型定義
 */
export interface Frontmatter {
  title?: string;
  date?: string;
  lead?: string;
  tags?: string[];
  author_name_main?: string;
}

/**
 * エディターエラーの型定義
 */
export interface EditorError {
  type: 'validation' | 'storage' | 'parsing' | 'network';
  message: string;
  details?: unknown;
}

/**
 * タグ管理の型定義
 */
export interface TagManagerInterface {
  addTag(tag: string): boolean;
  removeTag(tag: string): void;
  getTags(): readonly string[];
  setTags(tags: string[]): void;
  isTagSelected(tag: string): boolean;
  isMaxTagsReached(): boolean;
}

/**
 * ローカルストレージ管理の型定義
 */
export interface LocalStorageManagerInterface {
  saveData(data: EditorData): boolean;
  loadData(): EditorData | null;
  clearData(): void;
}
