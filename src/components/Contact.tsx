import { useInView } from '../hooks/useInView'

export default function Contact() {
  const { ref, isVisible } = useInView()

  return (
    <section id="contact" className="py-20 md:py-[160px]" ref={ref}>
      <div className="max-w-[1000px] mx-auto px-5 md:px-10 text-center">
        <div
          className="fade-up"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <p className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mb-4">
            05 — CONTACT
          </p>
          <h2 className="font-[family-name:var(--font-serif-jp)] text-[28px] md:text-4xl font-bold mb-6">
            お問い合わせ
          </h2>
          <p className="text-text-secondary mb-10 max-w-md mx-auto">
            お仕事のご相談・ご質問など、お気軽にご連絡ください。
          </p>
        </div>

        <div
          className="fade-up flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            transitionDelay: '0.1s',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <a
            href="mailto:your-email@example.com"
            className="inline-block border border-accent text-accent text-sm font-[family-name:var(--font-mono)] uppercase tracking-[3px] hover:bg-accent hover:text-bg transition-all duration-300 text-center"
            style={{ padding: '16px 48px' }}
          >
            Mail
          </a>
          <a
            href="https://github.com/kt040403"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-accent text-accent text-sm font-[family-name:var(--font-mono)] uppercase tracking-[3px] hover:bg-accent hover:text-bg transition-all duration-300 text-center"
            style={{ padding: '16px 48px' }}
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
