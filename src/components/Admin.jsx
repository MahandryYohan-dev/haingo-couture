import { useState, useEffect, useMemo } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { siteConfig } from '../config/site.js'
import {
  loadSales,
  addSale,
  updateSale,
  removeSale,
  formatAr,
} from '../lib/store.js'
import { checkAuth, login, logout } from '../lib/auth.js'

export default function Admin() {
  const { t } = useLang()
  const a = t.admin

  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [identifiant, setIdentifiant] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [loginError, setLoginError] = useState('')
  const [logining, setLogining] = useState(false)

  const [sales, setSales] = useState(loadSales)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)
  const [draft, setDraft] = useState({ nom: '', contact: '', creation: '', prix: 0 })
  const [form, setForm] = useState({ nom: '', contact: '', pays: '', creation: '', prix: '' })

  const refresh = () => setSales(loadSales())

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const ok = await checkAuth()
      if (mounted) {
        setAuthed(ok)
        setChecking(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const onLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLogining(true)
    try {
      await login(identifiant.trim(), motDePasse)
      setAuthed(true)
      setIdentifiant('')
      setMotDePasse('')
    } catch (err) {
      setLoginError(err.message || 'Identifiant ou mot de passe incorrect.')
    } finally {
      setLogining(false)
    }
  }

  const onLogout = async () => {
    await logout()
    setAuthed(false)
  }

  const onAdd = (e) => {
    e.preventDefault()
    if (!form.nom.trim() || !form.contact.trim() || !form.creation) return
    addSale({
      nom: form.nom.trim(),
      contact: form.contact.trim(),
      pays: form.pays.trim(),
      creation: form.creation,
      prix: Number(form.prix) || 0,
    })
    setForm({ nom: '', contact: '', pays: '', creation: '', prix: '' })
    setAdding(false)
    refresh()
  }

  const startEdit = (s) => {
    setEditId(s.id)
    setDraft({ nom: s.nom, contact: s.contact, creation: s.creation, prix: s.prix })
  }

  const saveEdit = () => {
    updateSale(editId, {
      nom: draft.nom.trim(),
      contact: draft.contact.trim(),
      creation: draft.creation.trim(),
      prix: Number(draft.prix) || 0,
    })
    setEditId(null)
    refresh()
  }

  const onDelete = (s) => {
    if (!window.confirm(`${a.dashboard.confirmRemove} : ${s.nom} ?`)) return
    removeSale(s.id)
    refresh()
  }

  const stats = useMemo(() => {
    const total = sales.reduce((sum, s) => sum + (Number(s.prix) || 0), 0)
    const pending = sales.filter((s) => !(Number(s.prix) > 0)).length
    return { total, count: sales.length, pending }
  }, [sales])

  const bars = useMemo(() => {
    const map = new Map()
    sales.forEach((s) => {
      const key = (s.creation || '—').trim() || '—'
      const cur = map.get(key) || { label: key, value: 0, count: 0 }
      cur.value += Number(s.prix) || 0
      cur.count += 1
      map.set(key, cur)
    })
    const list = [...map.values()].sort((x, y) => y.value - x.value)
    const max = Math.max(1, ...list.map((x) => x.value))
    return list.map((x) => ({ ...x, pct: Math.max(2, Math.round((x.value / max) * 100)) }))
  }, [sales])

  if (!authed) {
    return (
      <section className="section admin" id="admin">
        <div className="container admin__narrow">
          {checking ? (
            <p className="form-msg form-msg--ok">Verification de la session en cours…</p>
          ) : (
            <form className="admin__login" onSubmit={onLogin} noValidate>
              <span className="eyebrow">{a.login.label}</span>
              <h2 className="section__title">{a.login.title}</h2>
              <p className="section__sub">{a.login.sub}</p>

              <label className="field">
                <span>{a.login.identifiant}</span>
                <input
                  type="text"
                  autoComplete="username"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span>{a.login.password}</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                />
              </label>

              <button className="btn btn--gold btn--block" type="submit" disabled={logining}>
                {logining ? 'Connexion en cours…' : a.login.submit}
              </button>

              {loginError && <p className="form-msg form-msg--err">{loginError}</p>}

              <a className="admin__back" href="#accueil">
                ← {a.login.back}
              </a>
            </form>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="section admin" id="admin">
      <div className="container">
        <header className="admin__bar">
          <div>
            <span className="eyebrow">{a.dashboard.label}</span>
            <h2 className="section__title">{a.dashboard.title}</h2>
          </div>
          <div className="admin__bar-actions">
            <a className="btn btn--ghost" href="#accueil">
              {a.dashboard.back}
            </a>
            <button className="btn btn--ghost" onClick={onLogout}>
              {a.dashboard.logout}
            </button>
            <button className="btn btn--gold" onClick={() => setAdding((v) => !v)}>
              {adding ? a.dashboard.cancel : a.dashboard.add}
            </button>
          </div>
        </header>

        <div className="admin__stats">
          <div className="stat">
            <span className="stat__label">{a.dashboard.statTotal}</span>
            <strong>{formatAr(stats.total)}</strong>
          </div>
          <div className="stat">
            <span className="stat__label">{a.dashboard.statCount}</span>
            <strong>{stats.count}</strong>
          </div>
          <div className="stat">
            <span className="stat__label">{a.dashboard.statPending}</span>
            <strong>{stats.pending}</strong>
          </div>
        </div>

        {adding && (
          <form className="admin__add" onSubmit={onAdd} noValidate>
            <h3>{a.dashboard.addTitle}</h3>
            <div className="field-row">
              <label className="field">
                <span>{a.dashboard.nom} *</span>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                />
              </label>
              <label className="field">
                <span>{a.dashboard.contact} *</span>
                <input
                  type="text"
                  value={form.contact}
                  placeholder={a.dashboard.contactHint}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className="field-row">
              <label className="field">
                <span>{a.dashboard.pays}</span>
                <input
                  type="text"
                  value={form.pays}
                  onChange={(e) => setForm({ ...form, pays: e.target.value })}
                />
              </label>
              <label className="field">
                <span>{a.dashboard.creation} *</span>
                <select
                  value={form.creation}
                  onChange={(e) => setForm({ ...form, creation: e.target.value })}
                  required
                >
                  <option value="">—</option>
                  {a.dashboard.creations.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="field-row">
              <label className="field">
                <span>{a.dashboard.prix} (Ar)</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: e.target.value })}
                />
              </label>
            </div>
            <button className="btn btn--gold" type="submit">
              {a.dashboard.save}
            </button>
          </form>
        )}

        <div className="admin__panel">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{a.dashboard.nom}</th>
                  <th>{a.dashboard.contact}</th>
                  <th>{a.dashboard.creation}</th>
                  <th>{a.dashboard.prix}</th>
                  <th>{a.dashboard.action}</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {editId === s.id ? (
                        <input
                          type="text"
                          value={draft.nom}
                          onChange={(e) => setDraft({ ...draft, nom: e.target.value })}
                        />
                      ) : (
                        <>
                          <strong>{s.nom}</strong>
                          {s.pays && <em className="table__sub">{s.pays}</em>}
                        </>
                      )}
                    </td>
                    <td>
                      {editId === s.id ? (
                        <input
                          type="text"
                          value={draft.contact}
                          onChange={(e) => setDraft({ ...draft, contact: e.target.value })}
                        />
                      ) : (
                        s.contact
                      )}
                    </td>
                    <td>
                      {editId === s.id ? (
                        <input
                          type="text"
                          value={draft.creation}
                          onChange={(e) => setDraft({ ...draft, creation: e.target.value })}
                        />
                      ) : (
                        s.creation
                      )}
                    </td>
                    <td>
                      {editId === s.id ? (
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={draft.prix}
                          onChange={(e) => setDraft({ ...draft, prix: e.target.value })}
                        />
                      ) : (
                        <span className={Number(s.prix) > 0 ? 'table__price' : 'table__price table__price--zero'}>
                          {formatAr(s.prix)}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="table__actions">
                        {editId === s.id ? (
                          <>
                            <button className="chip chip--ok" onClick={saveEdit}>
                              {a.dashboard.save}
                            </button>
                            <button className="chip" onClick={() => setEditId(null)}>
                              {a.dashboard.cancel}
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="chip" onClick={() => startEdit(s)}>
                              {a.dashboard.edit}
                            </button>
                            <button className="chip chip--danger" onClick={() => onDelete(s)}>
                              {a.dashboard.remove}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td className="table__empty" colSpan="5">
                      {a.dashboard.empty}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin__panel">
          <h3 className="admin__panel-title">{a.dashboard.chartTitle}</h3>
          {bars.length === 0 || bars.every((b) => b.value === 0) ? (
            <p className="table__empty">{a.dashboard.chartEmpty}</p>
          ) : (
            <div className="chart">
              {bars.map((b) => (
                <div className="chart__row" key={b.label}>
                  <span className="chart__label">
                    {b.label} <em>· {b.count}</em>
                  </span>
                  <div className="chart__track">
                    <div className="chart__bar" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="chart__value">{formatAr(b.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
