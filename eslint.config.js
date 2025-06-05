import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  ...eslintPluginAstro.configs.recommended,

  // 追加設定例
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,astro}'],
    rules: {
      // カスタムルール
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'astro/no-set-html-directive': 'error',
    },
  },

  // Astroファイル専用設定
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        Astro: 'readonly',
      },
    },
  },

  // 設定ファイルの除外
  {
    ignores: ['dist/', 'node_modules/', '.astro/'],
  },
];
