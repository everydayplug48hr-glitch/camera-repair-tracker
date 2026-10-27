import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { STATUSES, isWaiting, money, daysLeft, daysLabel } from '../utils/dates.js'

export default function Dashboard() {
  const nav = useNavigate()
  const [repairs, setRepairs] = useState(null)
  const [filter, setFilter] = useState('Waiting')
  const [error, setError] = useState('')

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return nav('/login')
    const { data, error } = await supabase
      .from('repairs').select('*, customers(name, phone)').order('created_at', { ascending: false })
    if (error) return setError('Could not load repairs.')
    setRepairs(data)
  }
  useEffect(() => { load() }, [])

  async function save(id, patch) {
    const { error } = await supabase.from('repairs').update(patch).eq('id', id)
    if (error) setError('Could not save that change.')
    else setRepairs((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }
  const num = (v) => (v === '' ? null : Number(v))

  if (!repairs) return <p className="panel">{error || 'Loading...'}</p>

  const waiting = repairs.filter(isWaiting)
  const overdue = waiting.filter((r) => (daysLeft(r) ?? 1) < 0).length
  const quoted = waiting.reduce((s, r) => s + Number(r.quoted_price || 0), 0)
  const earned = repairs.filter((r) => r.status === 'Collected').reduce((s, r) => s + Number(r.final_price || 0), 0)
  const shown = filter === 'All' ? repairs : filter === 'Waiting' ? waiting : repairs.filter((r) => r.status === filter)

  return (
    <section className="wide">
      <div className="stats">
        <div><b>{waiting.length}</b> clients waiting</div>
        <div><b className={overdue ? 'late' : ''}>{overdue}</b> overdue</div>
        <div><b>{money(quoted)}</b> quoted, not yet collected</div>
        <div><b>{money(earned)}</b> collected and paid</div>
      </div>
      <div className="bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {['Waiting', 'All', ...STATUSES].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="ghost" onClick={async () => { await supabase.auth.signOut(); nav('/login') }}>Log out</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="scroll">
        <table>
          <thead><tr>
            <th>Ticket</th><th>Customer</th><th>Camera and fault</th><th>Status</th>
            <th>Est. days</th><th>Time left</th><th>Quote</th><th>Final</th>
          </tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className={(daysLeft(r) ?? 1) < 0 && isWaiting(r) ? 'overdue' : ''}>
                <td>{r.ticket_id}</td>
                <td>{r.customers?.name}<br /><small>{r.customers?.phone}</small></td>
                <td>{r.camera_brand} {r.camera_model}<br /><small>{r.fault_description}</small></td>
                <td><select value={r.status} onChange={(e) => save(r.id, { status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
                <td><input className="n" type="number" min="0" defaultValue={r.estimated_days ?? ''}
                  onBlur={(e) => save(r.id, { estimated_days: num(e.target.value) })} /></td>
                <td>{isWaiting(r) ? daysLabel(r) : '-'}</td>
                <td><input className="n" type="number" min="0" step="0.01" defaultValue={r.quoted_price ?? ''}
                  onBlur={(e) => save(r.id, { quoted_price: num(e.target.value) })} /></td>
                <td><input className="n" type="number" min="0" step="0.01" defaultValue={r.final_price ?? ''}
                  onBlur={(e) => save(r.id, { final_price: num(e.target.value) })} /></td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan="8">No repairs here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
