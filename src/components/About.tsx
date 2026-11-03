import SectionHeading from './SectionHeading'

// 経歴の要点（詳細は Career セクション）
const steps = [
  { period: '2020–2023', title: '寿司職人', body: '素材の見極め、段取り、品質への執念' },
  { period: '2023–2025', title: '独学', body: 'PHP・SQL・Linuxを中心に基礎を固める' },
  { period: '2025–2026', title: 'SIer エンジニア', body: '業務システム開発・SQL最適化' },
]

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32" aria-label="自己紹介">
      <div className="max-w-[1120px] mx-auto px-5 md:px-10">
        <SectionHeading number="01" label="ABOUT" title="包丁からキーボードへ" />

        <p
          className="font-[family-name:var(--font-serif-jp)] text-[21px] md:text-[26px] leading-[1.75] max-w-[760px] mb-7"
          data-lpm-reveal="up"
        >
          素材（データ）の質を見極め、最適な手順で、期待を超える品質を届ける。
          寿司もシステムも、根本は同じです。
        </p>
        <div
          className="text-text-secondary leading-relaxed max-w-[680px] mb-14 flex flex-col gap-4"
          data-lpm-reveal="up"
          data-lpm-delay="100"
        >
          <p>
            寿司職人として3年間、毎朝4時に起きて市場に通い、魚の鮮度を一目で見極める力を磨きました。
            2年間の独学を経てSIer企業で自動車ディーラー向けの業務システムを開発し、SQLクエリの60倍高速化など、実務で数字に残る成果を出してきました。
          </p>
          <p>Claude CodeやChatGPTを開発補助として活用し、一人でも高い生産性を保つスタイルで開発しています。</p>
        </div>

        <ol
          className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/[0.08]"
          data-lpm-stagger="100"
        >
          {steps.map((s) => (
            <li key={s.period} className="pt-6 pr-6 pb-2">
              <p className="font-[family-name:var(--font-mono)] text-xs text-accent">{s.period}</p>
              <p className="font-bold mt-1">{s.title}</p>
              <p className="text-sm text-text-secondary mt-0.5">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
