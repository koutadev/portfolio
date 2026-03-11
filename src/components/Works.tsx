import { useInView } from '../hooks/useInView'

const techTags = [
  'PHP 8.3',
  'Laravel 11',
  'PostgreSQL 16',
  'Chart.js',
  'Tailwind CSS',
  'Docker',
  'GitHub Actions',
]

const workExperience = [
  {
    title: 'SQLクエリ最適化',
    description:
      '売上集計クエリを6秒→0.1秒に改善（60倍高速化）。EXPLAIN ANALYZEによるボトルネック分析とインデックス設計。',
  },
  {
    title: 'Excel出力リファクタリング',
    description:
      'PhpSpreadsheetのセル単位処理をバルク処理に書き換え、大量データの出力を高速化。',
  },
  {
    title: 'ダッシュボード開発',
    description:
      'Chart.jsを使った店舗管理ボードの設計・実装。複数テーブルの集計クエリとデータ可視化。',
  },
]

export default function Works() {
  const { ref, isVisible } = useInView()

  return (
    <section id="works" className="py-20 md:py-[160px]" ref={ref}>
      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        <div
          className="fade-up"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <p className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mb-4">
            03 — WORKS
          </p>
          <h2 className="font-[family-name:var(--font-serif-jp)] text-[28px] md:text-4xl font-bold mb-12">
            プロジェクト
          </h2>
        </div>

        {/* Featured Project */}
        <div
          className="fade-up rounded-lg mb-12 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(196,132,29,0.08)] transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '40px',
            transitionDelay: '0.1s',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(196, 132, 29, 0.3)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-[family-name:var(--font-mono)] text-xs text-accent bg-accent/10 px-2 py-1 rounded">
              Featured
            </span>
            <h3 className="font-[family-name:var(--font-serif-jp)] text-xl md:text-2xl font-bold">
              Store Dashboard
            </h3>
          </div>
          <p className="text-text-secondary leading-relaxed mb-6">
            複数店舗の売上データを一元管理するダッシュボードアプリケーション。KPIカード、Chart.jsによる3種のグラフ、売上CRUD、Excel/CSVエクスポート、店舗管理、ユーザー権限制御まで実装。43件のFeature
            Testで品質を担保。
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {techTags.map((tag) => (
              <span
                key={tag}
                className="font-[family-name:var(--font-mono)] text-xs text-text-muted border border-white/[0.06] px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/koutadev/store-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-mono)] text-sm text-accent hover:text-accent-light transition-colors duration-200"
            >
              GitHub &rarr;
            </a>
          </div>
        </div>

        {/* Work Experience */}
        <div
          className="fade-up"
          style={{
            transitionDelay: '0.2s',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <h3 className="font-[family-name:var(--font-serif-jp)] text-lg md:text-xl font-bold mb-6 text-text-secondary">
            自動車ディーラー業務システム
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {workExperience.map((work, i) => (
              <div
                key={i}
                className="rounded-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(196,132,29,0.08)] transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '40px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(196, 132, 29, 0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              >
                <h4 className="font-[family-name:var(--font-mono)] text-accent text-sm mb-3">
                  {work.title}
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {work.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
