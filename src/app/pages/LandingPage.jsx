// LandingPage - SLZB Design (nach Vorlage des Kollegen)

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentJoin } from '../../lib/auth.js'
import { SLZBArcs, SLZBStripe } from '../../components/ui/SLZBArcs.jsx'

const BASE = import.meta.env.BASE_URL

const STUFEN = [
  { klasse: 7,  icon: '🌱', titel: 'Grundlagen',  unter: 'KI verstehen & verantwortungsvoll nutzen', verfuegbar: true,  badge: 'Jetzt: KI-Führerschein' },
  { klasse: 8,  icon: '🌿', titel: 'Vertiefung',  unter: 'KI kritisch einordnen & gestalten',        verfuegbar: false, badge: 'In Entwicklung' },
  { klasse: 9,  icon: '🌳', titel: 'Anwendung',   unter: 'KI-Projekte entwickeln & reflektieren',    verfuegbar: false, badge: 'In Entwicklung' },
  { klasse: 10, icon: '🌲', titel: 'Reflexion',   unter: 'KI & Gesellschaft – Zukunft mitgestalten', verfuegbar: false, badge: 'In Entwicklung' },
]

const MODS = [
  { nr: 1, farbe: '#1d77bd', titel: 'Was ist KI?',                unter: 'Trainingsdaten · Mustererkennung · Sprach-KI' },
  { nr: 2, farbe: '#c26a00', titel: 'KI sinnvoll nutzen',         unter: 'Fehler erkennen · Prompts · Verantwortung' },
  { nr: 3, farbe: '#d0121a', titel: 'Kennzeichnung & Datenschutz',unter: 'Wann kennzeichnen · Daten schützen' },
  { nr: 4, farbe: '#2b8a2b', titel: 'KI & Nachhaltigkeit',        unter: 'Ressourcen · Energie · Bewusster Einsatz' },
]

export default function LandingPage({ onJoin }) {
  const navigate   = useNavigate()
  const [name,     setName]     = useState('')
  const [klasse,   setKlasse]   = useState('')
  const [code,     setCode]     = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showCode, setShowCode] = useState(false)

  async function handleJoin(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Bitte deinen Vornamen eingeben.'); return }
    if (!klasse.trim()) { setError('Bitte deine Klasse eingeben.'); return }
    setLoading(true)
    // Offline-Modus: direkt mit Name+Klasse als Pseudonym anmelden
    // Klassencode aus Klasse generieren (z.B. "7b" → "KI7B")
    const joinCode = code.trim() || ('KI' + klasse.trim().toUpperCase().replace(/\s/g,''))
    const result = await studentJoin(joinCode, name.trim())
    setLoading(false)
    if (result.error) {
      // Fallback: direkt mit localStorage ohne Supabase
      const student = { id: crypto.randomUUID(), display_name: name.trim(), class_id: null }
      localStorage.setItem('ki_student', JSON.stringify(student))
      onJoin(student)
    } else {
      onJoin(result.student)
    }
  }

  const inp = {
    width: '100%', padding: '11px 14px',
    border: '2px solid #d5e0ee', borderRadius: '12px',
    font: 'inherit', fontSize: '1rem', color: '#17243b',
    background: 'white', boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'linear-gradient(145deg, var(--slzb-navy), var(--slzb-blue))', minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font)' }}>
      <SLZBArcs />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, height: '64px', display: 'flex', alignItems: 'center', gap: '14px', padding: '0 20px', background: 'white', borderBottom: '1px solid #d5e0ee' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <img src={BASE + 'slzb-ki-logo.png'} alt="SLZB KI" style={{ height: '46px', width: 'auto' }} onError={e => { e.target.style.display='none' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: '#00295f' }}>KI-Führerschein</div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#3c9dd7' }}>KI am SLZB · Klasse 7</div>
          </div>
        </a>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => navigate('/lehrer')}
            style={{ background: 'none', border: 'none', color: '#56667c', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            Lehrkraft-Bereich →
          </button>
        </div>
      </header>
      <SLZBStripe />

      {/* Hauptinhalt */}
      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '40px 20px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '30px', alignItems: 'start' }}>

          {/* Links: Beschreibung + Modulübersicht */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#baddff', marginBottom: '12px' }}>
              KI-Führerschein · Klasse 7 · SLZB
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 800, color: 'white', margin: '0 0 12px', lineHeight: 1.2 }}>
              Dein KI-Führerschein
            </h1>
            <p style={{ color: '#baddff', fontSize: '18px', margin: '0 0 28px', maxWidth: '540px', lineHeight: 1.5 }}>
              Vier Etappen – nach jeder bekommst du ein Abzeichen. Alle vier zusammen ergeben deinen KI-Führerschein.
            </p>

            {/* Modulübersicht */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MODS.map(m => (
                <div key={m.nr} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', padding: '12px 16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: m.farbe, color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '16px', flexShrink: 0, boxShadow: `0 0 0 3px white, 0 0 0 5px ${m.farbe}` }}>
                    {m.nr}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'white', fontSize: '15px' }}>{m.titel}</div>
                    <div style={{ color: '#baddff', fontSize: '13px' }}>{m.unter}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rechts: Login-Karte */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 14px 34px rgba(0,20,60,0.3)' }}>
            <h2 style={{ color: '#00295f', fontSize: '24px', margin: '0 0 6px' }}>Anmelden</h2>
            <div style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, borderRadius: '999px', padding: '2px 10px', background: '#eef5fc', color: '#063b81', marginBottom: '16px' }}>
              🔒 Offline-Modus · Daten bleiben auf diesem Gerät
            </div>

            <form onSubmit={handleJoin} noValidate>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '15px', color: '#17243b' }}>Vorname</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="z. B. Lena" autoComplete="given-name" style={inp}
                  onFocus={e => e.target.style.borderColor='#3c9dd7'}
                  onBlur={e => e.target.style.borderColor='#d5e0ee'} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '15px', color: '#17243b' }}>Klasse</label>
                <input type="text" value={klasse} onChange={e => setKlasse(e.target.value)}
                  placeholder="z. B. 7b" autoComplete="off" style={inp}
                  onFocus={e => e.target.style.borderColor='#3c9dd7'}
                  onBlur={e => e.target.style.borderColor='#d5e0ee'} />
                <div style={{ fontSize: '13px', color: '#56667c', marginTop: '5px' }}>
                  Mit Klassencode anmelden?{' '}
                  <button type="button" onClick={() => setShowCode(!showCode)}
                    style={{ background: 'none', border: 'none', color: '#063b81', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', padding: 0 }}>
                    {showCode ? 'Ausblenden' : 'Klassencode eingeben'}
                  </button>
                </div>
              </div>
              {showCode && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '15px', color: '#17243b' }}>Klassencode</label>
                  <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="z. B. KI7A" autoComplete="off" style={inp}
                    onFocus={e => e.target.style.borderColor='#3c9dd7'}
                    onBlur={e => e.target.style.borderColor='#d5e0ee'} />
                </div>
              )}

              {error && (
                <div style={{ background: '#fdeaea', color: '#c0262d', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontWeight: 600, fontSize: '15px' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ width: '100%', background: '#00295f', color: 'white', border: 'none', borderRadius: '999px', padding: '13px 20px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px' }}>
                {loading ? 'Einen Moment …' : "Los geht's →"}
              </button>
            </form>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #d5e0ee', textAlign: 'center' }}>
              <button onClick={() => navigate('/lehrer')}
                style={{ background: 'none', border: 'none', color: '#56667c', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Lehrkraft-Bereich →
              </button>
            </div>
          </div>
        </div>

        {/* Lernweg */}
        <div style={{ marginTop: '48px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#baddff', marginBottom: '14px' }}>
            Dein Lernweg bis Klasse 10
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {STUFEN.map(s => (
              <div key={s.klasse} style={{
                display: 'flex', flexDirection: 'column', gap: '8px',
                background: s.verfuegbar ? 'white' : '#0f4a8f',
                border: s.verfuegbar ? 'none' : '1.5px dashed rgba(255,255,255,0.28)',
                borderRadius: '16px', padding: '16px',
                color: s.verfuegbar ? '#17243b' : 'rgba(255,255,255,0.62)',
                boxShadow: s.verfuegbar ? '0 10px 24px rgba(0,20,60,0.25)' : 'none',
              }}>
                <div style={{ fontSize: '26px', filter: s.verfuegbar ? 'none' : 'grayscale(1)', opacity: s.verfuegbar ? 1 : 0.6 }}>{s.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.verfuegbar ? '#3c9dd7' : 'rgba(255,255,255,0.62)' }}>
                  Klasse {s.klasse}
                </div>
                <div style={{ fontWeight: 800, fontSize: '17px', color: s.verfuegbar ? '#00295f' : 'rgba(255,255,255,0.75)' }}>{s.titel}</div>
                <div style={{ fontSize: '13px', lineHeight: 1.35, color: s.verfuegbar ? '#56667c' : 'rgba(255,255,255,0.5)' }}>{s.unter}</div>
                <div style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, borderRadius: '999px', padding: '2px 9px', background: s.verfuegbar ? '#ffb225' : 'rgba(255,255,255,0.1)', color: s.verfuegbar ? '#00295f' : 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  {s.badge}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '32px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/datenschutz')}
            style={{ background: 'none', border: 'none', color: '#baddff', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Datenschutz
          </button>
          <button onClick={() => navigate('/lehrer')}
            style={{ background: 'none', border: 'none', color: '#baddff', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Lehrkraft-Bereich
          </button>
        </div>
      </div>
    </div>
  )
}
