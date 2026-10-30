// ============================================================
// KI-Führerschein · Startseite / Kompetenzrahmen
// Übersicht aller Jahrgangsstufen + Einstieg
// ============================================================

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { STUFEN } from '../../lib/levelCode.js'
import { applyCode } from '../../lib/levelCode.js'
import { Link } from 'react-router-dom'
import { InfoBox, WarningBox, MemoryBox } from '../../components/ui/InfoBox.jsx'

const KOMPETENZBEREICHE = [
  { icon: '🔍', title: 'Verstehen',     text: 'Wie KI funktioniert, lernt und Entscheidungen trifft.' },
  { icon: '🛠️', title: 'Anwenden',      text: 'KI sinnvoll, verantwortungsvoll und kritisch einsetzen.' },
  { icon: '🪞', title: 'Reflektieren',  text: 'Auswirkungen von KI auf Gesellschaft und Umwelt einschätzen.' },
  { icon: '🌱', title: 'Mitgestalten',  text: 'Bewusste Entscheidungen treffen und die digitale Zukunft formen.' },
]

export default function LandingPage({ onJoin }) {
  const navigate = useNavigate()
  const [showCode,    setShowCode]    = useState(false)
  const [codeInput,   setCodeInput]   = useState('')
  const [codeResult,  setCodeResult]  = useState(null)
  const [showJoin,    setShowJoin]    = useState(false)
  const [joinCode,    setJoinCode]    = useState('')
  const [displayName, setDisplayName] = useState('')
  const [joinError,   setJoinError]   = useState('')
  const [joinLoading, setJoinLoading] = useState(false)

  function handleCodeApply() {
    if (!codeInput.trim()) return
    const result = applyCode(codeInput.trim())
    setCodeResult(result)
  }

  async function handleJoin(e) {
    e.preventDefault()
    setJoinError('')
    if (!joinCode.trim())    { setJoinError('Bitte gib den Klassencode ein.'); return }
    if (!displayName.trim()) { setJoinError('Bitte gib deinen Namen ein.');    return }
    setJoinLoading(true)
    const { studentJoin } = await import('../../lib/auth.js')
    const result = await studentJoin(joinCode, displayName)
    setJoinLoading(false)
    if (result.error) setJoinError(result.error)
    else onJoin(result.student)
  }

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{
        background:   'linear-gradient(135deg, #103d54, #095c6b, #087f83)',
        color:        'white',
        padding:      'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)',
        textAlign:    'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '16px' }}>🤖</div>
          <div className="eyebrow" style={{ marginBottom: '12px', fontSize: '0.9rem' }}>
            Schulische KI-Kompetenzplattform
          </div>
          <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1.1 }}>
            KI-Führerschein
          </h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 32px' }}>
            Lerne, wie Künstliche Intelligenz funktioniert – und wie du sie verantwortungsvoll einsetzt.
            Von Klasse 7 bis zur Oberstufe.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => setShowJoin(true)}
              style={{ background: '#ffda76', color: '#103d54', fontSize: '1.1rem', padding: '16px 32px', fontWeight: 900 }}>
              Jetzt starten →
            </button>
            <button className="btn" onClick={() => setShowCode(true)}
              style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: 'white', fontSize: '1rem', padding: '16px 24px' }}>
              🏅 Vorleistungs-Code eingeben
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: 'var(--space-xl) var(--space-md)' }}>

        {/* ── Anmelde-Modal ── */}
        {showJoin && (
          <div style={{
            background: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-lg)', marginBottom: 'var(--space-xl)',
            border: '2px solid var(--color-platform-teal)',
          }}>
            <h2 style={{ color: 'var(--color-platform-teal)', marginTop: 0 }}>Anmelden</h2>
            <form onSubmit={handleJoin} noValidate>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label htmlFor="lp-code" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Klassencode</label>
                  <input id="lp-code" type="text" value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="z. B. TEST01" maxLength={10} autoComplete="off"
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.1em' }} />
                </div>
                <div style={{ flex: 2, minWidth: '200px' }}>
                  <label htmlFor="lp-name" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Dein Name (oder Pseudonym)</label>
                  <input id="lp-name" type="text" value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="z. B. Lena M." maxLength={50} autoComplete="off"
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit' }} />
                </div>
              </div>
              {joinError && <div className="box-warning" style={{ marginBottom: 'var(--space-md)' }}>{joinError}</div>}
              <div className="actions">
                <button type="submit" className="btn btn-primary" disabled={joinLoading}>
                  {joinLoading ? 'Wird angemeldet …' : 'Loslegen →'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowJoin(false)}>Abbrechen</button>
                <Link to="/lehrer" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', alignSelf: 'center', marginLeft: 'auto' }}>Lehrkraft-Anmeldung →</Link>
              </div>
            </form>
          </div>
        )}

        {/* ── Vorleistungs-Code ── */}
        {showCode && (
          <div style={{
            background: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-lg)', marginBottom: 'var(--space-xl)',
            border: '2px solid var(--color-gold-dark)',
          }}>
            <h2 style={{ color: '#825300', marginTop: 0 }}>🏅 Vorleistungs-Code eingeben</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Du hast einen Code auf deiner Urkunde? Gib ihn hier ein, damit das System deine
              bereits erworbenen Kompetenzen kennt.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
              <input type="text" value={codeInput}
                onChange={e => setCodeInput(e.target.value.toUpperCase())}
                placeholder="z. B. KI-7-ABCD-X4"
                maxLength={20}
                style={{ flex: 1, minWidth: '200px', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }} />
              <button className="btn btn-primary" onClick={handleCodeApply}
                style={{ background: '#825300' }}>
                Code einlösen
              </button>
              <button className="btn btn-ghost" onClick={() => { setShowCode(false); setCodeResult(null); setCodeInput('') }}>
                Abbrechen
              </button>
            </div>
            {codeResult && (
              codeResult.success ? (
                <div className="feedback correct" style={{ display: 'block' }}>
                  ✅ Code eingelöst! {codeResult.moduleIds.length} Achievement(s) aus Jahrgang {codeResult.grade} übernommen.
                  <div style={{ marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>
                    Jetzt anmelden, um weiterzumachen.
                  </div>
                </div>
              ) : (
                <div className="feedback wrong" style={{ display: 'block' }}>❌ {codeResult.error}</div>
              )
            )}
            <InfoBox style={{ marginTop: 'var(--space-md)' }}>
              Der Code enthält keine persönlichen Daten – nur Informationen darüber, welche Module du bestanden hast.
            </InfoBox>
          </div>
        )}

        {/* ── Kompetenzbereiche ── */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ color: 'var(--color-platform)', textAlign: 'center', marginBottom: 'var(--space-lg)', fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            Vier Kompetenzbereiche
          </h2>
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {KOMPETENZBEREICHE.map(k => (
              <div key={k.title} style={{
                background:   'white',
                borderRadius: 'var(--radius-xl)',
                padding:      'var(--space-lg)',
                boxShadow:    'var(--shadow-md)',
                textAlign:    'center',
                border:       '1px solid var(--color-border)',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{k.icon}</div>
                <h3 style={{ color: 'var(--color-platform-teal)', margin: '0 0 8px' }}>{k.title}</h3>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>{k.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Jahrgangsstufen ── */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ color: 'var(--color-platform)', textAlign: 'center', marginBottom: '8px', fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            Dein Lernweg – Stufe für Stufe
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
            Jede Klassenstufe baut auf der vorherigen auf. Deine Urkunde enthält einen Code,
            mit dem das System deine Vorleistungen kennt.
          </p>

          {/* Stufenübersicht */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {STUFEN.map((stufe, idx) => (
              <div key={stufe.stufe} style={{
                display:      'flex',
                gap:          'var(--space-md)',
                alignItems:   'flex-start',
                opacity:      stufe.available ? 1 : 0.65,
              }}>
                {/* Verbindungslinie */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width:          '52px',
                    height:         '52px',
                    borderRadius:   '50%',
                    background:     stufe.available ? stufe.color : '#c9e3e8',
                    color:          'white',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    fontSize:       '1.5rem',
                    fontWeight:     900,
                    boxShadow:      stufe.available ? `0 4px 12px ${stufe.color}40` : 'none',
                    flexShrink:     0,
                  }}>
                    {stufe.icon}
                  </div>
                  {idx < STUFEN.length - 1 && (
                    <div style={{ width: '2px', height: '24px', background: 'var(--color-border)', margin: '4px 0' }} />
                  )}
                </div>

                {/* Inhalt */}
                <div style={{
                  flex:         1,
                  background:   'white',
                  borderRadius: 'var(--radius-xl)',
                  padding:      'var(--space-md) var(--space-lg)',
                  boxShadow:    'var(--shadow-sm)',
                  border:       `1px solid ${stufe.available ? stufe.color : 'var(--color-border)'}`,
                  borderLeft:   `5px solid ${stufe.available ? stufe.color : 'var(--color-border)'}`,
                  marginBottom: idx < STUFEN.length - 1 ? 0 : 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <div style={{
                      background:   stufe.colorLight,
                      color:        stufe.color,
                      borderRadius: 'var(--radius-pill)',
                      padding:      '3px 12px',
                      fontSize:     'var(--font-size-xs)',
                      fontWeight:   800,
                    }}>
                      Klasse {stufe.grade}
                    </div>
                    <h3 style={{ margin: 0, color: stufe.available ? stufe.color : 'var(--color-text-muted)', fontSize: '1.05rem' }}>
                      Stufe {stufe.stufe}: {stufe.title}
                    </h3>
                    {!stufe.available && (
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        In Entwicklung
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    {stufe.subtitle}
                  </p>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                    {stufe.description}
                  </p>
                  {stufe.available && (
                    <div style={{ marginTop: '10px' }}>
                      <button className="btn btn-primary" onClick={() => setShowJoin(true)}
                        style={{ background: stufe.color, fontSize: '0.9rem', padding: '10px 20px', minHeight: '40px' }}>
                        Jetzt starten →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Code-System Erklärung ── */}
        <div style={{
          background:   'linear-gradient(135deg, #103d54, #095c6b)',
          color:        'white',
          borderRadius: 'var(--radius-2xl)',
          padding:      'clamp(24px, 4vw, 40px)',
          marginBottom: 'var(--space-xl)',
        }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>Jahrgangübergreifend</div>
          <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>
            🏅 Deine Kompetenzen bleiben erhalten
          </h2>
          <p style={{ opacity: 0.9, marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
            Nach dem Abschluss einer Stufe erhältst du eine Urkunde mit einem persönlichen Code.
            Diesen Code gibst du beim Start der nächsten Stufe ein – und das System weiß sofort,
            was du bereits gelernt hast.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
            {[
              { step: '1', icon: '📚', text: 'Klasse 7: Alle Module abschließen' },
              { step: '2', icon: '🏅', text: 'Urkunde mit Code erhalten' },
              { step: '3', icon: '📱', text: 'Code in Klasse 8 eingeben' },
              { step: '4', icon: '🚀', text: 'Auf Vorwissen aufbauen' },
            ].map(s => (
              <div key={s.step} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', opacity: 0.7, marginBottom: '4px' }}>SCHRITT {s.step}</div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{s.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', fontSize: '0.85rem', opacity: 0.85 }}>
            🔒 <strong>Datenschutz:</strong> Der Code enthält keine persönlichen Daten –
            nur Informationen darüber, welche Module bestanden wurden.
            Format: <code style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>KI-7-ABCD-X4</code>
          </div>
        </div>

        {/* ── Footer-Links ── */}
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', paddingBottom: 'var(--space-xl)' }}>
          <Link to="/datenschutz" style={{ color: 'var(--color-text-muted)', marginRight: '20px' }}>🔒 Datenschutz</Link>
          <Link to="/lehrer" style={{ color: 'var(--color-text-muted)' }}>👩‍🏫 Lehrkraft-Anmeldung</Link>
        </div>
      </div>
    </div>
  )
}