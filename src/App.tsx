import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Works from './components/Works'
import Designs from './components/Designs'
import Skills from './components/Skills'
import Career from './components/Career'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="grain">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Works />
        <Designs />
        <Skills />
        <Career />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
