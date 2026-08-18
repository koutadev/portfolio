import { test, expect } from '@playwright/test'

test('トップページが表示され主要セクションが存在する', async ({ page }) => {
  await page.goto('/')

  // ページタイトル
  await expect(page).toHaveTitle(/KOUTA/)

  // Hero: メインキャッチコピー
  await expect(
    page.getByRole('heading', { name: 'コードで、ビジネスを握る。' })
  ).toBeVisible()

  // Works: セクション見出しと最初のプロジェクト
  await expect(
    page.getByRole('heading', { name: 'プロジェクト' })
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Store Dashboard' })
  ).toBeVisible()

  // Contact: セクション見出し
  await expect(
    page.getByRole('heading', { name: 'お問い合わせ' })
  ).toBeVisible()

  // ランドマーク（main / nav / footer）
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'メインナビゲーション' })).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
})

test.describe('SQL最適化 Before/After デモ', () => {
  // reduced-motion で結果を即時表示し、決定的にテストする
  test.use({ reducedMotion: 'reduce' })

  test('Before/Afterを実行すると高速化倍率と実行計画が表示される', async ({ page }) => {
    await page.goto('/')

    const demo = page.locator('#sql-demo')
    await expect(demo).toBeVisible()

    // 実行計画（Seq Scan → Index Only Scan）は常時表示される
    await expect(demo.getByText('Seq Scan', { exact: false }).first()).toBeVisible()
    await expect(
      demo.getByText('Index Only Scan', { exact: false }).first()
    ).toBeVisible()

    // Before / After を実行（実行後はラベルが「再実行」に変わるため role で位置指定）
    const runButtons = demo.getByRole('button')
    await expect(runButtons).toHaveCount(2)
    await runButtons.nth(0).click()
    await runButtons.nth(1).click()

    // 高速化倍率のバナーが表示される
    await expect(demo.getByText('高速化（実測比）')).toBeVisible()
  })
})
