/**
 * HTMLサニタイゼーション機能
 * DOMPurifyを使用してXSS攻撃を防止しつつ、
 * 必要なHTML要素（カスタムアラートなど）は安全に許可する
 */

import DOMPurify from 'dompurify';

/**
 * マークダウンアラート用の許可されたHTML要素とその属性
 */
const ALLOWED_ALERT_TAGS = [
  'div',
  'span',
  'svg',
  'path',
  'p',
  'strong',
  'em',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'br',
  'img',
];

const ALLOWED_ALERT_ATTRIBUTES = [
  'class',
  'style',
  'xmlns',
  'fill',
  'height',
  'width',
  'viewBox',
  'd',
  'href',
  'target',
  'rel',
  'src',
  'alt',
  'title',
];

/**
 * 一般的なMarkdownコンテンツ用の基本的な許可タグ
 */
const ALLOWED_BASIC_TAGS = [
  'p',
  'strong',
  'b',
  'em',
  'i',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'br',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'img',
];

const ALLOWED_BASIC_ATTRIBUTES = [
  'href',
  'target',
  'rel',
  'class',
  'src',
  'alt',
  'title',
];

/**
 * カスタムアラートを含むHTMLをサニタイズする
 * アラートの構造とスタイリングに必要な要素を許可
 * @param html - サニタイズ対象のHTML
 * @returns サニタイズされたHTML
 */
export function sanitizeAlertHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ALLOWED_ALERT_TAGS,
    ALLOWED_ATTR: ALLOWED_ALERT_ATTRIBUTES,
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'object', 'embed', 'base', 'link', 'meta', 'style'],
    FORBID_ATTR: [
      'onerror',
      'onload',
      'onclick',
      'onmouseover',
      'onfocus',
      'onblur',
      'onchange',
      'onsubmit',
    ],
  });
}

/**
 * 基本的なMarkdownコンテンツをサニタイズする
 * アラート以外の一般的なMarkdown要素のみ許可
 * @param html - サニタイズ対象のHTML
 * @returns サニタイズされたHTML
 */
export function sanitizeBasicHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ALLOWED_BASIC_TAGS,
    ALLOWED_ATTR: ALLOWED_BASIC_ATTRIBUTES,
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: [
      'script',
      'object',
      'embed',
      'base',
      'link',
      'meta',
      'style',
      'iframe',
      'frame',
    ],
    FORBID_ATTR: [
      'onerror',
      'onload',
      'onclick',
      'onmouseover',
      'onfocus',
      'onblur',
      'onchange',
      'onsubmit',
      'javascript:',
    ],
  });
}

/**
 * アラートコンテンツ内のMarkdownをサニタイズする
 * アラート内部で使用される要素のみ許可
 * @param html - サニタイズ対象のHTML
 * @returns サニタイズされたHTML
 */
export function sanitizeAlertContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'code', 'pre', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: [
      'script',
      'object',
      'embed',
      'base',
      'link',
      'meta',
      'style',
      'iframe',
      'frame',
      'img',
    ],
    FORBID_ATTR: [
      'onerror',
      'onload',
      'onclick',
      'onmouseover',
      'onfocus',
      'onblur',
      'onchange',
      'onsubmit',
      'javascript:',
      'src',
    ],
  });
}
