import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Achievements from './components/Achievements'
import Skills from './components/Skills'
import Works from './components/Works'
import Career from './components/Career'
import Contact from './components/Contact'
import Footer from './components/Footer'

function SectionDivider() {
  return (
    <div className="max-w-[1000px] mx-auto px-5 md:px-10">
      <div
        className="h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(196, 132, 29, 0.15), transparent)',
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <div className="grain">
      <Navigation />
      <Hero />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Achievements />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Works />
      <SectionDivider />
      <Career />
      <SectionDivider />
      <Contact />
      <Footer />
    </div>
  )
}
