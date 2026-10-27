import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { daysLabel, money } from '../utils/dates.js'

export default function TrackRepair() {
  const [ticket, setTicket] = useState('')
  const [last4, setLast4] = useState('')
  const [repair, setRepair] = useState(null)
  const [msg, setMsg] = useState('')

  async function lookup(e) {
    e.preventDefault()
    setRepair(null); setMsg('')
    const { data, error } = await supabase.rpc('track_repair', { p_ticket: ticket, p_phone_last4: last4 })
    if (error) return setMsg('Something went wrong. Try again in a moment.')
    if (!data?.length) return setMsg('No repair found. Check the ticket number and the last 4 digits of your phone.')
    setRepair(data[0])
  }

  return (
    <section className="panel">
      <h1>Track my repair</h1>
      <form onSubmit={lookup}>
        <label>Ticket number<input required placeholder="CR-0001" value={ticket} onChange={(e) => setTicket(e.target.value)} /></label>
        <label>Last 4 digits of your phone<input required maxLength="4" inputMode="numeric" value={last4} onChange={(e) => setLast4(e.target.value)} /></label>
        <button>Find my repair</button>
      </form>
      {msg && <p className="error">{msg}</p>}
      {repair && (
        <dl className="result">
          <dt>Camera</dt><dd>{repair.camera_brand} {repair.camera_model}</dd>
          <dt>Status</dt><dd><span className="badge">{repair.status}</span></dd>
          <dt>Time to completion</dt><dd>{daysLabel(repair)}</dd>
          <dt>Quote</dt><dd>{money(repair.quoted_price)}</dd>
          <dt>Final price</dt><dd>{money(repair.final_price)}</dd>
        </dl>
      )}
    </section>
  )
}
