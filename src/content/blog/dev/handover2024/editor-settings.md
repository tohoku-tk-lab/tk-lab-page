---
title: 'おすすめエディタ設定'
date: '2024-12-31'
tag: ['dev', '引き継ぎ']
lead: '開発を効率化するためのVSCode拡張機能を紹介'
---

> [!CUSTOM] green report 作成中
> この記事は作成中です。引き継ぎ時に役立つエディタ設定の紹介を予定しています。

モダンなフロントエンド開発環境において、[Astro](https://astro.build/)はパフォーマンスとDXを両立させる優れたフレームワークとして人気を集めています。本研究室では、高速かつ効率的なパッケージマネージャーである[pnpm](https://pnpm.io/)との組み合わせて、ホームページの開発を行なっています。

この記事では、AstroとpnpmによるWeb開発をさらに効率化するためのVSCode拡張機能を紹介します。特にTypeScriptのサポートに焦点を当て、GitHub連携も考慮した拡張機能をセレクトしました。

# 1. Astro Language Support

**[Astro Language Support](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)**

Astroを使用する際にまず導入すべき公式拡張機能です。`.astro`ファイルのシンタックスハイライト、IntelliSense、自動補完といった基本的な機能を提供します。

```typescript
// .astroファイルでのTypeScript型チェックが可能
interface Props {
  title: string;
  content?: string; 
}

const { title, content = "デフォルト内容" } = Astro.props;
```

この拡張機能はTypeScriptと完全に統合されており、`.astro`ファイル内でのTypeScript機能を最大限に活用できます。コンポーネントのProps定義から型チェックまで、Astroの開発が大幅に簡易化されます。

# 2. Tailwind CSS IntelliSense

**[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)**

AstroはTailwind CSSとの相性が非常に良く、本ホームページも基本的にはデザインにTailwind CSSを利用しています。この拡張機能は、クラス名の自動補完や入力候補の表示など、開発効率を大幅に向上させます。

```html
<!-- クラス名の自動補完と候補表示 -->
<div class="flex items-center justify-between p-4 bg-blue-500 text-white">
  <h1 class="text-xl font-bold">Hello Astro with Tailwind</h1>
</div>
```

TypeScriptでのコンポーネント開発時も、HTMLテンプレート内でTailwindクラスの補完が効くため、デザインとコード両面での開発効率が向上します。

# 3. ESLint

**[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**

コード品質を保つために不可欠なESLint。AstroプロジェクトでのTypeScriptコードリンティングをサポートします。

```typescript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
};
```

TypeScript、Astro、そしてJSXコンポーネントすべてに対して統一的なコード規約を適用でき、チーム開発での品質維持に役立ちます。

# 4. Prettier - Code formatter

**[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**

コード整形ツールとして定番のPrettier。Astroファイルを含む様々なファイル形式に対応しており、一貫したコードスタイルを維持できます。

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

TypeScriptコードの整形もサポートしており、開発者間でのコードスタイルの統一が容易になります。`prettier-plugin-astro`と組み合わせることで、Astroファイルも美しくフォーマットできます。

# 5. GitHub Copilot

**[GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)**

AIによるコード補完は現代の開発者には必須ツールとなりつつあります。AstroやTypeScriptのコードも理解し、コンテキストに沿った提案を行います。

> [!CUSTOM] amber copilot Lucky!
> 2024年現在では、大学アカウントであれば、登録するだけで無料で利用できます！
> import pathの入力も自動補完により、容易になりますが、まれに間違える場合があるので、参照エラーなどの際には確認が必要です。


```typescript
// GitHub Copilotが続きを提案してくれる
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  // ここからCopilotが自動提案
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

特にTypeScriptの型定義や、Astroコンポーネントの作成において、ボイラープレートコードを素早く生成できます。

# 6. Git Graph

**[Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)**

GitHubでソースコード管理をしている場合、Git Graphは非常に便利です。リポジトリの履歴をグラフィカルに表示し、複雑なブランチ構造も視覚的に把握できます。

チーム開発でのブランチの状態確認や、コミット履歴の追跡に役立ちます。コマンドラインでのGit操作が苦手な方にも特におすすめです。

> [!CUSTOM] teal git_branch Important!
> Git Krakenを利用している場合には、そちらの方が便利な場合が多いので、いらないかも。
> VSCode内で全てを完結させたければ、入れてもいいかも！

# 7. pnpm VSCode Integration

**[pnpm VSCode Integration](https://marketplace.visualstudio.com/items?itemName=kieloza.pnpm-vscode-integration)**

pnpmユーザー向けの専用拡張機能です。VSCode内からpnpmコマンドを簡単に実行でき、依存関係の管理が容易になります。

```json
// package.json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^3.2.0",
    "typescript": "^5.1.6"
  }
}
```

この拡張機能を使うと、package.jsonに定義されたスクリプトをGUIで簡単に実行できます。Astroプロジェクトの`dev`や`build`などのコマンドをエディタから直接実行可能です。

# まとめ

Astroとpnpmを使ったWeb開発は、適切な拡張機能によってさらに効率化できます。特にTypeScriptサポートに関連する拡張機能は、型安全性と開発効率を両立させるために重要です。

今回紹介した拡張機能を導入することで、以下のメリットが得られます：

1. コード補完による開発速度の向上
2. 型チェックによるバグの早期発見
3. コード品質の維持
4. チーム開発の効率化
5. GitHubとの円滑な連携

最新のAstroバージョンでは、TypeScriptのサポートがさらに強化されているため、これらの拡張機能との相性も抜群です。お気に入りの拡張機能を見つけて、開発環境をカスタマイズしてみてください。

# 参考リンク

- [Astro公式ドキュメント](https://docs.astro.build/)
- [pnpm公式サイト](https://pnpm.io/)
- [TypeScript公式サイト](https://www.typescriptlang.org/)
- [VSCode Marketplace](https://marketplace.visualstudio.com/)
