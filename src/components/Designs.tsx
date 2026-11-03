import { useEffect, useRef, useState } from 'react'
import { lpmReveal } from 'lp-motion'
import SectionHeading from './SectionHeading'
import { designKindLabel, designs, type DesignItem, type DesignKind } from '../data/designs'

type Filter = 'all' | DesignKind

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'lp', label: 'LP' },
  { value: 'app', label: 'Webアプリ' },
]

// サムネイル未設定時の簡易プレビュー（種別ごとのワイヤー風）
function FallbackThumb({ kind }: { kind: DesignKind }) {
  if (kind === 'lp') {
    return (
      <div className="h-full bg-[#1b1a18] p-[7%] flex flex-col gap-2">
        <div className="h-1.5 w-[30%] bg-text-primary/25" />
        <div className="flex-1 bg-[#2a2620] flex flex-col justify-center gap-1.5 p-[7%]">
          <div className="h-2.5 w-[70%] bg-text-primary/70" />
          <div className="h-2.5 w-1/2 bg-text-primary/70" />
          <div className="h-3.5 w-[28%] mt-1.5 bg-accent" />
        </div>
      </div>
    )
  }
  return (
    <div className="h-full bg-[#16181c] p-[6%] flex gap-2">
      <div className="w-[22%] bg-[#22252b]" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-1.5 h-[22%]">
          <div className="bg-[#22252b]" />
          <div className="bg-[#22252b]" />
          <div className="bg-[#22252b]" />
        </div>
        <div className="flex-1 bg-[#22252b] flex items-end gap-1 p-2">
          <div className="flex-1 h-[40%] bg-accent" />
          <div className="flex-1 h-[65%] bg-accent" />
          <div className="flex-1 h-1/2 bg-accent" />
          <div className="flex-1 h-[85%] bg-accent" />
        </div>
      </div>
    </div>
  )
}

function DesignCard({ item }: { item: DesignItem }) {
  const isReady = Boolean(item.href)
  const body = (
    <>
      <div className="lpm-zoom aspect-[4/3]" aria-hidden="true">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            className="h-full object-cover object-top"
          />
        ) : (
          <FallbackThumb kind={item.kind} />
        )}
      </div>
      <div className="px-5 pt-4 pb-5 flex flex-col gap-1.5">
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-accent tracking-[0.1em]">
          {designKindLabel[item.kind]}
        </p>
        <h3 className="text-[17px] font-bold leading-snug">{item.title}</h3>
        <p className="text-[13px] text-text-secondary">
          {item.category} · {item.tone}
        </p>
        <span
          className={`font-[family-name:var(--font-mono)] text-xs pt-1.5 ${
            isReady ? 'text-accent-light' : 'text-text-faint'
          }`}
        >
          {isReady ? '詳細を見る ↗' : '準備中'}
        </span>
      </div>
    </>
  )

  const cardClass =
    'group flex flex-col h-full bg-[#121214] border border-white/[0.06] transition-all duration-300'

  return isReady ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-design={item.slug}
      className={`${cardClass} lpm-lift hover:border-accent/40`}
    >
      {body}
    </a>
  ) : (
    <div data-design={item.slug} className={cardClass}>
      {body}
    </div>
  )
}

export default function Designs() {
  const [filter, setFilter] = useState<Filter>('all')
  const shown = filter === 'all' ? designs : designs.filter((d) => d.kind === filter)
  const listRef = useRef<HTMLUListElement>(null)

  // 絞り込みで入れ替わったカードにも出現アニメ（lp-motion M-10）を付け直す
  useEffect(() => {
    if (listRef.current) lpmReveal(listRef.current)
  }, [filter])

  return (
    <section id="designs" className="py-20 md:py-32" aria-label="デザイン">
      <div className="max-w-[1120px] mx-auto px-5 md:px-10">
        <SectionHeading
          number="03"
          label="DESIGNS"
          title="デザイン"
          lead="LP・Webアプリのデザイン案です。カードから詳細ページ（ライブプレビュー）へ移動します。"
        />

        <div
          data-lpm-reveal="up"
          className="flex flex-wrap gap-2 mb-8"
          role="group"
          aria-label="種類で絞り込み"
        >
          {filters.map((f) => {
            const active = filter === f.value
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.value)}
                className={`min-h-11 px-5 font-[family-name:var(--font-mono)] text-xs tracking-wider border transition-colors duration-200 ${
                  active
                    ? 'bg-accent border-accent text-bg'
                    : 'border-white/15 text-text-secondary hover:border-accent/60 hover:text-text-primary'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <ul ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shown.map((item, i) => (
            <li key={`${filter}-${item.slug}`} data-lpm-reveal="up" data-lpm-delay={i * 60}>
              <DesignCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
