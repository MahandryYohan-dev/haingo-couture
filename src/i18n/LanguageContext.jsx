import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('hc-lang') || 'fr'
    } catch {
      return 'fr'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('hc-lang', lang)
    } catch {}
    document.documentElement.lang = lang
  }, [lang])

  const t = translations[lang] || translations.fr

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
