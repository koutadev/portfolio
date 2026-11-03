type Props = {
  number: string
  label: string
  title: string
  lead?: string
}

// セクション見出し: 左に日本語タイトル、右に番号ラベル、下に金のヘアライン（スクロールで線が伸びる）
export default function SectionHeading({ number, label, title, lead }: Props) {
  return (
    <div className="mb-10 md:mb-12" data-lpm-reveal="up">
      <div className="section-rule flex flex-wrap items-baseline justify-between gap-3 pb-5">
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
