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

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end()
    return
  }

  const isSecure = process.env.VERCEL_URL ? 'Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `hc_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isSecure ? '; Secure' : ''}`,
  )
  res.statusCode = 200
  res.end(JSON.stringify({ ok: true }))
}
