import { useState, useMemo, useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { creations, categoryOrder } from '../data/creations.js'

export default function Gallery() {
  const { t, lang } = useLang()
  const [filter, setFilter] = useState('tous')
  const [index, setIndex] = useState(null)

  const list = useMemo(
    () => (filter === 'tous' ? creations : creations.filter((c) => c.category === filter)),
    [filter]
  )

  useEffect(() => {
    if (index === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % list.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + list.length) % list.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, list.length])

  const current = index !== null ? list[index] : null

  return (
    <section className="section gallery" id="creations">
      <div className="container">
        <header className="section__head">
          <span className="eyebrow">{t.gallery.label}</span>
          <h2 className="section__title">{t.gallery.title}</h2>
          <p className="section__sub">{t.gallery.subtitle}</p>
        </header>

        <div className="filters">
          {categoryOrder.map((c) => (
            <button
              key={c}
              className={`filters__btn ${filter === c ? 'is-active' : ''}`}
              onClick={() => {
                setFilter(c)
                setIndex(null)
              }}
            >
              {t.gallery.filters[c]}
            </button>
          ))}
          <span className="filters__count">{t.gallery.count(list.length)}</span>
        </div>

        <div className="grid">
          {list.map((item, i) => (
            <figure
              key={item.id}
              className="card"
              onClick={() => setIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIndex(i)}
            >
              <img src={item.src} alt={item[lang] || item.fr} loading="lazy" />
              <figcaption>
                <span className="card__cat">{t.gallery.filters[item.category]}</span>
                <span className="card__title">{item[lang] || item.fr}</span>
              </figcaption>
              <span className="card__zoom" aria-hidden="true">
                +
              </span>
            </figure>
          ))}
          {list.length === 0 && <p className="gallery__empty">{t.gallery.empty}</p>}
        </div>
      </div>

      {current && (
        <div className="lightbox" onClick={() => setIndex(null)}>
          <button
            className="lightbox__close"
            onClick={() => setIndex(null)}
            aria-label={t.gallery.close}
          >
            ×
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              setIndex((i) => (i - 1 + list.length) % list.length)
            }}
            aria-label={t.gallery.prev}
          >
            ‹
          </button>
          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current[lang] || current.fr} />
            <figcaption>
              <span className="card__cat">{t.gallery.filters[current.category]}</span>
              <strong>{current[lang] || current.fr}</strong>
              <em>
                {index + 1} / {list.length}
              </em>
            </figcaption>
          </figure>
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation()
              setIndex((i) => (i + 1) % list.length)
            }}
            aria-label={t.gallery.next}
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}
