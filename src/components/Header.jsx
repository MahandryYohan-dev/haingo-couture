import { useState, useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { siteConfig } from '../config/site.js'
import { useTheme } from '../lib/theme.js'
import { checkAuth } from '../lib/auth.js'

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'mg', label: 'MG' },
]

const THEME_ICONS = {
  dark: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  light: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
}

export default function Header() {
  const { t, lang, setLang } = useLang()
  const { mode: themeMode, cycle: cycleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hash, setHash] = useState(() => window.location.hash)
  const [isAuthed, setIsAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onHash = () => setHash(window.location.hash)
    onScroll()
    onHash()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const ok = await checkAuth()
      if (mounted) {
        setIsAuthed(ok)
        setChecking(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const links = [
    { href: '#accueil', label: t.nav.home },
    { href: '#creations', label: t.nav.creations },
    { href: '#atelier', label: t.nav.atelier },
    { href: '#services', label: t.nav.services },
    { href: '#contact', label: t.nav.contact },
  ]

  return (
    <header className={`header ${scrolled || open ? 'header--solid' : ''}`}>
      <div className="header__inner">
        <a href="#accueil" className="header__brand" onClick={() => setOpen(false)}>
          <div className="header__logo-wrap">
            <img src="/logo.png" alt="Logo Haingo Couture" className="header__icon" />
          </div>
          <span className="header__wordmark">
            <strong>Haingo Couture</strong>
            <em>{t.footer.tagline}</em>
          </span>
        </a>

        <nav className={`header__nav ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          {isAuthed && (
            <a
              className={`btn btn--ghost ${hash === '#admin' ? 'is-active' : ''}`}
              href="#admin"
              onClick={() => setOpen(false)}
              aria-label="Tableau de bord admin"
            >
              {t.nav.admin}
            </a>
          )}
          <a
            className="btn btn--gold"
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            aria-label="Demander un devis sur WhatsApp"
          >
            {t.cta.quote}
          </a>
        </nav>

        <div className="header__right">
          <div className="lang" role="group" aria-label={t.lang}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`lang__btn ${lang === l.code ? 'is-active' : ''}`}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            className="theme-toggle"
            onClick={cycleTheme}
            aria-label={`${t.theme.toggle} : ${t.theme[themeMode]}`}
            title={`${t.theme.toggle} : ${t.theme[themeMode]}`}
          >
            {THEME_ICONS[themeMode]}
          </button>
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
