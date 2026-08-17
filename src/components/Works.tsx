import { useInView } from '../hooks/useInView'

type CaseSection = {
  label: string
  body: string
}

type Project = {
  badges: { text: string; featured?: boolean }[]
  title: string
  sections: CaseSection[]
  tags: string[]
  links: { label: string; href: string }[]
  delay: string
}

const projects: Project[] = [
  {
    badges: [{ text: 'Featured', featured: true }, { text: 'Backend' }],
    title: 'Store Dashboard',
    sections: [
      {
        label: '課題',
        body: '複数店舗の売上が店舗ごとに分散して管理され、全社での比較や前年同月比の把握に手間がかかっていた。',
      },
      {
        label: 'アプローチ / 設計判断',
        body: '集計処理をクエリ側に寄せてKPI 5種（前年同月比含む）を算出し、Chart.jsで前年比較付きの3種グラフとして可視化。CSVインポート/エクスポートで既存運用からの移行を確保し、ロールベースの権限制御でデータアクセスを分離。回帰を防ぐため主要フローを58件のFeature Testで固定した。',
      },
      {
        label: '結果',
        body: '期間フィルター・売上CRUD・店舗/ユーザー管理までを1画面で完結。58件のFeature Testが全件PASSし、機能追加時にも安全に変更できる状態を維持している。',
      },
    ],
    tags: [
      'PHP 8.3',
      'Laravel 11',
      'PostgreSQL 16',
      'Chart.js',
      'Tailwind CSS',
      'Docker',
      'GitHub Actions',
    ],
    links: [
      { label: 'GitHub →', href: 'https://github.com/koutadev/store-dashboard' },
    ],
    delay: '0.1s',
  },
  {
    badges: [{ text: 'Featured', featured: true }, { text: 'AI-Powered SaaS' }],
    title: 'StudyFlow',
    sections: [
      {
        label: '課題',
        body: '学習の計画・記録・振り返りが複数ツールに分散し、継続のハードルになっていた。',
      },
      {
        label: 'アプローチ / 設計判断',
        body: '目標管理・学習記録・ポモドーロ・統計分析を1つのSaaSに統合し、Claude APIで学習プラン生成を自動化。Stripeでフリーミアムを構成し、Next.js + SupabaseでフロントからDB・認証までを最小構成にまとめてリードタイムを短縮した。',
      },
      {
        label: '結果',
        body: 'Claude Codeを活用し、企画からデプロイまでを4日間で到達。ダッシュボード・目標管理・学習記録・統計分析・Stripe決済を備えたSaaSとして公開している。',
      },
    ],
    tags: [
      'Next.js 14',
      'TypeScript',
      'Supabase',
      'PostgreSQL',
      'Claude API',
      'Stripe',
      'Tailwind CSS',
      'Vercel',
    ],
    links: [
      { label: 'Live Demo →', href: 'https://studyflow-indol.vercel.app' },
      { label: 'GitHub →', href: 'https://github.com/koutadev/studyflow' },
    ],
    delay: '0.15s',
  },
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
    <section id="works" className="py-24 md:py-32 px-6" ref={ref} aria-label="プロジェクト">
      <div className="max-w-6xl mx-auto">
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

        {projects.map((project, index) => (
          <div
            key={project.title}
            className={`fade-up border border-white/[0.06] rounded-lg p-6 md:p-8 hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(196,132,29,0.08)] transition-all duration-300 ${
              index === projects.length - 1 ? 'mb-12' : 'mb-8'
            }`}
            style={{
              transitionDelay: project.delay,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            }}
          >
            <div className="flex items-center flex-wrap gap-3 mb-6">
              {project.badges.map((badge) => (
                <span
                  key={badge.text}
                  className={`font-[family-name:var(--font-mono)] text-xs px-2 py-1 rounded ${
                    badge.featured
                      ? 'text-accent bg-accent/10'
                      : 'text-text-muted bg-white/5'
                  }`}
                >
                  {badge.text}
                </span>
              ))}
              <h3 className="font-[family-name:var(--font-serif-jp)] text-xl md:text-2xl font-bold">
                {project.title}
              </h3>
            </div>

            <div className="mb-6">
              {project.sections.map((sec) => (
                <div key={sec.label} className="mb-4 last:mb-0">
                  <p className="font-[family-name:var(--font-mono)] text-accent text-xs tracking-wider mb-1.5">
                    {sec.label}
                  </p>
                  <p className="text-text-secondary leading-relaxed">{sec.body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-[family-name:var(--font-mono)] text-xs text-text-muted border border-white/[0.06] px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-mono)] text-sm text-accent hover:text-accent-light transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}

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
                className="border border-white/[0.06] rounded-lg p-5 hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(196,132,29,0.08)] transition-all duration-300"
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
