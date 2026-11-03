import { useInView } from '../hooks/useInView'
import SectionHeading from './SectionHeading'

const timeline = [
  {
    period: '2020-2023',
    title: '寿司職人',
    description:
      '都内の寿司店で3年間修行。素材の見極め、段取り、品質への妥協なき姿勢を叩き込まれる。',
  },
  {
    period: '2023-2025',
    title: '独学期間',
    description:
      '2年間、PHP・SQL・Linuxを中心に独学。Udemyと技術書で基礎を固め、個人開発で実践力を磨く。',
  },
  {
    period: '2025-2026',
    title: 'SIer エンジニア',
    description:
      '自動車ディーラー向け業務システムを開発。SQLクエリ60倍高速化、Excel出力機能など実務で成果を出す。',
  },
  {
    period: 'Next',
    title: 'これから',
    description:
      '技術を土台に、上流工程（要件定義・設計）や顧客の課題解決へ領域を広げ、長期的に価値を出せるエンジニアを目指す。Java Silver・応用情報技術者試験を学習中。',
  },
]

export default function Career() {
  const { ref, isVisible } = useInView()

  return (
    <section id="career" className="py-20 md:py-32" ref={ref} aria-label="経歴">
      <div className="max-w-[1120px] mx-auto px-5 md:px-10">
        <SectionHeading number="05" label="CAREER" title="経歴" isVisible={isVisible} />

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
                {/* Dot */}
                <div
                  className={`absolute rounded-full border-2 border-accent ${
                    i === timeline.length - 1 ? 'bg-bg' : 'bg-accent'
                  }`}
                  style={{ left: '5px', top: '8px', width: '13px', height: '13px' }}
                  aria-hidden="true"
                />

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
