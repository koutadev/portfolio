export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8">
      <div className="max-w-[1000px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <a
          href="#"
          className="font-[family-name:var(--font-serif-jp)] text-accent text-lg font-bold tracking-wider"
        >
          KOUTA
        </a>
        <p className="font-[family-name:var(--font-mono)] text-text-faint text-xs">
          &copy; 2026 Kouta. Built with passion — from sushi to code.
        </p>
      </div>
    </footer>
  )
}
