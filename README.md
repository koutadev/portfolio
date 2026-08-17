# 🎨 Portfolio - Kouta

元寿司職人 → PHPバックエンドエンジニアのポートフォリオサイト。

## 🔗 URL

https://portfolio-chi-sage-eud0tx0pxw.vercel.app

## ⚡ 技術スタック

| カテゴリ | 技術 |
|---------|------|
| Frontend | React 19 / TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Test / CI | Playwright / GitHub Actions |
| Deploy | Vercel |
| Font | Noto Serif JP / Zen Kaku Gothic New / JetBrains Mono |

## 🎯 デザインコンセプト

**「和モダン」** — 寿司職人の経験とテクノロジーの融合

- ダークテーマ（漆黒）+ 金色アクセント
- 日本語セリフ体の見出し + モノスペースのラベル
- スクロール連動のフェードインアニメーション
- グレインテクスチャによるフィルム感

## 📐 セクション構成

- **Hero** — キャッチコピー「元寿司職人。コードで、ビジネスを握る。」
- **About** — キャリアストーリー（寿司職人 → エンジニア）
- **Achievements** — 数字で語る実績（SQL 60倍高速化 等）
- **Skills** — 技術スタック（Backend / Frontend / DevOps / AI Tools）
- **Works** — Store Dashboard / StudyFlow（課題→アプローチ→結果のケーススタディ）+ 実務での成果
- **Career** — タイムライン形式の経歴
- **Contact** — お問い合わせ

## 🚀 セットアップ
```bash
git clone https://github.com/koutadev/portfolio.git
cd portfolio
npm install
npm run dev
```

http://localhost:5173 でアクセス

## ✅ テスト / CI

```bash
npm run lint        # ESLint
npm run typecheck   # tsc -b（型チェック）
npm run build       # 型チェック + 本番ビルド
npm run test:e2e    # Playwright スモークテスト
```

`.github/workflows/ci.yml` により、push / PR 時に install → lint → typecheck → build → Playwright を自動実行します。

## 👤 作者

**Kouta** - 元寿司職人 → PHP バックエンドエンジニア

- GitHub: [@koutadev](https://github.com/koutadev)
- Store Dashboard: [GitHub](https://github.com/koutadev/store-dashboard)