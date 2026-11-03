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

  // Works: 業務システム（共通基盤と、その上の CRM・ヨガ予約）
  await expect(
    page.getByRole('heading', { name: '営業・売上管理CRM（BtoB法人営業向け）' })
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'オンラインヨガ予約システム（モバイルファースト）' })
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: '業務システム共通基盤テンプレート' })
  ).toBeVisible()

  // 各ケーススタディのリンク（詳細モーダル内＝閉じた状態なので includeHidden で確かめる）
  const crmCard = page.locator('[data-project="営業・売上管理CRM（BtoB法人営業向け）"]')
  await expect(crmCard.getByRole('link', { name: '静的デモ →', includeHidden: true })).toHaveAttribute(
    'href',
    'https://crm-demo-static-snowy.vercel.app'
  )

  const yogaCard = page.locator(
    '[data-project="オンラインヨガ予約システム（モバイルファースト）"]'
  )
  await expect(yogaCard.getByRole('link', { name: '静的デモ →', includeHidden: true })).toHaveAttribute(
    'href',
    'https://yoga-demo-static.vercel.app'
  )
  await expect(yogaCard.getByRole('link', { name: 'GitHub →', includeHidden: true })).toHaveAttribute(
    'href',
    'https://github.com/koutadev/reservation-yoga'
  )
  await expect(yogaCard.getByRole('link', { name: '基本設計書 →', includeHidden: true })).toHaveAttribute(
    'href',
    'https://github.com/koutadev/reservation-yoga/blob/main/docs/basic-design.md'
  )

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

test('Designs: LP / Webアプリのカードを種類で絞り込める', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('#designs')
  await expect(section.getByRole('heading', { name: 'デザイン', exact: true })).toBeVisible()

  const cards = section.locator('[data-design]')
  const all = await cards.count()
  expect(all).toBeGreaterThan(0)

  await section.getByRole('button', { name: 'LP' }).click()
  await expect(section.getByRole('button', { name: 'LP' })).toHaveAttribute('aria-pressed', 'true')
  const lpCount = await cards.count()

  await section.getByRole('button', { name: 'アプリ', exact: true }).click()
  const appCount = await cards.count()

  expect(lpCount + appCount).toBe(all)
})

test('Works: カードから詳細モーダルを開閉できる', async ({ page }) => {
  await page.goto('/')

  const card = page.locator('[data-project="営業・売上管理CRM（BtoB法人営業向け）"]')
  const dialog = card.locator('dialog')
  await expect(dialog).toBeHidden()

  await card.getByRole('button', { name: /の詳細を見る/ }).click()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('アプローチ / 設計判断')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})
