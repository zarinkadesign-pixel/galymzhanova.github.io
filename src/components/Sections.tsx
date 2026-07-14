import { useRef, useEffect, useState, type FC, type FormEvent } from 'react'
import { STATS, GUARANTEES, STEPS, CASES, TIERS, FAQS, MARQUEE_ITEMS, SERVICES } from '../data'

/* ─── useInView ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, vis }
}

/* ─── Counter ─── */
function AnimCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)
  const { ref: wrapRef, vis } = useInView()

  useEffect(() => {
    if (!vis || counted.current || !ref.current) return
    counted.current = true
    const start = performance.now()
    const dur = 2000
    function tick(now: number) {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      if (ref.current) ref.current.textContent = String(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [vis, target])

  return (
    <div ref={wrapRef} className={`num-card fade-in ${vis ? 'vis' : ''}`}>
      <div className="num-value num-glow"><em ref={ref}>0</em>{suffix}</div>
    </div>
  )
}

/* ─── Manifesto ─── */
export const Manifesto: FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null)
  const text = 'Мы не «ведём соцсети». Мы проектируем систему, в которой бренд думает, говорит и продаёт сам — двадцать четыре часа в сутки.'

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    el.innerHTML = ''
    for (const ch of text) {
      const span = document.createElement('span')
      span.className = 'char'
      span.textContent = ch === ' ' ? ' ' : ch
      el.appendChild(span)
    }
    const chars = el.querySelectorAll('.char')
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.8)))
      const lit = Math.floor(progress * chars.length)
      chars.forEach((c, i) => c.classList.toggle('lit', i < lit))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="manifesto" id="manifesto">
      <span className="section-num">01 / Манифест</span>
      <p className="manifesto-text" ref={textRef} />
    </section>
  )
}

/* ─── Numbers ─── */
export const Numbers: FC = () => (
  <section className="numbers" id="numbers">
    <div className="numbers-grid">
      {STATS.map((s, i) => (
        <div key={i} style={{ textAlign: 'center', padding: '32px 16px' }}>
          <AnimCounter target={s.value} suffix={s.suffix} />
          <div className="num-label">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
)

/* ─── Guarantees ─── */
export const GuaranteesStrip: FC = () => (
  <div className="guarantees fade-in vis">
    <div className="guarantees-row">
      {GUARANTEES.map((g, i) => (
        <div className="guarantee hover-lift" key={i}>
          <span className="g-icon glass glow-border">✓</span>
          <span>{g}</span>
        </div>
      ))}
    </div>
  </div>
)

/* ─── Services ─── */
export const Services: FC = () => (
  <section className="services-section" id="services">
    <span className="section-num">02 / Что мы делаем</span>
    <div className="services-grid">
      {SERVICES.map((s, i) => {
        const { ref, vis } = useInView()
        return (
          <div ref={ref} className={`service-card glass fade-in ${vis ? 'vis' : ''}`} key={i}>
            <div className="service-card-header">
              <span className="service-index">N° {s.index}</span>
              <span className="service-pill glass">{s.pill}</span>
            </div>
            <div className="service-glyph glyph-glow">{s.glyph}</div>
            <h3>{s.title} <em>{s.titleEm}</em></h3>
            <p className="lede">{s.lede}</p>
            <ul className="service-list">
              {s.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
            <div className="service-meta">
              <span>Сроки<strong>{s.time}</strong></span>
              <span>Стоимость<strong>{s.price}</strong></span>
            </div>
          </div>
        )
      })}
    </div>
  </section>
)

/* ─── Marquee ─── */
export const Marquee: FC = () => (
  <div className="stack" aria-hidden="true">
    <div className="stack-row">
      <div className="marquee">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  </div>
)

/* ─── Process ─── */
export const Process: FC = () => (
  <section className="process-wrap" id="process">
    <span className="section-num">03 / Процесс</span>
    <div className="process">
      <div className="head">
        <span className="eyebrow"><span className="sq" />Как мы работаем</span>
        <h2 className="display shimmer">Пять шагов <em>от первого созвона</em> до первой продажи</h2>
      </div>
      <div className="process-steps">
        {STEPS.map((step, i) => {
          const { ref, vis } = useInView()
          return (
            <div ref={ref} className={`step fade-in ${vis ? 'vis' : ''}`} key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
              <span className="n">{step.n}</span>
              <div><h4>{step.title}</h4><p>{step.desc}</p></div>
              <span className="duration">{step.duration}</span>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

/* ─── Cases ─── */
export const CasesSection: FC = () => (
  <section className="cases" id="cases">
    <span className="section-num">04 / Кейсы</span>
    <span className="eyebrow"><span className="sq" />Они уже выросли с нами</span>
    <h2 className="display shimmer">Кейсы <em>наших клиентов</em></h2>
    <div className="cases-grid">
      {CASES.map((c, i) => (
        <div className="case-container" key={i}>
          <article className={`case glass`} style={{ top: 80 + i * 28 }}>
            <div className={`case-art case-art-${i + 1}`} />
            <span className="tag glass">{c.tag}</span>
            <span className="metric">{c.metric}<small>{c.metricLabel}</small></span>
            <div className="case-content">
              <h3 className="shimmer">{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          </article>
        </div>
      ))}
    </div>
  </section>
)

/* ─── Pricing ─── */
export const Pricing: FC = () => (
  <section className="pricing" id="pricing">
    <span className="section-num">05 / Форматы</span>
    <span className="eyebrow"><span className="sq" />Как с нами работать</span>
    <h2 className="display shimmer">Три формата <em>сотрудничества</em></h2>
    <div className="pricing-grid">
      {TIERS.map((tier, i) => {
        const { ref, vis } = useInView()
        return (
          <div ref={ref} className={`tier ${tier.featured ? 'featured glass-strong' : 'glass'} fade-in hover-lift glow-border ${vis ? 'vis' : ''}`}
            key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="name">{tier.name}</div>
            <div className="price"><em>{tier.price}</em>{'priceSuffix' in tier ? tier.priceSuffix : ''}</div>
            <div className="price-meta">{tier.priceMeta}</div>
            <ul>{tier.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            <a className="tier-cta group-hover" href="#contact">{tier.cta} <span className="arrow-slide">→</span></a>
          </div>
        )
      })}
    </div>
  </section>
)

/* ─── FAQ ─── */
export const FAQ: FC = () => {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="faq" id="faq">
      <span className="section-num">06 / FAQ</span>
      <span className="eyebrow"><span className="sq" />Частые вопросы</span>
      <h2 className="display shimmer">Ответы на <em>главное</em></h2>
      <div className="faq-list">
        {FAQS.map((faq, i) => (
          <div className={`faq-item fade-in vis ${open === i ? 'open' : ''}`} key={i}>
            <div className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{faq.q}</span>
              <span className="faq-icon glass">
                <svg viewBox="0 0 14 14" fill="none">
                  <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="faq-a"><div className="faq-a-inner">{faq.a}</div></div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Contact ─── */
export const Contact: FC = () => {
  const [msg, setMsg] = useState('')
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setMsg('Заявка отправлена! Свяжемся в течение 24 часов.')
  }
  return (
    <section className="contact" id="contact">
      <span className="section-num">07 / Контакты</span>
      <div className="contact-inner">
        <div>
          <span className="eyebrow"><span className="sq" />Оставить заявку</span>
          <h2>Расскажите <em>о задаче —</em><br />пришлём разбор<br />за <em>24 часа</em>.</h2>
          <p className="lede">Без шаблонных КП. Сначала смотрим продукт, аудиторию и текущие воронки.</p>
          <div className="contact-channels">
            <div className="channel"><small>Telegram</small><a href="https://t.me/ZARINKA_DESIGN" target="_blank" rel="noopener">@ZARINKA_DESIGN</a></div>
            <div className="channel"><small>Бот компании</small><a href="https://t.me/ME_AMAI_BOT" target="_blank" rel="noopener">@ME_AMAI_BOT</a></div>
            <div className="channel"><small>Сайт</small><a href="https://amai.com.ru" target="_blank" rel="noopener">amai.com.ru</a></div>
          </div>
        </div>
        <form className="form glass-strong" onSubmit={handleSubmit}>
          <div className="field"><label>Как к вам обращаться</label><input name="name" type="text" required /></div>
          <div className="field"><label>Telegram или почта</label><input name="contact" type="text" required placeholder="@username или name@mail.ru" /></div>
          <div className="field">
            <label>Что нужно сделать</label>
            <div className="checkboxes">
              {['Сайт / Лендинг', 'Приложение', 'Автоматизация', 'SMM & продюс.', 'Запуск курса'].map((item, i) => (
                <div className="checkbox" key={i}>
                  <input type="checkbox" id={`c${i}`} name="need" value={item} />
                  <label htmlFor={`c${i}`} className="glass">{item}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="field"><label>Бюджет</label>
            <select name="budget">
              <option value="">— выберите —</option>
              <option value="lt100">до 100 000 ₽</option>
              <option value="100-300">100 000 – 300 000 ₽</option>
              <option value="300-700">300 000 – 700 000 ₽</option>
              <option value="gt700">от 700 000 ₽</option>
              <option value="dont-know">обсудим</option>
            </select>
          </div>
          <div className="field"><label>Несколько слов о задаче</label><textarea name="task" rows={3} placeholder="Контекст, площадки, дедлайн" /></div>
          <button type="submit" className="submit group-hover">
            <span>Отправить заявку</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <p className="form-foot">{msg || 'Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных.'}</p>
        </form>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
export const Footer: FC = () => (
  <footer>
    <div className="f-top">
      <div className="f-mark">AMA<em>I</em></div>
      <div className="f-col"><h5>Навигация</h5><ul><li><a href="#services">Услуги</a></li><li><a href="#process">Процесс</a></li><li><a href="#cases">Кейсы</a></li><li><a href="#pricing">Форматы</a></li></ul></div>
      <div className="f-col"><h5>Контакты</h5><ul><li><a href="https://t.me/ZARINKA_DESIGN" target="_blank" rel="noopener">@ZARINKA_DESIGN</a></li><li><a href="https://t.me/ME_AMAI_BOT" target="_blank" rel="noopener">@ME_AMAI_BOT</a></li><li><a href="https://amai.com.ru" target="_blank" rel="noopener">amai.com.ru</a></li></ul></div>
    </div>
    <div className="f-bottom">
      <span>© 2026 AMAI — Aesthetic Mind AI</span>
      <span>МЫ СОЗДАЁМ БУДУЩЕЕ</span>
    </div>
  </footer>
)
