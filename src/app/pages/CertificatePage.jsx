// ============================================================
// KI-Führerschein · Zertifikatsseite
// - Gesperrt bis alle 4 Pflichtmodule bestanden
// - Name, 4 Achievements, persönlicher Merksatz
// - Vorleistungs-Code für nächste Klassenstufe
// - Druckansicht + PDF-Speicherung (A4 Landscape)
// - Alle Daten nur lokal – keine externen Dienste
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MODULES, REQUIRED_MODULE_IDS,
  getAchievementsLocal, allRequiredPassed,
  saveMerksatz, getMerksatz, getStudentName,
} from '../../lib/achievements.js'
import { generateCode } from '../../lib/levelCode.js'

const REQUIRED_MODULES = MODULES.filter(m => !m.optional)

export default function CertificatePage() {
  const navigate = useNavigate()

  const [eligible,      setEligible]      = useState(false)
  const [achievements,  setAchievements]  = useState({})
  const [merksatz,      setMerksatzState] = useState('')
  const [merksatzSaved, setMerksatzSaved] = useState(false)
  const [studentName,   setStudentName]   = useState('')
  const [today,         setToday]         = useState('')
  const [levelCode,     setLevelCode]     = useState('')

  useEffect(() => {
    const ach  = getAchievementsLocal()
    const name = getStudentName()
    const ms   = getMerksatz()
    const ok   = allRequiredPassed()
    const date = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

    setAchievements(ach)
    setStudentName(name)
    setMerksatzState(ms)
    setEligible(ok)
    setToday(date)

    const passedIds = REQUIRED_MODULE_IDS.filter(id => ach[id])
    if (passedIds.length > 0) setLevelCode(generateCode(7, passedIds))
  }, [])

  function handleSaveMerksatz() {
    saveMerksatz(merksatz)
    setMerksatzSaved(true)
    setTimeout(() => setMerksatzSaved(false), 2000)
  }

  // ── Nicht berechtigt ──────────────────────────────────────

  if (!eligible) {
    const earnedCount = REQUIRED_MODULE_IDS.filter(id => achievements[id]).length
    return (
      <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
        <div className="wrap" style={{ maxWidth: '600px' }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🔒</div>
            <h1 style={{ color: 'var(--color-platform-teal)' }}>Zertifikat noch gesperrt</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
              Du hast {earnedCount} von {REQUIRED_MODULE_IDS.length} Pflichtmodulen abgeschlossen.
              Schließe alle vier Pflichtmodule ab, um dein Zertifikat zu erhalten.
            </p>
            {REQUIRED_MODULES.map(mod => {
              const earned = !!achievements[mod.id]
              return (
                <div key={mod.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '8px',
                  background: earned ? 'var(--color-success-light)' : '#f5f9fc',
                  border: `1px solid ${earned ? 'var(--color-success)' : 'var(--color-border)'}`,
                  textAlign: 'left',
                }}>
                  <span style={{ fontSize: '1.4rem' }}>{earned ? '✅' : '⬜'}</span>
                  <div>
                    <div style={{ fontWeight: 800, color: earned ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {mod.achievement.icon} {mod.achievement.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {mod.title}
                    </div>
                  </div>
                </div>
              )
            })}
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}
              style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
              ← Zurück zur Modulübersicht
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Zertifikat freigeschaltet ─────────────────────────────

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>

      {/* Steuerbereich – beim Drucken ausgeblendet */}
      <div className="no-print wrap" style={{ maxWidth: '960px', paddingBottom: 0 }}>
        <div className="card" style={{ marginBottom: 'var(--space-md)' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', color: 'var(--color-platform-teal)' }}>🏆 Dein KI-Führerschein</h2>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Alle Pflichtmodule bestanden! Füge deinen persönlichen Merksatz hinzu und drucke dein Zertifikat.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => window.print()}
              style={{ fontSize: '1rem', padding: '14px 24px' }}>
              🖨️ Drucken / Als PDF speichern
            </button>
          </div>

          {/* Vorleistungs-Code */}
          {levelCode && (
            <div style={{ marginTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-lg)' }}>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                🏅 Dein Vorleistungs-Code für die nächste Klassenstufe
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{
                  fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 900,
                  letterSpacing: '0.1em', background: '#fff8db',
                  border: '2px solid var(--color-gold-dark)', borderRadius: 'var(--radius-md)',
                  padding: '10px 20px', color: '#825300',
                }}>
                  {levelCode}
                </div>
                <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(levelCode)}
                  style={{ fontSize: '0.85rem', padding: '8px 14px', minHeight: '38px' }}>
                  📋 Kopieren
                </button>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                Dieser Code wird auch auf dem Zertifikat gedruckt. Gib ihn beim Start der nächsten Klassenstufe ein.
                Er enthält keine persönlichen Daten.
              </p>
            </div>
          )}

          {/* Merksatz */}
          <div style={{ marginTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-lg)' }}>
            <label htmlFor="merksatz" style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
              💬 Dein persönlicher Merksatz
            </label>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
              Was nimmst du aus dem KI-Führerschein mit? Formuliere deinen eigenen Merksatz – er erscheint auf dem Zertifikat.
            </p>
            <textarea
              id="merksatz"
              value={merksatz}
              onChange={e => setMerksatzState(e.target.value)}
              placeholder="z. B. KI ist ein Werkzeug – ich entscheide, wie ich es einsetze."
              rows={3}
              maxLength={200}
              style={{
                width: '100%', padding: '12px',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                font: 'inherit', fontSize: '1rem',
                resize: 'vertical', lineHeight: 1.6,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <button className="btn btn-success" onClick={handleSaveMerksatz}
                style={{ fontSize: '0.9rem', padding: '10px 18px', minHeight: '40px' }}>
                {merksatzSaved ? '✓ Gespeichert!' : 'Merksatz speichern'}
              </button>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {merksatz.length} / 200 Zeichen · Wird nur lokal gespeichert
              </span>
            </div>
          </div>
        </div>

        <button className="btn btn-ghost no-print" onClick={() => navigate('/dashboard')}
          style={{ marginBottom: 'var(--space-md)' }}>
          ← Zur Übersicht
        </button>
      </div>

      {/* ── Zertifikat (wird gedruckt) ── */}
      <div style={{
        width: 'min(92vw, 950px)', margin: '0 auto var(--space-2xl)',
        background: 'white', padding: '20px',
        boxShadow: '0 12px 35px #16495b22', borderRadius: 'var(--radius-xl)',
      }}>
        <div style={{
          minHeight: '580px',
          border: '8px solid #087f83',
          outline: '3px solid var(--color-gold)',
          outlineOffset: '-18px',
          padding: 'clamp(28px, 5vw, 50px) clamp(24px, 6vw, 60px) clamp(24px, 4vw, 40px)',
          textAlign: 'center',
          position: 'relative',
          background: 'radial-gradient(circle at 50% 0%, #e8f7f4, transparent 55%)',
          borderRadius: 'var(--radius-lg)',
        }}>

          {/* Eyebrow */}
          <div style={{ fontWeight: 800, letterSpacing: '3px', color: '#087f83', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>
            KI-Führerschein · Klasse 7
          </div>

          {/* Symbol */}
          <div style={{ fontSize: '3rem', margin: '8px 0' }} aria-hidden="true">🤖 🏅 🌍</div>

          {/* Titel */}
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#095c6b', letterSpacing: '1px', margin: '6px 0 8px', fontFamily: 'inherit' }}>
            KI-FÜHRERSCHEIN
          </h1>

          <p style={{ fontSize: '1rem', color: '#536f7c', margin: '0 0 20px' }}>
            Zertifikat für einen kompetenten und verantwortungsvollen Umgang mit KI
          </p>

          {/* Name */}
          <div style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: '#16495b',
            margin: '20px auto 16px', borderBottom: '2px solid var(--color-gold)',
            maxWidth: '600px', paddingBottom: '10px', minHeight: '50px', overflowWrap: 'anywhere',
          }}>
            {studentName || 'Name der Schülerin / des Schülers'}
          </div>

          <p style={{ fontSize: '1rem', color: '#536f7c', margin: '0 0 24px', lineHeight: 1.6 }}>
            hat alle vier Pflichtmodule des KI-Führerscheins erfolgreich abgeschlossen<br />
            und dabei folgende Kompetenzen erworben:
          </p>

          {/* Achievement-Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', margin: '0 0 24px' }}>
            {REQUIRED_MODULES.map(mod => (
              <div key={mod.id} style={{
                background: '#dff5f1', border: '1px solid #b6e1da',
                borderRadius: '99px', padding: '8px 16px',
                fontSize: '0.88rem', fontWeight: 800, color: '#095c6b',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span>{mod.achievement.icon}</span>
                <span>{mod.achievement.title}</span>
              </div>
            ))}
          </div>

          {/* Persönlicher Merksatz */}
          {merksatz && (
            <div style={{
              margin: '0 auto 24px', padding: '16px 24px',
              background: '#f0fafb', borderLeft: '5px solid var(--color-gold)',
              maxWidth: '680px', fontWeight: 700, fontSize: '1rem',
              lineHeight: 1.6, textAlign: 'left',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0', color: '#163348',
            }}>
              „{merksatz}"
            </div>
          )}

          {/* Fußzeile */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', marginTop: '28px', fontSize: '0.88rem', textAlign: 'left', flexWrap: 'wrap' }}>
            <div style={{ borderTop: '1px solid #7196a7', minWidth: '180px', paddingTop: '8px' }}>
              Datum: {today}
            </div>
            <div style={{ borderTop: '1px solid #7196a7', minWidth: '180px', paddingTop: '8px' }}>
              Unterschrift der Lehrkraft
            </div>
          </div>

          {/* Vorleistungs-Code auf Urkunde */}
          {levelCode && (
            <div style={{
              marginTop: '20px', padding: '10px 16px',
              background: '#fff8db', border: '1px solid #ffda76',
              borderRadius: 'var(--radius-md)', display: 'inline-block',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#825300', fontWeight: 700, marginRight: '8px' }}>
                🏅 Vorleistungs-Code für Klasse 8:
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.1em', color: '#825300' }}>
                {levelCode}
              </span>
            </div>
          )}

          {/* Tiny Footer */}
          <div style={{ fontSize: '0.75rem', color: '#547080', marginTop: '16px' }}>
            KI-Führerschein · Klasse 7 · Alle vier Pflichtmodule bestanden
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { size: A4 landscape; margin: 9mm; }
        }
      `}</style>
    </div>
  )
}