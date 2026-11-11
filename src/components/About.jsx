import { useLang } from '../i18n/LanguageContext.jsx'

export default function About() {
  const { t } = useLang()
  const a = t.about

  return (
    <section className="section about" id="atelier">
      <div className="container about__grid">
        <div className="about__media">
          <div className="about__img about__img--main">
            <img
              src="/creations/received_1603866854566290.jpeg"
              alt="Création Haingo Couture"
              loading="lazy"
            />
          </div>
          <div className="about__img about__img--accent">
            <img
              src="/creations/received_1706040571307067.jpeg"
              alt="Création sur mesure"
              loading="lazy"
            />
          </div>
          <span className="about__stamp">{a.signature}</span>
        </div>

        <div className="about__body">
          <span className="eyebrow">{a.label}</span>
          <h2 className="section__title">{a.title}</h2>
          <p className="about__text">{a.p1}</p>
          <p className="about__text">{a.p2}</p>
          <ul className="about__points">
            {a.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="about__tagline">— {a.tagline}</p>
        </div>
      </div>
    </section>
  )
}
