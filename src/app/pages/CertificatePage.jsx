// CertificatePage - Zertifikat
// Schüler: Merksatz eingeben, Vorschau sehen
// Druck: durch Lehrkraft/Admin (oder direkt)

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODULES, REQUIRED_MODULE_IDS, getAchievementsLocal, allRequiredPassed, saveMerksatz, getMerksatz, getStudentName } from '../../lib/achievements.js'
import { generateCode } from '../../lib/levelCode.js'

const REQUIRED = MODULES.filter(m => !m.optional)

export default function CertificatePage() {
  const navigate = useNavigate()
  const [eligible,  setEligible]  = useState(allRequiredPassed)
  const [merksatz,  setMerksatz]  = useState(getMerksatz)
  const [saved,     setSaved]     = useState(false)
  const [levelCode, setLevelCode] = useState('')
  const achievements = getAchievementsLocal()
  const studentName  = getStudentName()
  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

  useEffect(() => {
    const passedIds = REQUIRED_MODULE_IDS.filter(id => achievements[id])
    if (passedIds.length > 0) setLevelCode(generateCode(7, passedIds))
  }, [])

  function handleSave() {
    saveMerksatz(merksatz)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Nicht berechtigt
  if (!eligible) {
    const count = REQUIRED_MODULE_IDS.filter(id => achievements[id]).length
    return (
      <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2>Zertifikat noch gesperrt</h2>
          <p style={{ color: 'var(--c-muted)' }}>{count} von {REQUIRED_MODULE_IDS.length} Pflichtmodulen abgeschlossen.</p>
          {REQUIRED.map(mod => (
            <div key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', borderRadius: 'var(--r-md)', marginBottom: '0.5rem', background: achievements[mod.id] ? 'var(--c-success-bg)' : 'var(--c-pale2)', border: `1px solid ${achievements[mod.id] ? 'var(--c-success)' : 'var(--c-border)'}`, textAlign: 'left' }}>
              <span style={{ fontSize: '1.25rem' }}>{achievements[mod.id] ? '✅' : '⬜'}</span>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{mod.achievement.icon} {mod.achievement.title}</span>
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>← Zur Übersicht</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>

      {/* Steuerbereich – beim Drucken ausgeblendet */}
      <div className="no-print" style={{ maxWidth: '60rem', margin: '0 auto', padding: '1.5rem 1rem 0' }}>
        <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '1.5rem', marginBottom: '1rem', boxShadow: 'var(--sh-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: '0 0 0.25rem', color: 'var(--c-teal)' }}>🏆 Dein KI-Führerschein</h2>
              <p style={{ margin: 0, color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>
                Gib deinen persönlichen Merksatz ein. Das Drucken übernimmt deine Lehrkraft.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => window.print()} style={{ background: 'var(--c-teal)' }}>
              🖨️ Drucken / PDF
            </button>
          </div>

          {/* Merksatz-Eingabe */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.375rem' }}>
              💬 Dein persönlicher Merksatz
            </label>
            <p style={{ margin: '0 0 0.5rem', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
              Was nimmst du aus dem KI-Führerschein mit? Dieser Satz erscheint auf deiner Urkunde.
            </p>
            <textarea value={merksatz} onChange={e => setMerksatz(e.target.value)}
              placeholder="z. B. KI ist ein Werkzeug – ich entscheide, wie ich es einsetze."
              rows={3} maxLength={200}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-lg)', font: 'inherit', resize: 'vertical' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-success" onClick={handleSave}>
                {saved ? '✓ Gespeichert!' : 'Merksatz speichern'}
              </button>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>
                {merksatz.length}/200 · Nur lokal gespeichert
              </span>
            </div>
          </div>

          {/* Vorleistungs-Code */}
          {levelCode && (
            <div style={{ padding: '0.875rem', background: '#fff8db', border: '2px solid var(--c-xp)', borderRadius: 'var(--r-lg)' }}>
              <div style={{ fontWeight: 800, marginBottom: '0.375rem', fontSize: 'var(--fs-sm)' }}>
                🏅 Vorleistungs-Code für Klasse 8:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <code style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.1em', color: '#92400e' }}>{levelCode}</code>
                <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(levelCode)}
                  style={{ fontSize: 'var(--fs-xs)', padding: '0.25rem 0.625rem', minHeight: '2rem' }}>
                  📋 Kopieren
                </button>
              </div>
              <p style={{ margin: '0.375rem 0 0', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>
                Dieser Code erscheint auch auf der Urkunde. Kein Name enthalten – nur Modulinformationen.
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')} style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)' }}>← Zur Übersicht</button>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-xs)', alignSelf: 'center' }}>
            💡 Tipp: Zeige diese Seite deiner Lehrkraft zum Drucken
          </span>
        </div>
      </div>

      {/* ── URKUNDE (wird gedruckt) ── */}
      <div style={{ width: 'min(92vw, 950px)', margin: '0 auto 3rem', background: 'white', padding: '1.25rem', boxShadow: '0 12px 35px rgba(22,51,72,0.3)', borderRadius: 'var(--r-xl)' }}>
        <div style={{
          border: '8px solid #087f83',
          outline: '3px solid #ffda76',
          outlineOffset: '-18px',
          padding: 'clamp(2rem,5vw,3.5rem) clamp(1.75rem,6vw,4rem)',
          textAlign: 'center',
          position: 'relative',
          background: 'radial-gradient(circle at 50% 0%, #e8f7f4, transparent 55%)',
          borderRadius: 'var(--r-lg)',
          minHeight: '640px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Oberer Teil */}
          <div>
            <div style={{ fontWeight: 800, letterSpacing: '3px', color: '#087f83', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              KI-Führerschein · Klasse 7
            </div>
            <div style={{ fontSize: '3rem', margin: '0.5rem 0' }}>🤖 🏅 🌍</div>
            <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#095c6b', letterSpacing: '1px', margin: '0.375rem 0 0.5rem', fontFamily: 'inherit' }}>
              KI-FÜHRERSCHEIN
            </h1>
            <p style={{ fontSize: '1rem', color: '#536f7c', margin: '0 0 1.5rem' }}>
              Zertifikat für einen kompetenten und verantwortungsvollen Umgang mit KI
            </p>

            {/* Name */}
            <div style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, color: '#16495b', margin: '0 auto 1rem', borderBottom: '2px solid #ffda76', maxWidth: '600px', paddingBottom: '0.625rem', minHeight: '3.125rem', overflowWrap: 'anywhere' }}>
              {studentName || 'Name der Schülerin / des Schülers'}
            </div>

            <p style={{ fontSize: '1rem', color: '#536f7c', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
              hat alle vier Pflichtmodule des KI-Führerscheins erfolgreich abgeschlossen<br/>
              und dabei folgende Kompetenzen erworben:
            </p>

            {/* Achievement-Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.625rem', margin: '0 0 1.25rem' }}>
              {REQUIRED.map(mod => (
                <div key={mod.id} style={{ background: '#dff5f1', border: '1px solid #b6e1da', borderRadius: '99px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 800, color: '#095c6b', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span>{mod.achievement.icon}</span><span>{mod.achievement.title}</span>
                </div>
              ))}
            </div>

            {/* Persönlicher Merksatz */}
            {merksatz && (
              <div style={{ margin: '0 auto 1.25rem', padding: '1rem 1.5rem', background: '#f0fafb', borderLeft: '5px solid #ffda76', maxWidth: '680px', fontWeight: 700, fontSize: '1rem', lineHeight: 1.6, textAlign: 'left', borderRadius: '0 var(--r-md) var(--r-md) 0', color: '#163348' }}>
                „{merksatz}"
              </div>
            )}
          </div>

          {/* Unterer Teil – Datum und Unterschrift mit viel Platz */}
          <div>
            {/* Vorleistungs-Code */}
            {levelCode && (
              <div style={{ marginBottom: '2rem', padding: '0.625rem 1rem', background: '#fff8db', border: '1px solid #ffda76', borderRadius: 'var(--r-md)', display: 'inline-block' }}>
                <span style={{ fontSize: '0.75rem', color: '#825300', fontWeight: 700, marginRight: '0.5rem' }}>
                  🏅 Vorleistungs-Code für Klasse 8:
                </span>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.1em', color: '#825300' }}>
                  {levelCode}
                </span>
              </div>
            )}

            {/* Datum und Unterschrift – großzügiger Abstand */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '3rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '12rem' }}>
                <div style={{ borderTop: '1px solid #7196a7', paddingTop: '0.75rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.875rem', color: '#536f7c', marginBottom: '0.25rem' }}>Datum</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{today}</div>
                </div>
              </div>
              <div style={{ flex: 2, minWidth: '16rem' }}>
                <div style={{ borderTop: '1px solid #7196a7', paddingTop: '0.75rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.875rem', color: '#536f7c', marginBottom: '2.5rem' }}>Unterschrift der Lehrkraft</div>
                  <div style={{ borderBottom: '1px solid #7196a7', marginBottom: '0.25rem' }}></div>
                  <div style={{ fontSize: '0.75rem', color: '#7196a7' }}>Stempel / Unterschrift</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#547080', marginTop: '1.25rem' }}>
              KI-Führerschein · Klasse 7 · Alle vier Pflichtmodule bestanden
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          @page { size: A4 landscape; margin: 8mm; }
          div[style*="min-height: 640px"] {
            min-height: 0 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}