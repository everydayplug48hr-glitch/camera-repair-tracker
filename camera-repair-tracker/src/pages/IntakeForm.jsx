import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

const empty = { name: '', phone: '', email: '', brand: '', model: '', serial: '', fault: '', method: 'in_store' }

export default function IntakeForm() {
  const [f, setF] = useState(empty)
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { data, error } = await supabase.rpc('submit_repair', {
      p_name: f.name, p_phone: f.phone, p_email: f.email || null,
      p_brand: f.brand, p_model: f.model, p_serial: f.serial || null,
      p_fault: f.fault, p_method: f.method,
    })
    setBusy(false)
    if (error) return setError('Could not send your request. Check your details and try again.')
    setTicket(data)
  }

  if (ticket) return (
    <section className="panel">
      <h1>Request received</h1>
      <p>Your ticket number is</p>
      <p className="ticket">{ticket}</p>
      <p>Keep it, with the last 4 digits of your phone number, to track your repair.</p>
      <button onClick={() => { setTicket(null); setF(empty) }}>Book another camera</button>
    </section>
  )

  return (
    <form className="panel" onSubmit={submit}>
      <h1>Book a camera repair</h1>
      <label>Your name<input required value={f.name} onChange={set('name')} /></label>
      <label>Phone / WhatsApp<input required type="tel" value={f.phone} onChange={set('phone')} /></label>
      <label>Email (optional)<input type="email" value={f.email} onChange={set('email')} /></label>
      <div className="row">
        <label>Camera brand<input required value={f.brand} onChange={set('brand')} /></label>
        <label>Model<input required value={f.model} onChange={set('model')} /></label>
      </div>
      <label>Serial number (optional)<input value={f.serial} onChange={set('serial')} /></label>
      <label>What is wrong with it?<textarea required rows="4" value={f.fault} onChange={set('fault')} /></label>
      <label>How will it reach us?
        <select value={f.method} onChange={set('method')}>
          <option value="in_store">I will drop it off in store</option>
          <option value="courier">I will send it by courier</option>
        </select>
      </label>
      {error && <p className="error">{error}</p>}
      <button disabled={busy}>{busy ? 'Sending...' : 'Send repair request'}</button>
    </form>
  )
}
