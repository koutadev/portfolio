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
