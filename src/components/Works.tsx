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
}

// 実務（自動車ディーラー業務システム）— 課題→アプローチ→結果のケーススタディ
const workCaseStudies: Project[] = [
  {
    badges: [{ text: '実務', featured: true }, { text: 'Performance' }],
    title: 'SQLクエリ最適化',
    sections: [
      {
        label: '課題',
        body: '本番稼働中の売上集計帳票が全件取得で構築されており、画面表示・CSV出力に約6秒を要していた。主な利用者はエリアマネージャー以上の決裁層で、待ち時間が確認作業の妨げになっていた。',
      },
      {
        label: 'アプローチ / 設計判断',
        body: 'EXPLAIN ANALYZEでボトルネックを特定し、インデックス設計とクエリ見直し（不要な全件取得の排除・集計のクエリ側への集約）で処理を最適化。あわせてExcel出力のPhpSpreadsheet処理をセル単位からバルク処理へ書き換え、大量データの出力も高速化した。',
      },
      {
        label: '結果',
        body: '売上集計を約6秒 → 0.1秒（約60倍）に短縮。決裁層が帳票を待たずに確認できるようになった。',
      },
    ],
    tags: ['PHP', 'Laravel', 'PostgreSQL', 'EXPLAIN ANALYZE', 'PhpSpreadsheet'],
    links: [],
  },
  {
    badges: [{ text: '実務', featured: true }, { text: 'Data Viz' }],
    title: 'ダッシュボード開発',
    sections: [
      {
        label: '課題',
        body: '店舗ごとに分散していた売上・実績を、管理者が横断的に把握できる手段がなかった。',
      },
      {
        label: 'アプローチ / 設計判断',
        body: '複数テーブルにまたがる集計クエリを設計し、Chart.jsを用いて店舗管理ボードとして可視化。用途に応じたグラフ構成で、管理に必要な指標を1画面へ集約した。',
      },
      {
        label: '結果',
        body: '店舗横断の実績を1画面で可視化し、複数テーブルの集計をグラフで確認できるダッシュボードを実装した。',
      },
    ],
    tags: ['PHP', 'Laravel', 'PostgreSQL', 'Chart.js'],
    links: [],
  },
]

// 個人開発
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
        body: 'Claude APIを「学習プラン自動生成」というプロダクトの中核機能として設計・実装。ユーザーの目標や学習履歴を構造化してプロンプトへ渡し、実行可能な学習計画を出力させる。周辺に目標管理・学習記録・ポモドーロ・統計分析を統合し、Stripeでフリーミアムを構成。Next.js + SupabaseでフロントからDB・認証までを一貫して構築した。',
      },
      {
        label: '結果',
        body: 'Claude APIによる学習プラン生成を中核に、ダッシュボード・目標管理・学習記録・統計分析・Stripe決済を備えたSaaSとして公開している。',
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
  },
]

type CardProps = {
  project: Project
  isVisible: boolean
  delay: string
  marginBottom: string
}

function ProjectCard({ project, isVisible, delay, marginBottom }: CardProps) {
  return (
    <div
      className={`fade-up border border-white/[0.06] rounded-lg p-6 md:p-8 hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(196,132,29,0.08)] transition-all duration-300 ${marginBottom}`}
      style={{
        transitionDelay: delay,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      }}
    >
      <div className="flex items-center flex-wrap gap-3 mb-6">
        {project.badges.map((badge) => (
          <span
            key={badge.text}
            className={`font-[family-name:var(--font-mono)] text-xs px-2 py-1 rounded ${
              badge.featured ? 'text-accent bg-accent/10' : 'text-text-muted bg-white/5'
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

      <div className="flex flex-wrap gap-2 mb-6 last:mb-0">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-[family-name:var(--font-mono)] text-xs text-text-muted border border-white/[0.06] px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {project.links.length > 0 && (
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
      )}
    </div>
  )
}

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

        {/* 実務 — 主役として先頭に配置 */}
        <div
          className="fade-up"
          style={{
            transitionDelay: '0.05s',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <h3 className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mb-6">
            実務 — 自動車ディーラー業務システム
          </h3>
        </div>
        {workCaseStudies.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            isVisible={isVisible}
            delay={`${0.1 + i * 0.05}s`}
            marginBottom={i === workCaseStudies.length - 1 ? 'mb-16' : 'mb-8'}
          />
        ))}

        {/* 個人開発 */}
        <div
          className="fade-up"
          style={{
            transitionDelay: '0.25s',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <h3 className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mb-6">
            個人開発
          </h3>
        </div>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            isVisible={isVisible}
            delay={`${0.3 + i * 0.05}s`}
            marginBottom={i === projects.length - 1 ? 'mb-0' : 'mb-8'}
          />
        ))}
      </div>
    </section>
  )
}
