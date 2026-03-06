import { useInView } from '../hooks/useInView'

const timeline = [
  {
    period: '2020-2023',
    icon: '🍣',
    title: '寿司職人',
    description:
      '都内の寿司店で3年間修行。素材の見極め、段取り、品質への妥協なき姿勢を叩き込まれる。',
  },
  {
    period: '2023-2025',
    icon: '📚',
    title: '独学期間',
    description:
      '2年間、PHP・SQL・Linuxを中心に独学。Udemyと技術書で基礎を固め、個人開発で実践力を磨く。',
  },
  {
    period: '2025-現在',
    icon: '💻',
    title: 'SIer エンジニア',
    description:
      '自動車ディーラー向け業務システムを開発。SQLクエリ60倍高速化、Excel出力機能など実務で成果を出す。',
  },
  {
    period: 'Next',
    icon: '🚀',
    title: 'フリーランスへ',
    description:
      '培った技術力と問題解決力で、リモートワークを軸にしたフリーランスエンジニアとして独立を目指す。',
  },
]

export default function Career() {
  const { ref, isVisible } = useInView()

  return (
    <section id="career" className="py-20 md:py-[160px]" ref={ref}>
      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        <div
          className="fade-up"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <p className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mb-4">
            04 — CAREER
          </p>
          <h2 className="font-[family-name:var(--font-serif-jp)] text-[28px] md:text-4xl font-bold mb-12">
            経歴
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: '11px',
              width: '1px',
              background: 'rgba(196, 132, 29, 0.2)',
            }}
          />

          <div className="flex flex-col">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="fade-up relative"
                style={{
                  transitionDelay: `${(i + 1) * 0.1}s`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  paddingLeft: '48px',
                  paddingBottom: i < timeline.length - 1 ? '48px' : '0',
                }}
              >
                {/* Dot - 24px circle with emoji */}
                <div
                  className="absolute rounded-full bg-bg flex items-center justify-center"
                  style={{
                    left: '0',
                    top: '2px',
                    width: '24px',
                    height: '24px',
                    border: '2px solid #c4841d',
                    fontSize: '12px',
                    lineHeight: 1,
                  }}
                >
                  {item.icon}
                </div>

                <p className="font-[family-name:var(--font-mono)] text-accent text-sm mb-1">
                  {item.period}
                </p>
                <h3 className="font-[family-name:var(--font-serif-jp)] text-lg md:text-xl font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
