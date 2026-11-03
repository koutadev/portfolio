# lp-motion（同梱版）

動きのライブラリ [koutadev/lp-motion](https://github.com/koutadev/lp-motion)（非公開）の `dist/` を、そのままコピーしたものです。
Vercel と GitHub Actions が非公開リポジトリを取得できないため、npm の git 依存ではなく同梱しています。

- バージョン: **v1.2.0**（コミット `2fa9eb0`）
- 中身: `lp-motion.mjs`（モジュール版）／`lp-motion.d.mts`（型定義。元は `lp-motion.d.ts`）／`lp-motion.css`
- このフォルダのファイルは編集しない。配色などの調整は `src/index.css` で上書きする

## 更新の手順

1. lp-motion 側で新しいタグを付ける（例: `v1.2.1`）
2. そのタグの `dist/lp-motion.mjs`・`dist/lp-motion.d.ts`・`dist/lp-motion.css` をこのフォルダへコピーし、`lp-motion.d.ts` は `lp-motion.d.mts` に名前を変える
3. この README のバージョンとコミットを書き換え、`npm run build && npm run test:e2e` で確認する
