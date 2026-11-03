type Props = {
  number: string
  label: string
  title: string
  lead?: string
  isVisible: boolean
}

// セクション見出し: 左に日本語タイトル、右に番号ラベル、下に金のヘアライン
export default function SectionHeading({ number, label, title, lead, isVisible }: Props) {
  return (
    <div
      className="fade-up mb-10 md:mb-12"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-accent/25 pb-5">
        <h2 className="font-[family-name:var(--font-serif-jp)] text-[28px] md:text-4xl font-bold">
          {title}
        </h2>
        <p className="font-[family-name:var(--font-mono)] text-accent text-xs md:text-sm tracking-[0.12em]">
          {number} — {label}
        </p>
      </div>
      {lead && <p className="text-text-secondary text-[15px] mt-5">{lead}</p>}
    </div>
  )
}
