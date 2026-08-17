import { useInView } from '../hooks/useInView'

export default function About() {
  const { ref, isVisible } = useInView()

  return (
    <section id="about" className="pt-20 md:pt-[160px] pb-40 md:pb-[240px]" ref={ref} aria-label="自己紹介">
      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        <div
          className="fade-up"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <p className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mb-4">
            01 — ABOUT
          </p>
          <h2 className="font-[family-name:var(--font-serif-jp)] text-[28px] md:text-4xl font-bold mb-12">
            包丁からキーボードへ
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div
            className="fade-up"
            style={{
              transitionDelay: '0.1s',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            }}
          >
            <p className="text-text-secondary leading-relaxed mb-6">
              寿司職人として3年間、毎朝4時に起きて市場に通い、魚の鮮度を一目で見極める力を磨きました。カウンター越しにお客様と向き合い、一貫一貫に心を込める日々。
            </p>
            <p className="text-text-secondary leading-relaxed">
              その経験は、今のエンジニアリングに直結しています。「素材（データ）の質を見極め、最適な手順（アルゴリズム）で、期待を超える品質（パフォーマンス）を届ける」——
              根本は同じです。
            </p>
          </div>
          <div
            className="fade-up"
            style={{
              transitionDelay: '0.2s',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            }}
          >
            <p className="text-text-secondary leading-relaxed mb-6">
              2年間の独学を経て、現在はSIer企業で自動車ディーラー向けの業務システムを開発。SQLクエリの60倍高速化、Excelエクスポートのリファクタリングなど、実務で数字に残る成果を出してきました。
            </p>
            <p className="text-text-secondary leading-relaxed">
              Claude
              CodeやChatGPTを開発補助として活用し、一人でも高い生産性を保つスタイルで開発しています。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
