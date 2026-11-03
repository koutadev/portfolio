import { useInView } from '../hooks/useInView'
import SectionHeading from './SectionHeading'

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
    skills: ['Claude Code', 'ChatGPT', 'AI活用（開発補助）'],
  },
]

export default function Skills() {
  const { ref, isVisible } = useInView()

  return (
    <section id="skills" className="py-20 md:py-32" ref={ref} aria-label="技術スタック">
      <div className="max-w-[1120px] mx-auto px-5 md:px-10">
        <SectionHeading number="04" label="SKILLS" title="技術スタック" isVisible={isVisible} />

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, i) => (
            <div
              key={category.title}
              className="fade-up border border-white/[0.06] p-6 md:p-8"
              style={{
                transitionDelay: `${(i + 1) * 0.1}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              }}
            >
              <h3 className="font-[family-name:var(--font-mono)] text-accent text-sm tracking-wider mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-[family-name:var(--font-mono)] text-accent text-sm px-3.5 py-1.5 bg-accent/[0.08] border border-accent/20 hover:bg-accent/20 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
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
