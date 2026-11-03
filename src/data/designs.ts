// Designs セクションに載せる LP / Webアプリのデザイン案。
// 詳細は href のリンク先（ライブプレビュー）で見てもらう。
// href が未設定のものは「準備中」としてリンクなしのカードで表示する。
// thumbnail を指定すると画像（public/ 配下のパス推奨、4:3）を表示し、
// 未指定なら種別ごとの簡易プレビューを表示する。

export type DesignKind = 'lp' | 'app'

export type DesignItem = {
  slug: string
  kind: DesignKind
  title: string
  /** 業種や用途（例: 飲食店 / 予約管理） */
  category: string
  /** トーン（例: 和モダン / ミニマル） */
  tone: string
  href?: string
  thumbnail?: string
}

export const designKindLabel: Record<DesignKind, string> = {
  lp: 'LP',
  app: 'APP',
}

// デザイン見本集（koutadev/designs）のページ。詳細はリンク先で見てもらう
// DESIGNS_BASE_URL を空にすると、カードはリンクなしの「準備中」表示になる
const DESIGNS_BASE_URL = 'https://designs-sigma-lac.vercel.app'

const href = (path: string) => (DESIGNS_BASE_URL ? `${DESIGNS_BASE_URL}/${path}/` : undefined)

export const designs: DesignItem[] = [
  {
    slug: 'bakery',
    kind: 'lp',
    title: 'こむぎと日々',
    category: '街のベーカリー',
    tone: 'ミニマル・グリッド',
    href: href('bakery'),
    thumbnail: '/designs/bakery.png',
  },
  {
    slug: 'invoice-saas',
    kind: 'lp',
    title: 'ハレノ請求',
    category: '請求書自動化SaaS',
    tone: 'エディトリアル',
    href: href('invoice-saas'),
    thumbnail: '/designs/invoice-saas.png',
  },
  {
    slug: 'salon',
    kind: 'app',
    title: 'LUMO',
    category: '美容室の予約・顧客管理',
    tone: 'カレンダー中心',
    href: href('salon'),
    thumbnail: '/designs/salon.png',
  },
  {
    slug: 'budget',
    kind: 'app',
    title: 'ポケット',
    category: '家計簿・サブスク管理（スマホ）',
    tone: 'カラーブロック',
    href: href('budget'),
    thumbnail: '/designs/budget.png',
  },
]
