import crypto from 'crypto'

export const config = { runtime: 'nodejs18.x' }

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default async function handler(req, res) {
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

  const SESSION_SECRET = process.env.SESSION_SECRET
  if (!SESSION_SECRET) {
    sendJson(res, 500, { authenticated: false, error: 'Configuration serveur manquante' })
    return
  }

  const cookie = req.headers.cookie || ''
  const match = cookie.match(/hc_admin_session=([^;]+)/)
  if (!match) {
    sendJson(res, 401, { authenticated: false })
    return
  }

  const token = match[1]
  const [payload, sig] = token.split('.')
  if (!payload || !sig) {
    sendJson(res, 401, { authenticated: false })
    return
  }

  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
  if (sig !== expectedSig) {
    sendJson(res, 401, { authenticated: false })
    return
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (Date.now() > data.exp) {
      sendJson(res, 401, { authenticated: false })
      return
    }
    sendJson(res, 200, { authenticated: true, user: data.user })
  } catch {
    sendJson(res, 401, { authenticated: false })
  }
}
