const BASE = import.meta.env.VITE_API_BASE || ''

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  return res
}

export async function checkAuth() {
  try {
    const res = await request('/api/me')
    if (res.ok) {
      const data = await res.json()
      return data.authenticated === true
    }
    return false
  } catch {
    return false
  }
}

export async function login(identifiant, motDePasse) {
  const res = await request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ identifiant, motDePasse }),
  })
  const data = (await res.json().catch(() => ({}))) || {}
  if (!res.ok) throw new Error(data.error || 'Identifiant ou mot de passe incorrect')
  return data
}

export async function logout() {
  await request('/api/logout', { method: 'POST' })
}
