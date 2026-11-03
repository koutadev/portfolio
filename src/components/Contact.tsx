
export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-40" aria-label="お問い合わせ">
      <div className="max-w-[1120px] mx-auto px-5 md:px-10 text-center">
        <div
          data-lpm-reveal="up"
        >
          <p className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-[0.12em] mb-5">
            05 — CONTACT
          </p>
          <h2 className="font-[family-name:var(--font-serif-jp)] text-[30px] md:text-[44px] font-bold mb-6">
            お問い合わせ
          </h2>
          <p className="text-text-secondary mb-10 max-w-md mx-auto">
            お仕事のご相談・ご質問など、お気軽にご連絡ください。
          </p>
        </div>

        <div
          data-lpm-reveal="up" className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="mailto:your-email@example.com"
            className="inline-flex items-center justify-center min-h-13 px-12 bg-accent text-bg text-[13px] font-[family-name:var(--font-mono)] uppercase tracking-[0.16em] hover:bg-accent-light transition-all duration-300"
          >
            Mail
          </a>
          <a
            href="https://github.com/koutadev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-13 px-12 border border-text-primary/30 text-text-primary text-[13px] font-[family-name:var(--font-mono)] uppercase tracking-[0.16em] hover:border-accent hover:text-accent transition-all duration-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
