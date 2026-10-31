// Modul 01 - Was ist KI? (Gamification: 4 Missionen)

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { startModuleLocal, passModule, getLocalProgress } from '../../lib/progress.js'
import Station1 from '../../modules/modul-01/Station1.jsx'
import Station2 from '../../modules/modul-01/Station2.jsx'
import Station3 from '../../modules/modul-01/Station3.jsx'
import Station4 from '../../modules/modul-01/Station4.jsx'

const MOD = getModule('modul-01')
const MOD_COLOR = '#2859d8'
const STORAGE_KEY = 'ki_m01_v3'

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { completed: [], station: 'home' }
}
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {} }

const STATION_ACH = {
  1: { icon: '🐴', title: 'Trainings-Experte',  xp: 80 },
  2: { icon: '🔍', title: 'Muster-Detektiv',    xp: 100 },
  3: { icon: '💬', title: 'Kontext-Kenner',      xp: 80 },
  4: { icon: '🧱', title: 'Satz-Baumeister',     xp: 140 },
}

export default function Modul01Page() {
  const navigate = useNavigate()
  const [state,    setState]    = useState(loadState)
  const [achieved, setAchieved] = useState(() => hasAchievement(MOD.id))
  const [showAch,  setShowAch]  = useState(null)

  useEffect(() => { startModuleLocal(MOD.id) }, [])

  function goStation(n) {
    const next = { ...state, station: n }
    setState(next); saveState(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function completeStation(n) {
    const completed = state.completed.includes(n) ? state.completed : [...state.completed, n]
    const next = { ...state, completed }
    setState(next); saveState(next)
    const ach = STATION_ACH[n]
    setShowAch(ach)
    if (n === 4) {
      passModule(MOD.id, 100, 100)
      saveAchievementLocal(MOD.id)
      setAchieved(true)
    }
  }

  const { completed, station } = state
  const progress = Math.round((completed.length / 4) * 100)

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>

      {/* Achievement-Overlay */}
      {showAch && (
        <div className="achievement-overlay" onClick={() => setShowAch(null)}>
          <div className="achievement-popup" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{showAch.icon}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Mission abgeschlossen!</div>
            <h2 style={{ margin: '0 0 0.5rem', color: '#fbbf24' }}>{showAch.title}</h2>
            <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.25rem', marginBottom: '1.25rem' }}>+{showAch.xp} XP ⭐</div>
            <button className="btn btn-xp" onClick={() => setShowAch(null)} style={{ width: '100%', justifyContent: 'center' }} autoFocus>Weiter →</button>
          </div>
        </div>
      )}

      <div className="wrap">
        {/* Modul-Header */}
        <div className="mission-header" style={{ marginBottom: 'var(--sp-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>KI-Führerschein · Modul 1</div>
              <h1 style={{ margin: '0 0 0.375rem', color: 'white' }}>🤖 Was ist KI?</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 'var(--fs-lg)' }}>Trainingsdaten · Mustererkennung · Sprach-KI</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div className="xp-badge">⭐ +{MOD.xp} XP</div>
              {achieved && <div style={{ background: 'rgba(22,163,74,0.3)', border: '1px solid rgba(22,163,74,0.6)', borderRadius: '99px', padding: '0.25rem 0.75rem', color: '#4ade80', fontWeight: 800, fontSize: 'var(--fs-sm)' }}>✓ Abgeschlossen</div>}
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>
              <span>Fortschritt</span><span>{progress}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        {/* Tab-Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
          {[{ n: 'home', label: 'Start' }, { n: 1, label: '1·Trainingsdaten' }, { n: 2, label: '2·Wasserzeichen' }, { n: 3, label: '3·Kontext' }, { n: 4, label: '4·Satzwerkstatt' }].map(t => (
            <button key={t.n} className={`nav-btn ${station === t.n ? 'active' : ''}`} onClick={() => goStation(t.n)} style={{ fontSize: 'var(--fs-xs)' }}>
              {typeof t.n === 'number' && completed.includes(t.n) ? '✓ ' : ''}{t.label}
            </button>
          ))}
        </div>

        {/* Startseite */}
        {station === 'home' && (
          <div className="card">
            <h2>🕵️ Deine Missionen</h2>
            <p className="lead">Vier Missionen zeigen dir, wie KI funktioniert – von Trainingsdaten bis zur Sprach-KI.</p>
            <div className="grid-2" style={{ marginBottom: 'var(--sp-lg)' }}>
              {[
                { n: 1, icon: '🐴', label: 'Trainingsdaten',  sub: 'Wie lernt KI?',              xp: 80  },
                { n: 2, icon: '🔍', label: 'Wasserzeichen',   sub: 'Falsche Muster erkennen',    xp: 100 },
                { n: 3, icon: '💬', label: 'Kontext',         sub: 'Wortwahrscheinlichkeiten',   xp: 80  },
                { n: 4, icon: '🧱', label: 'Satzwerkstatt',   sub: 'Schritt für Schritt',        xp: 140 },
              ].map(s => (
                <div key={s.n} style={{ background: completed.includes(s.n) ? 'var(--c-success-bg)' : 'var(--c-pale2)', border: `2px solid ${completed.includes(s.n) ? 'var(--c-success)' : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="mission-number" style={{ background: completed.includes(s.n) ? 'var(--c-success)' : 'var(--c-xp)' }}>{completed.includes(s.n) ? '✓' : s.n}</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{s.icon} {s.label}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>{s.sub}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-warn)', fontWeight: 800 }}>+{s.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="actions">
              <button className="btn btn-xp" onClick={() => goStation(1)}>Mission 1 starten →</button>
              <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Übersicht</button>
            </div>
          </div>
        )}

        {station === 1 && <Station1 done={completed.includes(1)} onComplete={() => { completeStation(1); goStation(2) }} />}
        {station === 2 && <Station2 done={completed.includes(2)} onComplete={() => { completeStation(2); goStation(3) }} />}
        {station === 3 && <Station3 done={completed.includes(3)} onComplete={() => { completeStation(3); goStation(4) }} />}
        {station === 4 && <Station4 done={completed.includes(4)} onComplete={() => { completeStation(4); goStation('home') }} achieved={achieved} onDashboard={() => navigate('/dashboard')} />}

        {station !== 'home' && (
          <div className="actions no-print" style={{ marginTop: 'var(--sp-lg)' }}>
            <button className="btn btn-ghost" onClick={() => goStation(typeof station === 'number' && station > 1 ? station - 1 : 'home')}>← Zurück</button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Zur Übersicht</button>
          </div>
        )}
      </div>
    </div>
  )
}