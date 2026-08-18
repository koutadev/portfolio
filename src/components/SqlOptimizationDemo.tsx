import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { sqlDemo, type Plan } from '../data/sqlDemo'

type Status = 'idle' | 'running' | 'done'
type Key = 'before' | 'after'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION_QUERY)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  )
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export default function SqlOptimizationDemo() {
  const reduced = usePrefersReducedMotion()
  const [status, setStatus] = useState<Record<Key, Status>>({ before: 'idle', after: 'idle' })
  const [progress, setProgress] = useState<Record<Key, number>>({ before: 0, after: 0 })
  const [shownMs, setShownMs] = useState<Record<Key, number>>({ before: 0, after: 0 })
  const rafIds = useRef<Record<Key, number>>({ before: 0, after: 0 })

  useEffect(() => {
    const ids = rafIds.current
    return () => {
      cancelAnimationFrame(ids.before)
      cancelAnimationFrame(ids.after)
    }
  }, [])

  const run = (key: Key) => {
    if (status[key] === 'running') return
    const plan = sqlDemo[key]

    if (reduced) {
      setProgress((p) => ({ ...p, [key]: 100 }))
      setShownMs((m) => ({ ...m, [key]: plan.executionMs }))
      setStatus((s) => ({ ...s, [key]: 'done' }))
      return
    }

    setStatus((s) => ({ ...s, [key]: 'running' }))
    setProgress((p) => ({ ...p, [key]: 0 }))
    setShownMs((m) => ({ ...m, [key]: 0 }))

    // 演出上の実行時間。Before を遅く、After を速く見せて体感差を伝える
    const duration = key === 'before' ? 1300 : 520
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = easeOutCubic(t)
      setProgress((p) => ({ ...p, [key]: eased * 100 }))
      setShownMs((m) => ({ ...m, [key]: Math.round(eased * plan.executionMs) }))
      if (t < 1) {
        rafIds.current[key] = requestAnimationFrame(tick)
      } else {
        setShownMs((m) => ({ ...m, [key]: plan.executionMs }))
        setStatus((s) => ({ ...s, [key]: 'done' }))
      }
    }
    rafIds.current[key] = requestAnimationFrame(tick)
  }

  const bothDone = status.before === 'done' && status.after === 'done'
  const speedup = useMemo(
    () => sqlDemo.before.executionMs / sqlDemo.after.executionMs,
    []
  )
  const [speedShown, setSpeedShown] = useState(0)
  useEffect(() => {
    if (reduced || !bothDone) return
    const duration = 900
    let start: number | null = null
    let id = requestAnimationFrame(function tick(now: number) {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / duration)
      setSpeedShown(easeOutCubic(t) * speedup)
      if (t < 1) id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [bothDone, reduced, speedup])
  const displaySpeed = reduced ? speedup : speedShown

  return (
    <div className="border border-white/[0.06] rounded-lg p-6 md:p-8 bg-white/[0.02]">
      <div className="flex items-center flex-wrap gap-3 mb-3">
        <span className="font-[family-name:var(--font-mono)] text-xs text-accent bg-accent/10 px-2 py-1 rounded">
          Interactive
        </span>
        <h4 className="font-[family-name:var(--font-serif-jp)] text-lg md:text-xl font-bold">
          Before / After を実行してみる
        </h4>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed mb-2">
        インデックスの有無で同じ集計クエリの実行計画がどう変わるかを、実測値で再生します。
      </p>
      <p className="text-text-faint text-xs leading-relaxed mb-6">
        {sqlDemo.dataset}
        <br />
        {sqlDemo.environment}
      </p>

      {/* Before / After 実行カード */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {(['before', 'after'] as Key[]).map((key) => (
          <PlanRunner
            key={key}
            plan={sqlDemo[key]}
            accent={key === 'after'}
            status={status[key]}
            progress={progress[key]}
            shownMs={shownMs[key]}
            onRun={() => run(key)}
          />
        ))}
      </div>

      {/* 高速化バナー */}
      <div
        className={`rounded-lg border px-6 py-5 mb-6 text-center transition-all duration-500 ${
          bothDone
            ? 'border-accent/40 bg-accent/[0.06]'
            : 'border-white/[0.06] bg-white/[0.01]'
        }`}
      >
        {bothDone ? (
          <p className="font-[family-name:var(--font-serif-jp)]">
            <span className="text-accent text-4xl md:text-5xl font-bold">
              {displaySpeed.toFixed(1)}
              <span className="text-2xl md:text-3xl">×</span>
            </span>
            <span className="text-text-secondary text-sm ml-3">高速化（実測比）</span>
          </p>
        ) : (
          <p className="font-[family-name:var(--font-mono)] text-text-faint text-sm">
            Before と After を実行すると、高速化の倍率が表示されます
          </p>
        )}
      </div>

      {/* クエリ */}
      <p className="font-[family-name:var(--font-mono)] text-accent text-xs tracking-wider mb-2">
        対象クエリ（1店舗の月別売上・前年同月比）
      </p>
      <pre className="font-[family-name:var(--font-mono)] text-xs text-text-secondary bg-black/30 border border-white/[0.06] rounded p-4 overflow-x-auto mb-3 leading-relaxed">
        {sqlDemo.query}
      </pre>
      <p className="font-[family-name:var(--font-mono)] text-accent text-xs tracking-wider mb-2">
        追加インデックス（複合＋カバリング）
      </p>
      <pre className="font-[family-name:var(--font-mono)] text-xs text-text-secondary bg-black/30 border border-white/[0.06] rounded p-4 overflow-x-auto mb-6 leading-relaxed">
        {sqlDemo.indexSql}
      </pre>

      {/* EXPLAIN 比較 */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <ExplainBlock plan={sqlDemo.before} accent={false} />
        <ExplainBlock plan={sqlDemo.after} accent={true} />
      </div>

      {/* 本番実績の注記 + 再現リンク */}
      <p className="text-text-faint text-xs leading-relaxed mb-3">{sqlDemo.productionNote}</p>
      <a
        href={sqlDemo.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-[family-name:var(--font-mono)] text-sm text-accent hover:text-accent-light transition-colors duration-200"
      >
        {'手元で再現できます（schema / seed / queries）→'}
      </a>
    </div>
  )
}

type RunnerProps = {
  plan: Plan
  accent: boolean
  status: Status
  progress: number
  shownMs: number
  onRun: () => void
}

function PlanRunner({ plan, accent, status, progress, shownMs, onRun }: RunnerProps) {
  const done = status === 'done'
  const running = status === 'running'
  return (
    <div className="border border-white/[0.06] rounded-lg p-5 flex flex-col">
      <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mb-3">
        {plan.label}
      </p>

      <button
        onClick={onRun}
        disabled={running}
        className="self-start font-[family-name:var(--font-mono)] text-sm text-accent border border-accent/60 rounded px-4 py-2 mb-4 hover:bg-accent hover:text-bg transition-all duration-200 disabled:opacity-50"
      >
        {running ? '実行中…' : done ? '▶ 再実行' : '▶ 実行'}
      </button>

      {/* プログレスバー */}
      <div className="h-1 w-full bg-white/[0.06] rounded overflow-hidden mb-4">
        <div
          className={`h-full ${accent ? 'bg-accent' : 'bg-text-muted'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 実測値 */}
      <div className={`transition-opacity duration-300 ${done || running ? 'opacity-100' : 'opacity-40'}`}>
        <p className="font-[family-name:var(--font-serif-jp)] font-bold mb-2">
          <span className={`text-3xl ${accent ? 'text-accent' : 'text-text-primary'}`}>
            {shownMs}
          </span>
          <span className="text-text-secondary text-sm ml-1">ms</span>
        </p>
        <dl className="text-xs space-y-1">
          <div className="flex justify-between gap-2">
            <dt className="text-text-faint">スキャン方式</dt>
            <dd
              className={`font-[family-name:var(--font-mono)] ${
                accent ? 'text-accent' : 'text-text-secondary'
              }`}
            >
              {plan.scanMethod}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-text-faint">読み取り行数</dt>
            <dd className="font-[family-name:var(--font-mono)] text-text-secondary">
              {plan.rowsScanned.toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function ExplainBlock({ plan, accent }: { plan: Plan; accent: boolean }) {
  return (
    <div>
      <p
        className={`font-[family-name:var(--font-mono)] text-xs tracking-wider mb-2 ${
          accent ? 'text-accent' : 'text-text-muted'
        }`}
      >
        {plan.scanMethod}
      </p>
      <pre
        className={`font-[family-name:var(--font-mono)] text-[11px] leading-relaxed rounded p-4 overflow-x-auto h-full bg-black/30 border ${
          accent ? 'border-accent/30 text-text-secondary' : 'border-white/[0.06] text-text-secondary'
        }`}
      >
        {plan.explain}
      </pre>
    </div>
  )
}
