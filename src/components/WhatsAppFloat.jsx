import { useLang } from '../i18n/LanguageContext.jsx'
import { siteConfig } from '../config/site.js'

export default function WhatsAppFloat() {
  const { t } = useLang()

  return (
    <a
      className="wa-float"
      href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
        'Bonjour Haingo Couture, '
      )}`}
      target="_blank"
      rel="noreferrer"
      aria-label={t.wa}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5.3-.5a.6.6 0 0 0 0-.6l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.4 3.9 12 12 0 0 0 1.5.5 3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z" />
      </svg>
      <span>{t.wa}</span>
    </a>
  )
}
