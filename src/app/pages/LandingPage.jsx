// LandingPage - Startseite mit Kompetenzrahmen

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { studentJoin } from '../../lib/auth.js'
import { applyCode } from '../../lib/levelCode.js'

export default function LandingPage({ onJoin }) {
  const [showJoin,    setShowJoin]    = useState(false)
  const [showCode,    setShowCode]    = useState(false)
  const [joinCode,    setJoinCode]    = useState('')
  const [displayName, setDisplayName] = useState('')
  const [codeInput,   setCodeInput]   = useState('')
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [codeResult,  setCodeResult]  = useState(null)

  async function handleJoin(e) {
    e.preventDefault()
    setError('')
    if (!joinCode.trim())    { setError('Bitte Klassencode eingeben.'); return }
    if (!displayName.trim()) { setError('Bitte Namen eingeben.'); return }
    setLoading(true)
    const result = await studentJoin(joinCode, displayName)
    setLoading(false)
    if (result.error) setError(result.error)
    else onJoin(result.student)
  }

  function handleCode() {
    const result = applyCode(codeInput.trim())
    setCodeResult(result)
  }

  const STUFEN = [
    { grade: 7,  icon: '🌱', title: 'Grundlagen',  sub: 'KI verstehen & verantwortungsvoll nutzen', available: true  },
    { grade: 8,  icon: '🌿', title: 'Vertiefung',  sub: 'KI kritisch einordnen & gestalten',        available: false },
    { grade: 9,  icon: '🌳', title: 'Anwendung',   sub: 'KI-Projekte entwickeln & reflektieren',    available: false },
    { grade: 10, icon: '🌲', title: 'Reflexion',   sub: 'KI & Gesellschaft – Zukunft mitgestalten', available: false },
  ]

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ maxWidth: '70rem', margin: '0 auto', padding: '4rem 1.5rem 2rem', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
          Schulische KI-Kompetenzplattform
        </div>
        <h1 style={{ margin: '0 0 1rem', fontSize: 'clamp(2rem,6vw,3.5rem)', lineHeight: 1.1 }}>
          KI-Führerschein
        </h1>
        <p style={{ margin: '0 auto 2rem', maxWidth: '36rem', fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Lerne, wie Künstliche Intelligenz funktioniert – und wie du sie verantwortungsvoll einsetzt. Von Klasse 7 bis zur Oberstufe.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button className="btn btn-xp" onClick={() => setShowJoin(true)} style={{ fontSize: '1.05rem', padding: '0.875rem 2rem' }}>
            🚀 Jetzt starten
          </button>
          <button className="btn btn-ghost" onClick={() => setShowCode(true)}>
            🏅 Vorleistungs-Code
          </button>
        </div>
        <Link to="/lehrer" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Lehrkraft-Anmeldung →</Link>
      </div>

      {/* Anmelde-Modal */}
      {showJoin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '28rem', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--c-dark)' }}>🎮 Anmelden</h2>
            <form onSubmit={handleJoin} noValidate>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.375rem' }}>Klassencode</label>
                <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="z. B. DEMO7A" maxLength={10} autoComplete="off"
                  style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.1em' }} />
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--c-muted)' }}>Den Code bekommst du von deiner Lehrkraft.</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.375rem' }}>Dein Name (oder Pseudonym)</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                  placeholder="z. B. Lena M." maxLength={50} autoComplete="off" />
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--c-muted)' }}>Du kannst auch ein Pseudonym verwenden.</p>
              </div>
              {error && <div style={{ background: 'var(--c-error-bg)', color: 'var(--c-error)', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: '1rem', fontWeight: 700, fontSize: '0.875rem' }}>{error}</div>}
              <div className="actions">
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                  {loading ? 'Wird angemeldet …' : 'Loslegen →'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowJoin(false)}>Abbrechen</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Code-Modal */}
      {showCode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '28rem', width: '100%' }}>
            <h2 style={{ marginTop: 0 }}>🏅 Vorleistungs-Code</h2>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>Du hast einen Code auf deiner Urkunde? Gib ihn hier ein, damit das System deine Vorleistungen kennt.</p>
            <input type="text" value={codeInput} onChange={e => setCodeInput(e.target.value.toUpperCase())}
              placeholder="KI-7-ABCD-X4" maxLength={20}
              style={{ fontFamily: 'monospace', fontWeight: 700, marginBottom: '0.75rem' }} />
            {codeResult && (
              <div style={{ marginBottom: '0.75rem', color: codeResult.success ? 'var(--c-success)' : 'var(--c-error)', fontWeight: 700, fontSize: '0.875rem' }}>
                {codeResult.success ? `✅ ${codeResult.moduleIds.length} Achievement(s) übernommen!` : `❌ ${codeResult.error}`}
              </div>
            )}
            <div className="actions">
              <button className="btn btn-primary" onClick={handleCode}>Einlösen</button>
              <button className="btn btn-ghost" onClick={() => setShowCode(false)}>Schließen</button>
            </div>
          </div>
        </div>
      )}

      {/* Kompetenzbereiche */}
      <div style={{ maxWidth: '70rem', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '1.5rem' }}>Vier Kompetenzbereiche</h2>
        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', marginBottom: '3rem' }}>
          {[
            { icon: '🔍', title: 'Verstehen',    text: 'Wie KI funktioniert, lernt und Entscheidungen trifft.' },
            { icon: '🛠️', title: 'Anwenden',     text: 'KI sinnvoll, verantwortungsvoll und kritisch einsetzen.' },
            { icon: '🪞', title: 'Reflektieren', text: 'Auswirkungen von KI auf Gesellschaft und Umwelt einschätzen.' },
            { icon: '🌱', title: 'Mitgestalten', text: 'Bewusste Entscheidungen treffen und die digitale Zukunft formen.' },
          ].map(k => (
            <div key={k.title} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--r-xl)', padding: '1.25rem', textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{k.icon}</div>
              <h3 style={{ margin: '0 0 0.375rem', color: '#7dd3fc' }}>{k.title}</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{k.text}</p>
            </div>
          ))}
        </div>

        {/* Jahrgangsstufen */}
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '1.5rem' }}>Dein Lernweg</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
          {STUFEN.map((s, i) => (
            <div key={s.grade} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: s.available ? 'var(--c-teal)' : 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0, boxShadow: s.available ? '0 0 20px rgba(8,127,131,0.5)' : 'none' }}>
                {s.icon}
              </div>
              <div style={{ flex: 1, background: s.available ? 'rgba(8,127,131,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${s.available ? 'rgba(8,127,131,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 'var(--r-lg)', padding: '0.875rem 1.25rem', opacity: s.available ? 1 : 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ background: s.available ? 'rgba(8,127,131,0.3)' : 'rgba(255,255,255,0.1)', color: s.available ? '#7dd3fc' : 'rgba(255,255,255,0.5)', borderRadius: '99px', padding: '0.125rem 0.625rem', fontSize: '0.7rem', fontWeight: 800 }}>Klasse {s.grade}</span>
                  <span style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>Stufe {i+1}: {s.title}</span>
                  {!s.available && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>In Entwicklung</span>}
                </div>
                <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer-Links */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', paddingBottom: '2rem' }}>
          <Link to="/datenschutz" style={{ color: 'rgba(255,255,255,0.4)', marginRight: '1.5rem' }}>🔒 Datenschutz</Link>
          <Link to="/lehrer" style={{ color: 'rgba(255,255,255,0.4)' }}>👩‍🏫 Lehrkraft-Anmeldung</Link>
        </div>
      </div>
    </div>
  )
}