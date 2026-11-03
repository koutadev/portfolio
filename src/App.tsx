import { useEffect } from 'react'
import { lpmCount, lpmModal, lpmReveal, lpmScrollSpy } from './vendor/lp-motion/lp-motion.mjs'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Works from './components/Works'
import Designs from './components/Designs'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  // lp-motion: 出現（M-10）・カウントアップ（M-11）・モーダル（M-17）・現在地メニュー（M-30）
  // 各関数は初期化済みの要素を飛ばすので、StrictMode の二重実行でも安全
  useEffect(() => {
    lpmReveal()
    lpmCount()
    lpmModal()
    lpmScrollSpy()
  }, [])

  return (
    <div className="grain">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Works />
        <Designs />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
