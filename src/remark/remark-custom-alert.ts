import type { Paragraph, Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { DEFAULT_GITHUB_ICONS } from './icons.ts';

export type RemarkGitHubAlertsOptions = {
  /**
   * List of markers to match.
   * @default ['TIP', 'NOTE', 'IMPORTANT', 'WARNING', 'CAUTION']
   */
  markers?: string[] | '*';

  /**
   * If markers case sensitively on matching.
   * @default false
   */
  matchCaseSensitive?: boolean;

  /**
   * Custom icons for each marker. The key is the marker name, and the value is the html script represent the icon.
   * The key is always lowercase.
   *
   * @default inline svg icons from GitHub
   */
  icons?: Record<string, string>;

  /**
   * Custom titles for each marker. The key is the marker name, and the value is the title.
   * The key is always lowercase.
   *
   * When the title is not specified, the default title is the capitalized marker name.
   */
  titles?: Record<string, string>;

  /**
   * Prefix for the class names.
   *
   * @default 'markdown-alert'
   */
  classPrefix?: string;

  // ^ options from MarkdownItGitHubAlertsOptions

  /**
   * Whether to ignore the square brackets in the marker.
   *
   * @default false
   */
  ignoreSquareBracket?: boolean;
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
export function encodeSvg(svg: string) {
  return svg
    .replace(
      '<svg',
      ~svg.indexOf('xmlns')
        ? '<svg'
        : '<svg xmlns="http://www.w3.org/2000/svg"',
    )
    .replaceAll('"', "'")
    .replaceAll('%', '%25')
    .replaceAll('#', '%23')
    .replaceAll('{', '%7B')
    .replaceAll('}', '%7D')
    .replaceAll('<', '%3C')
    .replaceAll('>', '%3E');
}

const remarkCustomAlerts: Plugin<RemarkGitHubAlertsOptions[], Root> = (
  options = {},
) => {
  const {
    markers = ['MEMO', 'HINT', 'ひとことメモ', 'CUSTOM'],
    icons = DEFAULT_GITHUB_ICONS,
    matchCaseSensitive = false,
    titles = {},
    classPrefix = 'markdown-alert-custom',
    ignoreSquareBracket = false,
  } = options;

  const markerNameRE = markers === '*' ? '\\w+' : markers.join('|');
  const RE = new RegExp(
    ignoreSquareBracket
      ? `^!(${markerNameRE})\\s?`
      : `^\\[\\!(${markerNameRE})\\]\\s`,
    matchCaseSensitive ? '' : 'i',
  );

  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      const children = node.children as Paragraph[];
      const firstParagraph = children[0];
      if (!firstParagraph) return;
      let firstContent = firstParagraph.children[0];
      if (!firstContent) return;
      if (
        !('value' in firstContent) &&
        'children' in firstContent &&
        firstContent.children[0]
      )
        firstContent = firstContent.children[0];
      // console.log('firstContent', firstContent)

      if (firstContent.type !== 'text') return;
      const match = firstContent.value.match(RE);
      // console.log('match', match)
      if (!match) return;

      const type = match[1]?.toLowerCase() as keyof typeof icons;
      let title =
        match[2]?.trim() || (titles[type as string] ?? capitalize(type));
      let icon = icons[type];
      // console.log('icon', icon)

      if (index === undefined || !parent) return;

      let color = 'yellow';
      let icon_name = '' as keyof typeof icons;

      if (type === 'custom') {
        const parameters = firstContent.value.split('\n');
        color = parameters[0].split(' ')[1];
        icon_name = parameters[0].split(' ')[2] as keyof typeof icons;
        icon = icons[icon_name];
        title = parameters[0].split(' ').slice(3).join(' ') || ' ';

        // 改行後のテキストを保持し、<br> タグを挿入
        const textLines = parameters.slice(1);
        // @ts-expect-error: Type mismatch between mdast and hast nodes during dynamic content creation
        firstParagraph.children = textLines.flatMap((line, index) =>
          index === 0
            ? [{ type: 'text', value: line.trim() }]
            : [
                { type: 'element', tagName: 'br', children: [] },
                { type: 'text', value: line.trim() },
              ],
        );
      } else {
        const textLines = firstContent.value
          .slice(match[0].length)
          .split('\n')
          .map((line) => line.trim());
        // @ts-expect-error: Type mismatch between mdast and hast nodes during dynamic content creation
        firstParagraph.children = textLines.flatMap((line, index) =>
          index === 0
            ? [{ type: 'text', value: line }]
            : [
                { type: 'element', tagName: 'br', children: [] },
                { type: 'text', value: line },
              ],
        );
      }

      const iconDataUri = `data:image/svg+xml;utf8,${encodeSvg(icon)}`;

      node.data = {
        hName: 'div',
        hProperties: {
          class:
            type === 'custom'
              ? `${classPrefix} ${classPrefix}-${type} bg-${color}-100 border-${color}-500`
              : `${classPrefix} ${classPrefix}-${type}`,
          // style: `color: ${color}`,
        },
      };
      node.children = [
        {
          type: 'paragraph',
          data: {
            hName: 'p',
            hProperties: {
              class:
                type === 'custom'
                  ? `${classPrefix}-title text-${color}-500`
                  : `${classPrefix}-title`,
            },
          },
          children: [
            {
              // @ts-expect-error can not use span
              type: 'span',
              data: {
                hName: 'span',
                hProperties: {
                  class:
                    type === 'custom'
                      ? `octicon octicon-${String(icon_name)}`
                      : `octicon octicon-${String(type)}`,
                  style: `--oct-icon: url("${iconDataUri}")`,
                },
              },
            },
            {
              type: 'text',
              value: title,
            },
          ],
        },
        ...node.children,
      ];
    });
    return tree;
  };
};

export default remarkCustomAlerts;
