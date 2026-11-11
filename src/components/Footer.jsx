import { useLang } from '../i18n/LanguageContext.jsx'
import { siteConfig } from '../config/site.js'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  const year = new Date().getFullYear()

  const links = [
    { href: '#accueil', label: t.nav.home },
    { href: '#creations', label: t.nav.creations },
    { href: '#atelier', label: t.nav.atelier },
    { href: '#services', label: t.nav.services },
    { href: '#contact', label: t.nav.contact },
  ]

  const address = `${siteConfig.address.line1}, ${siteConfig.address.line2}, ${siteConfig.address.country}`

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src={siteConfig.logo} alt={siteConfig.name} />
          <p>{f.tagline}</p>
          <div className="footer__social">
            {siteConfig.facebook && (
              <a href={siteConfig.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.6v8h3.6z" />
                </svg>
              </a>
            )}
            {siteConfig.instagram && (
              <a href={siteConfig.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12 7.4A4.6 4.6 0 1 0 16.6 12 4.6 4.6 0 0 0 12 7.4zm0 7.6A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm5.9-7.8a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1zM21 8.2a5.3 5.3 0 0 0-1.5-3.7A5.3 5.3 0 0 0 15.8 3C14.4 2.9 9.6 2.9 8.2 3a5.3 5.3 0 0 0-3.7 1.5A5.3 5.3 0 0 0 3 8.2c-.1 1.4-.1 6.2 0 7.6a5.3 5.3 0 0 0 1.5 3.7A5.3 5.3 0 0 0 8.2 21c1.4.1 6.2.1 7.6 0a5.3 5.3 0 0 0 3.7-1.5 5.3 5.3 0 0 0 1.5-3.7c.1-1.4.1-6.2 0-7.6zm-1.9 9.1a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.4.4s-4.2.1-5.4-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.4s-.1-4.2.4-5.4a3 3 0 0 1 1.7-1.7c1.2-.5 4-.4 5.4-.4s4.2-.1 5.4.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.4s.1 4.2-.4 5.4z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <nav className="footer__col">
          <h4>{f.quick}</h4>
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="footer__col">
          <h4>{f.contact}</h4>
          <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{siteConfig.phone}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <span>{address}</span>
        </div>

        <div className="footer__col">
          <h4>{f.hours}</h4>
          {siteConfig.hours.map((h) => (
            <span key={h.days}>
              {h.days} · {h.time}
            </span>
          ))}
        </div>
      </div>

      <div className="footer__bar">
        <div className="container">
          <span>
            © {year} {siteConfig.name}. {f.rights}
          </span>
          <span>{f.made}</span>
        </div>
      </div>
    </footer>
  )
}
