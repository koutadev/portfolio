import { useInView } from '../hooks/useInView'

const skillCategories = [
  {
    title: 'Backend',
    skills: ['PHP', 'Laravel', 'PostgreSQL', 'SQL最適化'],
  },
  {
    title: 'Frontend',
    skills: ['JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Chart.js'],
  },
  {
    title: 'DevOps',
    skills: ['Docker', 'Git', 'GitHub Actions', 'Linux'],
  },
  {
    title: 'AI Tools',
    skills: ['Claude Code', 'ChatGPT', 'AI駆動開発'],
  },
]

export default function Skills() {
  const { ref, isVisible } = useInView()

  return (
    <section id="skills" className="py-20 md:py-[160px]" ref={ref}>
      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        <div
          className="fade-up"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <p className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-widest mb-4">
            02 — SKILLS
          </p>
          <h2 className="font-[family-name:var(--font-serif-jp)] text-[28px] md:text-4xl font-bold mb-12">
            技術スタック
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, i) => (
            <div
              key={category.title}
              className="fade-up border border-white/[0.06] rounded-lg p-6"
              style={{
                transitionDelay: `${(i + 1) * 0.1}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              }}
            >
              <h3 className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-wider mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-4">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-[family-name:var(--font-mono)] text-accent text-sm rounded-sm hover:bg-accent/20 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                    style={{
                      padding: '6px 16px',
                      background: 'rgba(196, 132, 29, 0.08)',
                      border: '1px solid rgba(196, 132, 29, 0.2)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
