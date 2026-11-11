import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { siteConfig } from '../config/site.js'
import { addSale } from '../lib/store.js'

const COUNTRIES = [
  'Madagascar',
  'France',
  'La Réunion',
  'Mayotte',
  'Maurice',
  'Comores',
  'Afrique du Sud',
  'Belgique',
  'Suisse',
  'Canada',
  'États-Unis',
  'Royaume-Uni',
  'Allemagne',
  'Italie',
  'Espagne',
  'Pays-Bas',
  'Portugal',
  'Émirats arabes unis',
  'Chine',
  'Inde',
  'Australie',
  'Autre',
]

export default function Contact() {
  const { t } = useLang()
  const c = t.contact
  const [status, setStatus] = useState(null)

  const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    'Bonjour Haingo Couture, '
  )}`

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    const name = (data.get('name') || '').toString().trim()
    const email = (data.get('email') || '').toString().trim()
    const phone = (data.get('phone') || '').toString().trim()
    const message = (data.get('message') || '').toString().trim()

    if (!name || !email || !message) {
      setStatus('error')
      return
    }

    const subject = (data.get('subject') || 'Contact').toString()

    setStatus('sending')

    try {
      const res = await fetch(siteConfig.contactFormEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[${siteConfig.name}] ${subject}`,
          _template: 'table',
          Nom: name,
          Email: email,
          Téléphone: phone || '-',
          Sujet: subject,
          Message: message,
        }),
      })

      if (!res.ok) throw new Error('send failed')

      addSale({
        nom: name,
        contact: phone ? `${email} · ${phone}` : email,
        pays: '',
        creation: subject,
        message,
        prix: 0,
      })

      setStatus('success')
      form.reset()
    } catch {
      setStatus('failed')
    }
  }

  const address = `${siteConfig.address.line1}, ${siteConfig.address.line2}, ${siteConfig.address.country}`

  const dest = `${siteConfig.location.lat},${siteConfig.location.lng}`
  const dirUrl = (origin) => {
    const base = `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`
    return origin ? `${base}&origin=${origin}` : base
  }

  const openDirections = () => {
    if (!navigator.geolocation) {
      window.open(dirUrl(), '_blank', 'noopener')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => window.open(dirUrl(`${pos.coords.latitude},${pos.coords.longitude}`), '_blank', 'noopener'),
      () => window.open(dirUrl(), '_blank', 'noopener'),
      { timeout: 8000, enableHighAccuracy: false }
    )
  }

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <header className="section__head">
          <span className="eyebrow">{c.label}</span>
          <h2 className="section__title">{c.title}</h2>
          <p className="section__sub">{c.intro}</p>
        </header>

        <div className="contact__grid">
          <div className="contact__info">
            <a className="info-card" href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>
              <span className="info-card__label">{c.phone}</span>
              <strong>{siteConfig.phone}</strong>
            </a>

            <a className="info-card" href={waHref} target="_blank" rel="noreferrer">
              <span className="info-card__label">{c.whatsapp}</span>
              <strong>{siteConfig.phone}</strong>
            </a>

            <a className="info-card" href={`mailto:${siteConfig.email}`}>
              <span className="info-card__label">{c.email}</span>
              <strong>{siteConfig.email}</strong>
            </a>

            <div className="info-card">
              <span className="info-card__label">{c.address}</span>
              <strong>{address}</strong>
            </div>

            <div className="info-card">
              <span className="info-card__label">{c.hours}</span>
              <ul className="info-card__hours">
                {siteConfig.hours.map((h) => (
                  <li key={h.days}>
                    <span>{h.days}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a className="btn btn--gold btn--block" href={waHref} target="_blank" rel="noreferrer">
              {c.writeUs}
            </a>
          </div>

          <form className="contact__form" onSubmit={onSubmit} noValidate>
            <h3>{c.form.title}</h3>

            <div className="field-row">
            <label className="field">
              <span>{c.form.name} *</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label className="field">
              <span>{c.form.email} *</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
          </div>

          <label className="field">
            <span>{c.form.phone}</span>
            <input type="tel" name="phone" autoComplete="tel" />
          </label>

            <label className="field">
              <span>{c.form.subject}</span>
              <select name="subject" defaultValue={c.form.subjects[0]}>
                {c.form.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{c.form.message} *</span>
              <textarea name="message" rows="6" placeholder={c.form.placeholder} required />
            </label>

            <button className="btn btn--gold" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? c.form.sending : c.form.send}
            </button>

            {status === 'success' && <p className="form-msg form-msg--ok">{c.form.success}</p>}
            {status === 'error' && <p className="form-msg form-msg--err">{c.form.error}</p>}
            {status === 'failed' && <p className="form-msg form-msg--err">{c.form.failed}</p>}
          </form>
        </div>

        <div className="map-block">
          <div className="map-block__head">
            <span className="eyebrow">{c.map.label}</span>
          </div>

          <div className="map-block__frame">
            <iframe
              src={siteConfig.location.embed}
              title={`${siteConfig.name} — ${c.map.label}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="map-block__actions">
            <button className="btn btn--gold" type="button" onClick={openDirections}>
              {c.map.directions}
            </button>
            <a
              className="btn btn--ghost"
              href={siteConfig.location.link}
              target="_blank"
              rel="noreferrer"
            >
              {c.map.open}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
