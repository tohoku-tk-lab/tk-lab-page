/**
 * 名前の正規化を行う関数
 * 半角スペースと全角スペースを削除して比較用の文字列を生成
 */
export function normalizeName(name: string): string {
  return name.replace(/[\s\u3000]/g, '');
}

/**
 * 名前のマッチングを行う関数
 * 両方の名前を正規化してから比較
 */
export function matchNames(name1: string, name2: string): boolean {
  return normalizeName(name1) === normalizeName(name2);
}
