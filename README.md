# Lab Public Homepage

this repository is for the web page of takahashi-karikawa laboratory.

## Install

1. install nodejs
   - require: node ^22.14.1
2. install pnpm
   - run `npm install -g pnpm`

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                 | Action                                           |
| :---------------------- | :----------------------------------------------- |
| `pnpm install`          | Installs dependencies                            |
| `pnpm run dev`          | Starts local dev server at `localhost:3000`      |
| `pnpm run build`        | Build your production site to `./dist/`          |
| `pnpm run preview`      | Preview your build locally, before deploying     |
| `pnpm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro --help` | Get help using the Astro CLI                     |






以下が修正されたREADMEです：

```markdown
# 高橋・狩川研究室 公式ホームページ

このリポジトリは高橋・狩川研究室の公式ホームページのソースコードです。

## 🚀 はじめに

このプロジェクトは[Astro](https://astro.build/)を使用して構築されています。開発を始める前に、以下の手順に従って環境をセットアップしてください。

## 📋 必要な環境

- **Node.js**: バージョン 22.14.1 以上
- **pnpm**: パッケージマネージャー

## 🛠️ セットアップ手順

### 1. Node.jsのインストール

Node.jsがインストールされていない場合は、[公式サイト](https://nodejs.org/)からダウンロードしてインストールしてください。

バージョンの確認：
```bash
node --version
```

### 2. pnpmのインストール

以下のコマンドでpnpmをグローバルにインストールします：

```bash
npm install -g pnpm
```

### 3. 依存関係のインストール

プロジェクトのルートディレクトリで以下のコマンドを実行します：

```bash
pnpm install
```

## 🧞 利用可能なコマンド

プロジェクトのルートディレクトリから、ターミナルで以下のコマンドを実行できます：

| コマンド                | 説明                                             |
| :---------------------- | :----------------------------------------------- |
| `pnpm install`          | 依存関係をインストールします                            |
| `pnpm run dev`          | 開発サーバーを起動します（`localhost:3000`でアクセス可能）      |
| `pnpm run build`        | 本番用サイトを`./dist/`フォルダにビルドします          |
| `pnpm run preview`      | ビルドしたサイトをローカルでプレビューします     |
| `pnpm run astro ...`    | `astro add`、`astro check`などのCLIコマンドを実行します |
| `pnpm run astro --help` | Astro CLIのヘルプを表示します                     |
| `pnpm lint`             | コードの品質チェック                              |
| `pnpm lint:fix`         | 自動修正可能な問題を修正                           |

## 🔧 開発の流れ

1. **開発サーバーの起動**
   ```bash
   pnpm run dev
   ```
   ブラウザで `http://localhost:3000` にアクセスして開発を開始できます。

2. **コードの編集**
   - ファイルを編集すると、ブラウザが自動的にリロードされます
   - 主要なファイルは `src/` ディレクトリ内にあります

3. **ビルドとプレビュー**
   ```bash
   # 本番用ビルド
   pnpm run build

   # ビルド結果のプレビュー
   pnpm run preview
   ```

## ✅ コード品質の確保

### GitHubにpushする前の必須チェック

**必ず以下のコマンドを実行してからpushしてください：**

```bash
# コードの品質チェック
pnpm lint

# 自動修正可能な問題を修正
pnpm lint:fix
```

### なぜlintが重要なのか

- **コード品質の統一**: チーム全体で一貫したコーディングスタイルを維持
- **バグの早期発見**: 潜在的なエラーや問題のあるコードパターンを事前に検出
- **可読性の向上**: 統一されたフォーマットにより、コードが読みやすくなる
- **メンテナンス性**: 将来的なコードの修正や機能追加が容易になる
- **CI/CDの安定性**: 自動デプロイ時のエラーを防止

### 推奨ワークフロー

```bash
# 1. 開発作業
pnpm run dev

# 2. コードの編集・実装

# 3. lintチェックと修正
pnpm lint:fix

# 4. 最終確認
pnpm lint

# 5. ビルドテスト
pnpm run build

# 6. Git操作 (Git Kraken からの操作で良い)
git add .
git commit -m "your commit message"
git push
```

## 🆘 トラブルシューティング

### よくある問題

- **Node.jsのバージョンが古い場合**
  - Node.js 22.14.1以上にアップデートしてください

- **依存関係のインストールでエラーが発生する場合**
  ```bash
  # node_modulesとロックファイルを削除して再インストール
  rm -rf node_modules pnpm-lock.yaml
  pnpm install
  ```

- **開発サーバーが起動しない場合**
  - ポート3000が他のプロセスで使用されていないか確認してください
  - 別のポートを使用する場合：`pnpm run dev --port 3001`

- **lintエラーが解決できない場合**
  ```bash
  # 自動修正を試す
  pnpm lint:fix

  # それでも解決しない場合は、エラーメッセージを確認して手動で修正
  pnpm lint
  ```

## 📚 参考資料

- [Astro公式ドキュメント](https://docs.astro.build/)
- [pnpm公式ドキュメント](https://pnpm.io/)
- [ESLint公式ドキュメント](https://eslint.org/)

