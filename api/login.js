import crypto from 'crypto'

export const config = { runtime: 'nodejs18.x' }

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.statusCode = 204
    res.end()
    return
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Methode non autorisee' })
    return
  }

  const ADMIN_USER = process.env.ADMIN_USER
  const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH
  const SESSION_SECRET = process.env.SESSION_SECRET

  if (!ADMIN_USER || !ADMIN_PASS_HASH || !SESSION_SECRET) {
    sendJson(res, 500, { error: 'Configuration serveur manquante (ADMIN_USER / ADMIN_PASS_HASH / SESSION_SECRET)' })
    return
  }

  let body = ''
  for await (const chunk of req) body += chunk
  let data
  try {
    data = JSON.parse(body)
  } catch {
    sendJson(res, 400, { error: 'Requete invalide' })
    return
  }

  const { identifiant, motDePasse } = data || {}
  if (!identifiant || !motDePasse) {
    sendJson(res, 400, { error: 'Identifiant et mot de passe requis' })
    return
  }

  const passHash = crypto.createHash('sha256').update(motDePasse + SESSION_SECRET).digest('hex')

  if (identifiant !== ADMIN_USER || passHash !== ADMIN_PASS_HASH) {
    sendJson(res, 401, { error: 'Identifiant ou mot de passe incorrect' })
    return
  }

  const sessionData = { user: identifiant, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  const payload = Buffer.from(JSON.stringify(sessionData)).toString('base64url')
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')

  const maxAge = 7 * 24 * 60 * 60
  const isSecure = process.env.VERCEL_URL ? 'Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `hc_admin_session=${payload}.${sig}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isSecure ? '; Secure' : ''}`,
  )

  sendJson(res, 200, { ok: true, user: identifiant })
}
