import { useState, useEffect, useCallback } from 'react'
import HeroScene from './scenes/HeroScene'
import {
  Manifesto, Numbers, GuaranteesStrip, Services, Marquee,
  Process, CasesSection, Pricing, FAQ, Contact, Footer
} from './components/Sections'
import './App.css'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = useCallback(() => setLoaded(true), [])
  
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <div className={`loader ${loaded ? 'done' : ''}`}>LOADING...</div>

      <section className="hero-section">
        <div className="hero-canvas-wrap">
          <HeroScene onLoaded={handleLoaded} />
        </div>
        <div className="hero-grain" />
        <div className="hero-vignette" />

        <header className="overlay-header">
          <div className="logo">
            <span className="logo-dot" />
            <span className="logo-text">ZARINA GALYMZHANOVA</span>
          </div>
          <nav className="nav">
            <a href="#services">УСЛУГИ</a>
            <a href="#process">ПРОЦЕСС</a>
            <a href="#cases">КЕЙСЫ</a>
            <a href="#pricing">ФОРМАТЫ</a>
            <a href="#contact">КОНТАКТЫ</a>
          </nav>
          <a href="#contact" className="nav-cta">ОСТАВИТЬ ЗАЯВКУ</a>
        </header>

        <div className="hero-content-inner">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            ZARINA GALYMZHANOVA — DESIGN & PRODUCTION EXPERT
          </p>
          <h1 className="hero-title">
            <span>Создаю бренды,</span>
            <span>которые <em>продают</em></span>
            <span>без слов.</span>
          </h1>
          <p className="hero-lede">
            Дизайн фирменного стиля, сайты и лендинги, автоматизация бизнес-задач, продюсирование и обучение экспертов. Полный цикл упаковки для high-ticket продаж.
          </p>
          <a href="#contact" className="hero-cta group-hover">
            Обсудить проект
            <span className="arrow-slide">→</span>
          </a>
        </div>

        <div className="hero-stats-inner">
          <div className="stat"><span className="stat-value">50+</span><span className="stat-label">ПРОЕКТОВ</span></div>
          <div className="stat"><span className="stat-value">5 ЛЕТ</span><span className="stat-label">ОПЫТА</span></div>
          <div className="stat"><span className="stat-value">95%</span><span className="stat-label">ДОВОЛЬНЫ</span></div>
        </div>

        <div className="scroll-cue">
          <div className="scroll-cue-bar" />
          SCROLL
        </div>
      </section>

      <main className="content-sections">
        <Manifesto />
        <Numbers />
        <GuaranteesStrip />
        <Services />
        <Marquee />
        <Process />
        <CasesSection />
        <Pricing />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
