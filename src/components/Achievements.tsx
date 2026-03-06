import { useInView } from '../hooks/useInView'

const achievements = [
  { number: '60×', label: 'SQLクエリ高速化', detail: '6秒 → 0.1秒' },
  { number: '14,000+', label: 'テストデータ件数', detail: '実運用を想定した設計' },
  { number: '43', label: 'テストケース', detail: '全件PASS' },
  { number: '3年', label: '寿司職人の経験', detail: '品質への執念' },
]

export default function Achievements() {
  const { ref, isVisible } = useInView()

  return (
    <section className="py-20 md:py-[160px]" ref={ref}>
      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((item, i) => (
            <div
              key={i}
              className="text-center fade-up rounded-lg"
              style={{
                transitionDelay: `${i * 0.1}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '40px 24px',
              }}
            >
              <p className="font-[family-name:var(--font-serif-jp)] text-[36px] font-bold text-accent mb-2">
                {item.number}
              </p>
              <p className="text-text-primary text-sm font-medium mb-1">
                {item.label}
              </p>
              <p className="text-text-faint text-xs">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
