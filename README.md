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

## 🔬 SQL最適化 Before/After デモ

Works の実務ケーススタディ「SQLクエリ最適化」に、インデックス有無で実行計画がどう変わるかを
**実測値で再生するインタラクティブデモ**（`src/components/SqlOptimizationDemo.tsx`）を配置しています。

- 表示する数値・実行計画は `sql-optimization-case-study/`（PostgreSQL / ダミーデータ 100万行）で
  ローカル計測した実測値（`src/data/sqlDemo.ts` にハードコード）。**捏造なし・守秘配慮（実データ不使用）**。
- 計測条件（1リクエスト＝並列なし・ウォームキャッシュ）で **Seq Scan 95ms → Index Only Scan 12ms（≈7.8×）**。
- 手元での再現手順・実行計画は [`sql-optimization-case-study/`](./sql-optimization-case-study/) を参照
  （`docker compose up -d` もしくは `./run.sh`）。この配下はサイトのビルド対象外（`.vercelignore`）。

## 👤 作者

**Kouta** - 元寿司職人 → PHP バックエンドエンジニア

- GitHub: [@koutadev](https://github.com/koutadev)
- Store Dashboard: [GitHub](https://github.com/koutadev/store-dashboard)