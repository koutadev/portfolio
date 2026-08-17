# Portfolio Site - 仕様書

## プロジェクト概要

元寿司職人 → PHPバックエンドエンジニアのポートフォリオサイト。
エンジニアとしての技術・実績を提示することを目的とする。

## 技術スタック

- **フレームワーク**: Vite + React + TypeScript
- **スタイリング**: Tailwind CSS
- **デプロイ先**: Vercel
- **フォント**: Google Fonts（Noto Serif JP, Zen Kaku Gothic New, JetBrains Mono）

## デザインコンセプト: 「和モダン」

- **テーマ**: ダーク（背景 #0a0a0b）
- **アクセントカラー**: 金色（#c4841d）— 寿司・和食の世界観とテック感の融合
- **見出しフォント**: Noto Serif JP（日本語セリフ体）
- **本文フォント**: Zen Kaku Gothic New
- **コード/ラベル**: JetBrains Mono
- **テクスチャ**: グレインオーバーレイでフィルム感を演出
- **アニメーション**: スクロール連動のフェードイン、ステージドリビール

## セクション構成

### 1. Navigation（固定ヘッダー）
- ロゴ: "KOUTA"（Noto Serif JP, 金色）
- ナビリンク: About / Skills / Works / Career / Contact
- スクロール時に背景をブラーに変化

### 2. Hero（ファーストビュー）
- サブテキスト: "PHP / Laravel Backend Engineer"（JetBrains Mono, 金色）
- メインキャッチ: "元寿司職人。コードで、ビジネスを握る。"（Noto Serif JP, 56px）
- 説明文: 3年間の寿司修行で培った「素材を見極める目」と「妥協なき品質」を武器に、業務システムの設計・開発・最適化に取り組むバックエンドエンジニアです。
- CTAボタン: Works / Contact
- スクロールインジケーター（フローティングアニメーション）

### 3. About
- セクション番号: "01 — ABOUT"
- タイトル: "包丁からキーボードへ"
- 2カラムレイアウト:
  - 左: 寿司職人時代の経験とエンジニアリングへの接続
  - 右: 現在の業務内容とAI活用の開発スタイル
- テキスト:
  - 寿司職人として3年間、毎朝4時に起きて市場に通い、魚の鮮度を一目で見極める力を磨きました。カウンター越しにお客様と向き合い、一貫一貫に心を込める日々。
  - その経験は、今のエンジニアリングに直結しています。「素材（データ）の質を見極め、最適な手順（アルゴリズム）で、期待を超える品質（パフォーマンス）を届ける」—— 根本は同じです。
  - 2年間の独学を経て、SIer企業で自動車ディーラー向けの業務システムを開発してきました。SQLクエリの60倍高速化、Excelエクスポートのリファクタリングなど、実務で数字に残る成果を出してきました。
  - Claude CodeやChatGPTを開発補助として活用し、一人でも高い生産性を保つスタイルで開発しています。

### 4. Achievements（数字で語る実績）
- 4カラムグリッド:
  - 60× / SQLクエリ高速化 / 6秒 → 0.1秒
  - 14,000+ / テストデータ件数 / 実運用を想定した設計
  - 58 / テストケース / 全件PASS
  - 3年 / 寿司職人の経験 / 品質への執念

### 5. Skills
- セクション番号: "02 — SKILLS"
- タイトル: "技術スタック"
- 2カラムグリッド、4カテゴリ:
  - Backend: PHP, Laravel, PostgreSQL, SQL最適化
  - Frontend: JavaScript, HTML/CSS, Tailwind CSS, Chart.js
  - DevOps: Docker, Git, GitHub Actions, Linux
  - AI Tools: Claude Code, ChatGPT, AI活用（開発補助）
- 各スキルはタグ形式（金色ボーダー、ホバーで浮き上がり）

### 6. Works
- セクション番号: "03 — WORKS"
- タイトル: "プロジェクト"
- 各プロジェクトは「課題 → アプローチ／設計判断 → 結果」のケーススタディ形式で提示する。

#### 実務（主役・先頭に配置）: 自動車ディーラー業務システム
- SQLクエリ最適化（Performance）: 全件取得により約6秒かかっていた売上集計帳票を、EXPLAIN ANALYZEでのボトルネック特定・インデックス設計・クエリ見直し、およびPhpSpreadsheetのバルク処理化で 6秒→0.1秒（約60倍）に短縮。
- ダッシュボード開発（Data Viz）: 店舗ごとに分散していた売上・実績を、複数テーブルの集計クエリとChart.jsで1画面に可視化。

#### 個人開発: Store Dashboard
- GitHub: https://github.com/koutadev/store-dashboard
- 説明: 複数店舗の売上データを一元管理するダッシュボードアプリケーション。KPIカード、Chart.jsによる3種のグラフ、売上CRUD、Excel/CSVエクスポート、店舗管理、ユーザー権限制御まで実装。58件のFeature Testで品質を担保。
- 技術タグ: PHP 8.3, Laravel 11, PostgreSQL 16, Chart.js, Tailwind CSS, Docker, GitHub Actions

#### 個人開発: StudyFlow
- Live Demo: https://studyflow-indol.vercel.app / GitHub: https://github.com/koutadev/studyflow
- 説明: Claude APIを学習プラン自動生成の中核機能として組み込んだ学習管理SaaS。目標管理・学習記録・ポモドーロ・統計分析・Stripe決済（フリーミアム）を実装。
- 技術タグ: Next.js 14, TypeScript, Supabase, PostgreSQL, Claude API, Stripe, Tailwind CSS, Vercel

### 7. Career Timeline
- セクション番号: "04 — CAREER"
- タイトル: "経歴"
- 縦型タイムライン（左線 + ドット）:
  - 2020-2023 / 🍣 寿司職人 / 都内の寿司店で3年間修行。素材の見極め、段取り、品質への妥協なき姿勢を叩き込まれる。
  - 2023-2025 / 📚 独学期間 / 2年間、PHP・SQL・Linuxを中心に独学。Udemyと技術書で基礎を固め、個人開発で実践力を磨く。
  - 2025-2026 / 💻 SIer エンジニア / 自動車ディーラー向け業務システムを開発。SQLクエリ60倍高速化、Excel出力機能など実務で成果を出す。
  - Next / 🚀 これから / 技術を土台に、上流工程（要件定義・設計）や顧客の課題解決へ領域を広げ、長期的に価値を出せるエンジニアを目指す。Java Silver・応用情報技術者試験を学習中。

### 8. Contact
- セクション番号: "05 — CONTACT"
- タイトル: "お問い合わせ"
- 説明: お仕事のご相談・ご質問など、お気軽にご連絡ください。
- ボタン: Mail / GitHub（https://github.com/koutadev）

### 9. Footer
- ロゴ: "KOUTA"
- コピーライト: © 2026 Kouta. Built with passion — from sushi to code.

## デザイン詳細

### カラーパレット
```
背景:        #0a0a0b
テキスト主:    #e8e6e3
テキスト副:    #aaaaaa
テキスト薄:    #888888
テキスト最薄:  #666666
アクセント:    #c4841d
アクセント明:  #e09b2d
ボーダー:     rgba(255, 255, 255, 0.06)
ボーダー強調:  rgba(196, 132, 29, 0.2)
```

### アニメーション
- **フェードアップ**: opacity: 0 → 1, translateY: 40px → 0, cubic-bezier(0.16, 1, 0.3, 1)
- **ステージドリビール**: 0.1s刻みのdelay
- **ヒーローライン**: 行ごとの順次表示（0.15s刻み）
- **フローティング**: スクロールインジケーターの上下アニメーション（3s周期）
- **Intersection Observer**: threshold 0.15 でセクション表示検知

### レスポンシブ
- モバイル（768px以下）:
  - ヒーロータイトル: 32px
  - セクションタイトル: 28px
  - 2カラム → 1カラム
  - 4カラム → 2カラム
  - ナビリンク非表示（ハンバーガーメニュー）

### インタラクション
- スキルタグ: ホバーで背景濃く + 2px上昇
- プロジェクトカード: ホバーでボーダー金色 + 4px上昇 + シャドウ
- CTAボタン: ホバーで背景金色 + テキスト黒
- ナビ: スクロール50px超でブラー背景

## ファイル構成

```
portfolio/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── components/
        ├── Navigation.tsx
        ├── Hero.tsx
        ├── About.tsx
        ├── Achievements.tsx
        ├── Skills.tsx
        ├── Works.tsx
        ├── Career.tsx
        ├── Contact.tsx
        └── Footer.tsx
```

## セットアップ手順

```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm install
npm install -D tailwindcss @tailwindcss/vite
```

## デプロイ

Vercelにデプロイ:
```bash
npm install -g vercel
vercel
```

## 注意事項

- OGP画像を設定すること（SNSシェア用）
- ファビコンを設定すること
- Google Lighthouseで90点以上を目指すこと
- メールアドレスは実際のものに置き換えること
- Live Demoリンクはデプロイ後に更新すること
