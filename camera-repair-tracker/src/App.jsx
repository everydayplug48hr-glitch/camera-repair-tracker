import { Routes, Route, NavLink } from 'react-router-dom'
import IntakeForm from './pages/IntakeForm.jsx'
import TrackRepair from './pages/TrackRepair.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <>
      <header className="top">
        <strong>Camera repairs</strong>
        <nav>
          <NavLink to="/">Book a repair</NavLink>
          <NavLink to="/track">Track my repair</NavLink>
          <NavLink to="/dashboard">Owner</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<IntakeForm />} />
          <Route path="/track" element={<TrackRepair />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </>
  )
}
