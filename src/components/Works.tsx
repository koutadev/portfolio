import SectionHeading from './SectionHeading'
import SqlOptimizationDemo from './SqlOptimizationDemo'

type CaseSection = {
  label: string
  body: string
}

type Project = {
  id: string
  badges: { text: string; featured?: boolean }[]
  title: string
  /** カードに出す1〜2行の要約（詳細はモーダル） */
  summary: string
  sections: CaseSection[]
  tags: string[]
  links: { label: string; href: string }[]
}

// 実務（自動車ディーラー業務システム）— 課題→アプローチ→結果のケーススタディ
const workCaseStudies: Project[] = [
  {
    badges: [{ text: '実務', featured: true }, { text: 'Performance' }],
    id: 'sql',
    title: 'SQLクエリ最適化',
    summary: '売上集計を約6秒 → 0.1秒（約60倍）に短縮。Before/Afterデモ付き。',
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
    links: [{ label: 'Before/After デモを実行 ↓', href: '#sql-demo' }],
  },
  {
    badges: [{ text: '実務', featured: true }, { text: 'Data Viz' }],
    id: 'dashboard',
    title: 'ダッシュボード開発',
    summary: '店舗ごとに分散していた売上・実績を、1画面で横断的に可視化。',
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

// 自主制作の業務システム（共通基盤と、その上に載せた CRM・ヨガ予約）
const businessSystems: Project[] = [
  {
    badges: [{ text: 'Featured', featured: true }, { text: '業務システム' }],
    id: 'crm',
    title: '営業・売上管理CRM（BtoB法人営業向け）',
    summary: '税率スナップショットと端数処理の集約で、金額の正確性を保ったまま予実・パイプラインを可視化。',
    sections: [
      {
        label: '想定クライアント',
        body: 'BtoB向けにシステム開発・広告・人材サービスを提供する中小企業（架空「アルティス・ソリューションズ」／従業員数十名・営業8名）。顧客・商談・売上の情報が担当者ごとに分散し、会社全体の売上と受注見込みを把握しづらい状態を想定した。',
      },
      {
        label: '課題',
        body: '金額と売上の一元管理、営業プロセス（見込み〜受注）の可視化、そして確定売上金額の正確性。とくに税額の端数処理や税率改定への備えは、属人的な運用のままでは金額のズレを生みやすい。',
      },
      {
        label: 'アプローチ / 設計判断',
        body: '顧客→商談→明細で金額を積み上げ、各層で可視化する構造にした。税は内税に統一し、税率マスタを適用開始日で世代管理したうえで、明細には確定時点の税率をスナップショットとして保持。これにより税率改定への追随と過去データの保全を両立させ、端数は「同一税率でまとめて1回だけ切り捨て」に固定して計算箇所を1か所へ集約した。集計はデータ量に依存しない固定クエリ本数で組み（N+1を排除し、本数はテストで固定）、Salesforce・GENIEE・Mazricaなど実サービスを調査したうえで、期間フィルタ（予定クローズ日／受注日の切替＋相対期間）・保存ビュー・カンバン・組織階層のドリルダウン・予実管理（目標と達成率）を実装した。',
      },
      {
        label: '結果',
        body: '金額の正確性を保ったまま、パイプライン・売上推移・組織別・予実を多角的に可視化できる状態にした。共通基盤の上に構築しているため、同じ土台で他の業務システムへ横展開できる。',
      },
      {
        label: '設計ハイライト',
        body: '内税の税率グループ単位の端数処理／税率スナップショットによる過去データ保全／商談合計のサーバ側再計算／集計の固定クエリ本数（実測値をテストで固定）／組織階層（地域→エリア→店舗→担当者）集計／予実管理（目標・達成率）。共通基盤の横断改善で、一覧のカード化・ポップアップの画面内配置・タップ領域44px等のモバイル対応も実施（レスポンシブ）。',
      },
    ],
    tags: [
      'PHP 8.3',
      'Laravel',
      'PostgreSQL',
      'Blade + Alpine.js',
      'Tailwind CSS',
      'Docker',
      'Pint / Larastan / PHPUnit',
      'GitHub Actions',
    ],
    links: [
      { label: '静的デモ →', href: 'https://crm-demo-static-snowy.vercel.app' },
      { label: 'GitHub →', href: 'https://github.com/koutadev/crm-sales' },
      {
        label: '基本設計書 →',
        href: 'https://github.com/koutadev/crm-sales/blob/main/docs/basic-design.md',
      },
    ],
  },
  {
    badges: [{ text: 'Featured', featured: true }, { text: 'モバイルファースト' }],
    id: 'yoga',
    title: 'オンラインヨガ予約システム（モバイルファースト）',
    summary: '行ロックとキャンセル待ちの自動繰り上げで、定員超過・二重予約をテストで防止。',
    sections: [
      {
        label: '想定クライアント',
        body: 'オンライン専門のヨガスタジオ（架空）。複数のインストラクターがグループ／マンツーマンのレッスンをオンラインで提供し、会員はその都度、空いている枠を見て予約する運用を想定した。',
      },
      {
        label: '課題',
        body: '予約・定員・キャンセルを手作業で管理しているため、二重予約や定員超過、予約忘れが起きる。満席になった時点で申し込みを取りこぼし、キャンセルで空いた席も埋まらないまま機会損失になる。会員がスマホだけで完結できる予約導線もない。',
      },
      {
        label: 'アプローチ / 設計判断',
        body: '予約の確定は、対象の枠を行ロック（SELECT … FOR UPDATE）してから残枠を数え直し、その上でINSERTする手順に固定した。これにより同時アクセスでも定員超過・二重予約が起こらない。正しさは主張ではなく、2コネクションで同時に予約を試みる同時実行テストで「定員を超えない」ことを証明している。キャンセルで空いた席は待ち行列の先頭へ自動で繰り上げ（同じ時間帯に別の予約がある会員はスキップ）、キャンセルと繰り上げは同一トランザクション・同一の枠ロックで処理して中途半端な状態を残さない。画面はモバイルファーストで、スマホは日付を切り替えるリスト、PCは積み上げゲージ式の週カレンダー。空き状況はゲージの面積・色・数値で三重に符号化し、色覚多様性に配慮した。残枠集計はデータ量に依存しない固定クエリ本数で組み、本数をテストで固定している。共通基盤の上に構築しており、CRMと同じ土台からの派生である。',
      },
      {
        label: '結果',
        body: '予約の整合性を保証したうえで（定員超過・二重予約はテストで防止）、満席時の機会損失もキャンセル待ちの自動繰り上げで解消できる状態にした。会員はスマホだけで空き枠の確認から予約・キャンセルまで完結できる。',
      },
      {
        label: '設計ハイライト',
        body: '予約競合の行ロック制御／キャンセル待ちの繰り上げロジック／モバイルファーストの週カレンダー／データ量非依存の集計／テストで整合を証明（371テスト）。',
      },
    ],
    tags: [
      'PHP 8.3',
      'Laravel',
      'PostgreSQL',
      'Blade + Alpine.js',
      'Tailwind CSS',
      'Docker',
      'Pint / Larastan / PHPUnit',
      'GitHub Actions',
    ],
    links: [
      { label: '静的デモ →', href: 'https://yoga-demo-static.vercel.app' },
      { label: 'GitHub →', href: 'https://github.com/koutadev/reservation-yoga' },
      {
        label: '基本設計書 →',
        href: 'https://github.com/koutadev/reservation-yoga/blob/main/docs/basic-design.md',
      },
    ],
  },
  {
    badges: [{ text: '共通基盤', featured: true }, { text: 'Platform' }],
    id: 'platform',
    title: '業務システム共通基盤テンプレート',
    summary: '認証・権限・一覧・監査ログの土台を切り出し、CRMとヨガ予約の2システムを派生。',
    sections: [
      {
        label: '課題',
        body: '業務システムは分野が違っても、認証・権限・マスタ管理・一覧検索・監査ログ・ダッシュボードという土台はほぼ同じ。案件ごとに作り直すと、同じ実装を繰り返しながら品質も揃わない。',
      },
      {
        label: 'アプローチ / 設計判断',
        body: '土台だけを完成させたテンプレートとして切り出した。認証・ロール権限・共通マスタ・共通一覧基盤（検索／絞り込み／並び替え／ページング／CSV／保存ビュー）・監査ログ・UI部品一式のデザインシステムを備え、業務固有のテーブルと画面を足すだけで新規システムを始められる。共通部分はこの基盤で直し、各システムへ同期スクリプトで反映する運用にしている。',
      },
      {
        label: '結果',
        body: 'この基盤から、営業・売上管理CRMとオンラインヨガ予約システムの2システムを派生させた。モバイル対応のような横断的な改善は基盤で1回直して両システムへ同期スクリプトで反映しており、横展開できる設計であることを実証できている。同じ構造で複数システムを作れるため、将来それらを統合する際の障壁も小さくなる。',
      },
      {
        label: '設計ハイライト',
        body: '業務コード採番の行ロック（同時登録でも番号が重複しない）／監査ログの付け忘れ防止（モデル側で自動記録）／共通一覧基盤（定義クラス1つで一覧機能一式）／デザインシステム（テーマ差し替えで配色とサービス名を切替）。',
      },
    ],
    tags: [
      'PHP 8.3',
      'Laravel',
      'PostgreSQL',
      'Blade + Alpine.js',
      'Tailwind CSS',
      'Docker',
      'GitHub Actions',
    ],
    links: [
      {
        label: 'GitHub →',
        href: 'https://github.com/koutadev/laravel-business-template',
      },
    ],
  },
]

// 個人開発
const projects: Project[] = [
  {
    badges: [{ text: 'Featured', featured: true }, { text: 'Backend' }],
    id: 'store-dashboard',
    title: 'Store Dashboard',
    summary: '複数店舗の売上をKPI・グラフ・CRUDで一元管理。58件のFeature Testが全件PASS。',
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
    id: 'studyflow',
    title: 'StudyFlow',
    summary: 'Claude APIで学習プランを自動生成する、Stripe決済付きのSaaS。',
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
  {
    badges: [{ text: 'New', featured: true }, { text: 'Frontend' }],
    id: 'portfolio-desk',
    title: 'portfolio-desk',
    summary: 'パソコンのデスクトップを模したポートフォリオ。ウィンドウ操作を外部ライブラリなしで実装。',
    sections: [
      {
        label: '課題',
        body: '作品を縦に並べるだけのポートフォリオでは、どれも似た見た目になり印象に残りにくい。かといって凝った演出を入れると、表示の重さや操作のしにくさ、読み上げなどのアクセシビリティが犠牲になりやすい。',
      },
      {
        label: 'アプローチ / 設計判断',
        body: '画面全体をパソコンのデスクトップに見立て、About・制作物・スキル・問い合わせをアプリのウィンドウとして開く構成にした。ページは Astro で静的に書き出し、問い合わせフォームだけを Vercel のサーバー側（Resend で送信）で動かす。ウィンドウの移動・最小化・アニメーションは外部ライブラリを使わず素の TypeScript で実装。各作品で「作らなかったもの」とその理由をゴミ箱に残し、判断の過程も見せるようにした。',
      },
      {
        label: '結果',
        body: '起動時のログイン画面から、ウィンドウを開いて作品を見て回れるサイトとして公開。キーボードだけで全操作でき（矢印キーで移動、Esc で閉じる）、「動きを減らす」設定ではアニメーションを止め、JavaScript が動かない環境でも中身を読める。幅 820px 以下ではスマホのホーム画面風に切り替わる。',
      },
      {
        label: '設計ハイライト',
        body: '最小化したときのボタン位置を覚えて次回同じ位置に開くウィンドウ管理／ウィンドウを細い帯に切って縮める最小化アニメーション／滞在時間で朝→夜と変わる壁紙／作品ごとの個別ページ（/works/<slug>/）／問い合わせのスパム対策（見えない入力欄）。',
      },
    ],
    tags: ['Astro 5', 'TypeScript', 'CSS', 'Vercel', 'Resend'],
    links: [
      { label: 'Live Demo →', href: 'https://portfolio-desk-chi.vercel.app' },
      { label: 'GitHub →', href: 'https://github.com/koutadev/portfolio-desk' },
    ],
  },
]

const groups: { label: string; items: Project[] }[] = [
  { label: '実務 — 自動車ディーラー業務システム', items: workCaseStudies },
  { label: '自主制作 — 業務システム', items: businessSystems },
  { label: '個人開発', items: projects },
]

function ExternalOrAnchorLink({ link, closeOnClick }: { link: Project['links'][number]; closeOnClick?: boolean }) {
  const isAnchor = link.href.startsWith('#')
  return (
    <a
      href={link.href}
      {...(isAnchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      {...(isAnchor && closeOnClick ? { 'data-lpm-close': '' } : {})}
      className="inline-flex items-center min-h-11 px-5 border border-accent/40 font-[family-name:var(--font-mono)] text-[13px] text-accent hover:bg-accent hover:text-bg transition-colors duration-200"
    >
      {link.label}
    </a>
  )
}

// 一覧用の小さいカード。カード全体がクリック範囲で、詳細モーダル（lp-motion M-17）を開く
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="lpm-lift group relative h-full bg-white/[0.015] border border-white/[0.08] hover:border-accent/40 focus-within:border-accent/60 p-6 md:p-7 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {project.badges.map((badge) => (
          <span
            key={badge.text}
            className={`font-[family-name:var(--font-mono)] text-[11px] px-2 py-0.5 ${
              badge.featured ? 'text-accent bg-accent/10' : 'text-text-muted bg-white/5'
            }`}
          >
            {badge.text}
          </span>
        ))}
      </div>
      <h3 className="font-[family-name:var(--font-serif-jp)] text-lg md:text-xl font-bold leading-snug">
        {project.title}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed flex-1">{project.summary}</p>
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-faint truncate">
          {project.tags.slice(0, 3).join(' · ')}
        </span>
        {/* ::after をカード全面に広げ、カードのどこを押しても開く */}
        <button
          type="button"
          data-lpm-open={`#work-${project.id}`}
          aria-haspopup="dialog"
          aria-label={`${project.title} の詳細を見る`}
          className="shrink-0 font-[family-name:var(--font-mono)] text-xs text-accent-light cursor-pointer after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          詳細 +
        </button>
      </div>
    </div>
  )
}

// 詳細: 課題 → アプローチ → 結果 のケーススタディ
function ProjectDialog({ project }: { project: Project }) {
  const titleId = `work-${project.id}-title`
  return (
    <dialog id={`work-${project.id}`} className="lpm-modal work-modal" aria-labelledby={titleId}>
      <div className="lpm-modal__body flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-accent">
              {project.badges.map((b) => b.text).join(' · ')}
            </p>
            <h3 id={titleId} className="font-[family-name:var(--font-serif-jp)] text-2xl md:text-[28px] font-bold leading-snug mt-1.5">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            data-lpm-close
            aria-label="閉じる"
            className="shrink-0 w-11 h-11 flex items-center justify-center border border-white/15 text-text-primary hover:border-accent hover:text-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {project.sections.map((sec) => (
          <div key={sec.label}>
            <p className="font-[family-name:var(--font-mono)] text-accent text-xs tracking-wider mb-1.5">{sec.label}</p>
            <p className="text-text-secondary leading-relaxed">{sec.body}</p>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-[family-name:var(--font-mono)] text-xs text-text-muted border border-white/[0.08] px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {project.links.map((link) => (
              <ExternalOrAnchorLink key={link.href} link={link} closeOnClick />
            ))}
          </div>
        )}
      </div>
    </dialog>
  )
}

export default function Works() {
  return (
    <section id="works" className="py-20 md:py-32" aria-label="プロジェクト">
      <div className="max-w-[1120px] mx-auto px-5 md:px-10">
        <SectionHeading
          number="02"
          label="WORKS"
          title="プロジェクト"
          lead="カードを選ぶと、課題 → アプローチ → 結果の詳細が開きます。"
        />

        {groups.map((group) => (
          <div key={group.label} className="mb-14 last:mb-0">
            <h3
              className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mb-5"
              data-lpm-reveal="fade"
            >
              {group.label}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-lpm-stagger="80">
              {group.items.map((project) => (
                <li key={project.id} data-project={project.title}>
                  <ProjectCard project={project} />
                  <ProjectDialog project={project} />
                </li>
              ))}
            </ul>

            {/* SQL最適化 Before/After デモ（実務ケーススタディの実証） */}
            {group.items === workCaseStudies && (
              <div id="sql-demo" className="scroll-mt-24 mt-8" data-lpm-reveal="up">
                <SqlOptimizationDemo />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
