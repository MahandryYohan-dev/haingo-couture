import { useState, useEffect } from 'react'

const KEY = 'hc-theme'

export const THEME_MODES = ['dark', 'light', 'system']

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(KEY)
    return THEME_MODES.includes(v) ? v : 'system'
  } catch {
    return 'system'
  }
}

export function resolveTheme(mode) {
  if (mode !== 'system') return mode
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', resolveTheme(mode))
}

export function initTheme() {
  applyTheme(getStoredTheme())
}

export function useTheme() {
  const [mode, setMode] = useState(getStoredTheme)

  useEffect(() => {
    applyTheme(mode)
    try {
      localStorage.setItem(KEY, mode)
    } catch {
      /* stockage indisponible */
    }

    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mode])

  const cycle = () => {
    setMode((m) => THEME_MODES[(THEME_MODES.indexOf(m) + 1) % THEME_MODES.length])
  }

  return { mode, setMode, cycle }
}
