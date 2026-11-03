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
  app: 'WEB APP',
}

// TODO: 実際のデザイン案に差し替える（名前・業種・トーン・リンク先・サムネイル）
export const designs: DesignItem[] = [
  { slug: 'lp-01', kind: 'lp', title: '[LPデザイン名 01]', category: '[業種]', tone: '[トーン]' },
  { slug: 'lp-02', kind: 'lp', title: '[LPデザイン名 02]', category: '[業種]', tone: '[トーン]' },
  { slug: 'app-01', kind: 'app', title: '[アプリデザイン名 01]', category: '[用途]', tone: '[トーン]' },
  { slug: 'app-02', kind: 'app', title: '[アプリデザイン名 02]', category: '[用途]', tone: '[トーン]' },
]
