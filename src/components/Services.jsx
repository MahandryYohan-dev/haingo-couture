import { useLang } from '../i18n/LanguageContext.jsx'

export default function Services() {
  const { t } = useLang()
  const s = t.services

  return (
    <section className="section services" id="services">
      <div className="container">
        <header className="section__head">
          <span className="eyebrow">{s.label}</span>
          <h2 className="section__title">{s.title}</h2>
          <p className="section__sub">{s.subtitle}</p>
        </header>

        <div className="services__grid">
          {s.items.map((item, i) => (
            <article className="service" key={item.title}>
              <span className="service__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
