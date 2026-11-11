import { useLang } from '../i18n/LanguageContext.jsx'

// Image de la section Hero : remplacez ce chemin par votre propre photo
// de vetements ou de robes (ex: '/creations/robe-mariage.jpeg').
const HERO_IMG = '/creations/received_1410569247671982.jpeg'

export default function Hero() {
  const { t } = useLang()

  return (
    <section className="hero" id="accueil">
      <div className="hero__bg" style={{ backgroundImage: `url(${HERO_IMG})` }} />
      <div className="hero__veil" />
      <div className="hero__content">
        <span className="hero__label">{t.hero.label}</span>
        <h1 className="hero__title">
          <span className="hero__brand">Haingo Couture</span>
          <em>{t.hero.title}</em>
        </h1>
        <p className="hero__sub">{t.hero.sub}</p>
        <div className="hero__actions">
          <a className="btn btn--gold" href="#creations">
            {t.hero.cta1}
          </a>
          <a className="btn btn--ghost" href="#contact">
            {t.hero.cta2}
          </a>
        </div>
      </div>
      <a className="hero__scroll" href="#atelier" aria-label={t.hero.scroll}>
        <span>{t.hero.scroll}</span>
        <i />
      </a>
      <div className="hero__frame" aria-hidden="true" />
    </section>
  )
}
