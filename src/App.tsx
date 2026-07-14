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
            <span className="logo-text">AMAI</span>
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
            AESTHETIC MIND AI — SMM & PRODUCT AGENCY
          </p>
          <h1 className="hero-title">
            <span>Создаём бренды</span>
            <span>в <em>латентном</em> пространстве —</span>
            <span>выводим их в продажи.</span>
          </h1>
          <p className="hero-lede">
            Сайты, приложения, автоматизация, SMM и продюсирование — единая система, которая работает 24/7.
          </p>
          <a href="#contact" className="hero-cta group-hover">
            Оставить заявку
            <span className="arrow-slide">→</span>
          </a>
        </div>

        <div className="hero-stats-inner">
          <div className="stat"><span className="stat-value">47+</span><span className="stat-label">ПРОЕКТОВ</span></div>
          <div className="stat"><span className="stat-value">12</span><span className="stat-label">ЭКСПЕРТОВ</span></div>
          <div className="stat"><span className="stat-value">98%</span><span className="stat-label">ДОВОЛЬНЫ</span></div>
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
