// 数字で語る実績（ヒーロー右側に表示）
const stats = [
  { number: '60', unit: '×', label: 'SQL高速化 6秒→0.1秒' },
  { number: '371', unit: '', label: '予約システムのテスト' },
  { number: '58', unit: '', label: 'Feature Test 全件PASS' },
  { number: '3', unit: '年', label: '寿司職人の経験' },
]

const buttonBase =
  'inline-flex items-center justify-center min-h-12 px-8 font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-[0.16em] transition-all duration-300'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-24" aria-label="イントロダクション">
      <div className="max-w-[1120px] mx-auto w-full px-5 md:px-10 flex flex-col lg:flex-row lg:items-end gap-14 lg:gap-16">
        <div className="flex-1 min-w-0 flex flex-col gap-5 md:gap-6">
          <p
            className="font-[family-name:var(--font-mono)] text-accent text-sm md:text-base tracking-[0.12em]"
            data-lpm-reveal="up"
            data-lpm-delay={0}
          >
            PHP / Laravel Backend Engineer
          </p>
          <h1
            className="font-[family-name:var(--font-serif-jp)] text-[34px] sm:text-[44px] lg:text-[54px] font-bold leading-[1.25] text-text-primary"
            data-lpm-reveal="up"
            data-lpm-delay={150}
          >
            元寿司職人。
            <br />
            {/* keep-all + wbr: 「コードで、」「ビジネスを握る。」の区切りでだけ改行する */}
            <span className="text-accent [word-break:keep-all]">
              コードで、<wbr />ビジネスを握る。
            </span>
          </h1>
          <p
            className="text-text-secondary text-base md:text-lg max-w-[560px] leading-relaxed"
            data-lpm-reveal="up"
            data-lpm-delay={300}
          >
            3年間の寿司修行で培った「素材を見極める目」と「妥協なき品質」を武器に、
            業務システムの設計・開発・最適化に取り組むバックエンドエンジニアです。
          </p>
          <div className="flex flex-wrap gap-3 pt-2" data-lpm-reveal="up" data-lpm-delay={450}>
            <a href="#works" className={`${buttonBase} bg-accent text-bg hover:bg-accent-light`}>
              Works
            </a>
            <a
              href="#designs"
              className={`${buttonBase} border border-text-primary/30 text-text-primary hover:border-accent hover:text-accent`}
            >
              Designs
            </a>
          </div>
        </div>

        <dl
          className="w-full lg:w-[340px] shrink-0 grid grid-cols-2 gap-px bg-white/[0.08] border border-white/[0.08]"
          data-lpm-reveal="up"
          data-lpm-delay={600}
          aria-label="実績"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-bg p-5 flex flex-col-reverse">
              <dt className="text-xs text-text-secondary mt-1">{s.label}</dt>
              <dd className="font-[family-name:var(--font-mono)] text-[32px] leading-tight text-accent">
                <span data-lpm-count>{s.number}</span>
                {s.unit}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" aria-hidden="true">
        <div className="flex flex-col items-center gap-2">
          <span className="font-[family-name:var(--font-mono)] text-xs text-text-faint tracking-widest">
            SCROLL
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-text-faint to-transparent" />
        </div>
      </div>
    </section>
  )
}
