import SectionHeading from './SectionHeading'

// About は「考え方・強み」を語るセクション。年表などの事実は Career にまとめる
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
          className="text-text-secondary leading-relaxed max-w-[680px] flex flex-col gap-4"
          data-lpm-reveal="up"
          data-lpm-delay="100"
        >
          <p>
            カウンター越しにお客様と向き合い、一貫一貫に心を込めてきた経験から、
            使う人の待ち時間や手間を減らすことを何より大切にしています。
            遅い画面はEXPLAIN ANALYZEで原因をデータから突き止め、正しさは主張ではなくテストで示します。
          </p>
          <p>Claude CodeやChatGPTを開発補助として活用し、一人でも高い生産性を保つスタイルで開発しています。</p>
        </div>
      </div>
    </section>
  )
}
