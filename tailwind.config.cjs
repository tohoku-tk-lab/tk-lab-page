/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  mode: 'jit',
  theme: {
    extend: {
      // TK Lab 研究室のカラーパレット定義
      colors: {
        // プライマリーカラー - インディゴベース（知的・学術的）
        tklab: {
          primary: {
            50: '#eef2ff', // 非常に薄いインディゴ
            100: '#e0e7ff', // 薄いインディゴ
            200: '#c7d2fe', // ライトインディゴ
            300: '#a5b4fc', // ミディアムライトインディゴ
            400: '#818cf8', // ミディアムインディゴ
            500: '#6366f1', // 標準インディゴ（メインカラー）
            600: '#4f46e5', // ダークインディゴ
            700: '#4338ca', // より濃いインディゴ
            800: '#3730a3', // ダークインディゴ
            900: '#312e81', // 最も濃いインディゴ
            950: '#1e1b4b' // 極濃インディゴ
          },

          // セカンダリーカラー - スレートグレー（洗練・モダン）
          secondary: {
            50: '#f8fafc', // 極薄グレー
            100: '#f1f5f9', // 薄グレー
            200: '#e2e8f0', // ライトグレー
            300: '#cbd5e1', // ミディアムライトグレー
            400: '#94a3b8', // ミディアムグレー
            500: '#64748b', // 標準グレー
            600: '#475569', // ダークグレー
            700: '#334155', // より濃いグレー
            800: '#1e293b', // ダークグレー
            900: '#0f172a' // 最も濃いグレー
          },

          // アクセントカラー - スカイブルー（革新・技術）
          accent: {
            50: '#f0f9ff', // 極薄スカイブルー
            100: '#e0f2fe', // 薄スカイブルー
            200: '#bfdbfe', // ライトスカイブルー
            300: '#7dd3fc', // ミディアムライトスカイブルー
            400: '#38bdf8', // ミディアムスカイブルー
            500: '#0ea5e9', // 標準スカイブルー
            600: '#0284c7', // ダークスカイブルー
            700: '#0369a1', // より濃いスカイブルー
            800: '#075985', // ダークスカイブルー
            900: '#0c4a6e' // 最も濃いスカイブルー
          },

          // 成功色 - エメラルド（達成・成長）
          success: {
            50: '#ecfdf5', // 極薄エメラルド
            100: '#d1fae5', // 薄エメラルド
            200: '#a7f3d0', // ライトエメラルド
            300: '#6ee7b7', // ミディアムライトエメラルド
            400: '#34d399', // ミディアムエメラルド
            500: '#10b981', // 標準エメラルド
            600: '#059669', // ダークエメラルド
            700: '#047857', // より濃いエメラルド
            800: '#065f46', // ダークエメラルド
            900: '#064e3b' // 最も濃いエメラルド
          },

          // 警告色 - アンバー（注意・重要）
          warning: {
            50: '#fffbeb', // 極薄アンバー
            100: '#fef3c7', // 薄アンバー
            200: '#fde68a', // ライトアンバー
            300: '#fcd34d', // ミディアムライトアンバー
            400: '#fbbf24', // ミディアムアンバー
            500: '#f59e0b', // 標準アンバー
            600: '#d97706', // ダークアンバー
            700: '#b45309', // より濃いアンバー
            800: '#92400e', // ダークアンバー
            900: '#78350f' // 最も濃いアンバー
          },

          // エラー色 - レッド（エラー・重要）
          error: {
            50: '#fef2f2', // 極薄レッド
            100: '#fee2e2', // 薄レッド
            200: '#fecaca', // ライトレッド
            300: '#fca5a5', // ミディアムライトレッド
            400: '#f87171', // ミディアムレッド
            500: '#ef4444', // 標準レッド
            600: '#dc2626', // ダークレッド
            700: '#b91c1c', // より濃いレッド
            800: '#991b1b', // ダークレッド
            900: '#7f1d1d' // 最も濃いレッド
          }
        }
      },

      // カスタムフォントファミリー
      fontFamily: {
        sans: [
          'Inter',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Meiryo',
          'sans-serif'
        ],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: [
          'SFMono-Regular',
          'Consolas',
          'Liberation Mono',
          'Menlo',
          'monospace'
        ]
      },

      // カスタムスペーシング
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem'
      },

      // カスタムブレークポイント
      screens: {
        xs: '475px',
        '3xl': '1920px'
      },

      // カスタムボックスシャドウ
      boxShadow: {
        'tklab-sm': '0 1px 2px 0 rgba(99, 102, 241, 0.05)',
        'tklab-md':
          '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
        'tklab-lg':
          '0 10px 15px -3px rgba(99, 102, 241, 0.1), 0 4px 6px -2px rgba(99, 102, 241, 0.05)',
        'tklab-xl':
          '0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04)'
      },

      // カスタムグラデーション
      backgroundImage: {
        'tklab-gradient':
          'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        'tklab-hero':
          'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.8) 100%)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      {
        tklab: {
          primary: '#6366f1', // tklab-primary-500
          'primary-focus': '#4f46e5', // tklab-primary-600
          'primary-content': '#ffffff',

          secondary: '#64748b', // tklab-secondary-500
          'secondary-focus': '#475569', // tklab-secondary-600
          'secondary-content': '#ffffff',

          accent: '#0ea5e9', // tklab-accent-500
          'accent-focus': '#0284c7', // tklab-accent-600
          'accent-content': '#ffffff',

          neutral: '#334155', // tklab-secondary-700
          'neutral-focus': '#1e293b', // tklab-secondary-800
          'neutral-content': '#ffffff',

          'base-100': '#ffffff',
          'base-200': '#f8fafc', // tklab-secondary-50
          'base-300': '#e2e8f0', // tklab-secondary-200
          'base-content': '#0f172a', // tklab-secondary-900

          info: '#0ea5e9', // tklab-accent-500
          success: '#10b981', // tklab-success-500
          warning: '#f59e0b', // tklab-warning-500
          error: '#ef4444' // tklab-error-500
        }
      },
      'winter' // フォールバック用に既存テーマも保持
    ],
    darkTheme: false // ダークテーマを無効化（必要に応じて後で追加）
  }
};
