import SectionHeading from './SectionHeading'

// 経歴（About の中に年表としてまとめる）
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

// About: 考え方・強み（リード文と本文）→ 経歴の年表
export default function About() {
  return (
    <section id="about" className="py-20 md:py-32" aria-label="自己紹介と経歴">
      <div className="max-w-[1120px] mx-auto px-5 md:px-10">
        <SectionHeading number="01" label="ABOUT" title="包丁からキーボードへ" />

        <p
          className="font-[family-name:var(--font-serif-jp)] text-[21px] md:text-[26px] leading-[1.75] max-w-[760px] mb-7"
          data-lpm-reveal="up"
        >
          {'素材（データ）の質を見極め、最適な手順で、期待を超える品質を届ける。寿司もシステムも、根本は同じです。'}
        </p>
        <div
          className="text-text-secondary leading-relaxed max-w-[680px] flex flex-col gap-4"
          data-lpm-reveal="up"
          data-lpm-delay="100"
        >
          <p>
            {'カウンター越しにお客様と向き合い、一貫一貫に心を込めてきた経験から、使う人の待ち時間や手間を減らすことを何より大切にしています。遅い画面はEXPLAIN ANALYZEで原因をデータから突き止め、正しさは主張ではなくテストで示します。'}
          </p>
          <p>Claude CodeやChatGPTを開発補助として活用し、一人でも高い生産性を保つスタイルで開発しています。</p>
        </div>

        <h3
          className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mt-20 mb-8"
          data-lpm-reveal="fade"
        >
          経歴
        </h3>
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute top-2 bottom-2 w-px bg-accent/20"
            style={{ left: '11px' }}
            aria-hidden="true"
          />
          <ol>
            {timeline.map((item, i) => (
              <li
                key={item.period}
                data-lpm-reveal="up"
                data-lpm-delay={i * 100}
                className={`relative pl-12 ${i < timeline.length - 1 ? 'pb-12' : ''}`}
              >
                {/* Dot（最後の「これから」は中抜き） */}
                <div
                  className={`absolute rounded-full border-2 border-accent ${
                    i === timeline.length - 1 ? 'bg-bg' : 'bg-accent'
                  }`}
                  style={{ left: '5px', top: '8px', width: '13px', height: '13px' }}
                  aria-hidden="true"
                />
                <p className="font-[family-name:var(--font-mono)] text-accent text-sm mb-1">{item.period}</p>
                <p className="font-[family-name:var(--font-serif-jp)] text-lg md:text-xl font-bold mb-2">
                  {item.title}
                </p>
                <p className="text-text-secondary leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
