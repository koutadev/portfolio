import { useEffect, useState } from 'react'

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const lines = [
    {
      content: (
        <p className="font-[family-name:var(--font-mono)] text-accent text-sm md:text-base tracking-wider">
          PHP / Laravel Backend Engineer
        </p>
      ),
      delay: 0,
    },
    {
      content: (
        <h1 className="font-[family-name:var(--font-serif-jp)] text-[32px] md:text-[56px] font-bold leading-tight text-text-primary">
          元寿司職人。
        </h1>
      ),
      delay: 0.15,
    },
    {
      content: (
        <h1 className="font-[family-name:var(--font-serif-jp)] text-[32px] md:text-[56px] font-bold leading-tight text-accent">
          コードで、ビジネスを握る。
        </h1>
      ),
      delay: 0.3,
    },
    {
      content: (
        <p className="text-text-secondary text-base md:text-lg max-w-2xl leading-relaxed">
          3年間の寿司修行で培った「素材を見極める目」と「妥協なき品質」を武器に、
          業務システムの設計・開発・最適化に取り組むバックエンドエンジニアです。
        </p>
      ),
      delay: 0.45,
    },
    {
      content: (
        <div className="flex gap-4 pt-2">
          <a
            href="#works"
            className="inline-block border border-accent text-accent text-sm font-[family-name:var(--font-mono)] uppercase tracking-[3px] px-12 py-4 hover:bg-accent hover:text-bg transition-all duration-300"
          >
            Works
          </a>
          <a
            href="#contact"
            className="inline-block border border-accent text-accent text-sm font-[family-name:var(--font-mono)] uppercase tracking-[3px] px-12 py-4 hover:bg-accent hover:text-bg transition-all duration-300"
          >
            Contact
          </a>
        </div>
      ),
      delay: 0.6,
    },
  ]

  return (
    <section className="relative min-h-screen flex items-center" aria-label="イントロダクション">
      <div className="max-w-[900px] mx-auto w-full px-5 md:px-10">
        <div className="flex flex-col gap-4 md:gap-6">
          {lines.map((line, i) => (
            <div
              key={i}
              className="hero-line"
              style={{
                transitionDelay: `${line.delay}s`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {line.content}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
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
