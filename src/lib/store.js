const SALES_KEY = 'hc-sales'
const SESSION_KEY = 'hc-admin-session'

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const loadSales = () => read(SALES_KEY, [])

export const saveSales = (list) => {
  write(SALES_KEY, list)
  return list
}

export const addSale = (sale) => {
  const item = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    nom: '',
    contact: '',
    pays: '',
    creation: '',
    message: '',
    prix: 0,
    ...sale,
  }
  saveSales([item, ...loadSales()])
  return item
}

export const updateSale = (id, patch) =>
  saveSales(loadSales().map((s) => (s.id === id ? { ...s, ...patch } : s)))

export const removeSale = (id) => saveSales(loadSales().filter((s) => s.id !== id))

export const formatAr = (value) => `${new Intl.NumberFormat('fr-FR').format(Number(value) || 0)} Ar`

export const isAdminLogged = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export const setAdminLogged = (on) => {
  try {
    if (on) sessionStorage.setItem(SESSION_KEY, '1')
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {}
}
