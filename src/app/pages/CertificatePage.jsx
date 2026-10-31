// CertificatePage - Zertifikat mit A4-Druckoptimierung und SLZB-Logo

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODULES, REQUIRED_MODULE_IDS, getAchievementsLocal, allRequiredPassed, saveMerksatz, getMerksatz, getStudentName } from '../../lib/achievements.js'
import { generateCode } from '../../lib/levelCode.js'

const REQUIRED = MODULES.filter(m => !m.optional)
const BASE = import.meta.env.BASE_URL

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
    <>
      {/* ── Steuerbereich (nur am Bildschirm, nicht beim Drucken) ── */}
      <div className="no-print" style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.375rem' }}>💬 Dein persönlicher Merksatz</label>
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
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>{merksatz.length}/200 · Nur lokal gespeichert</span>
              </div>
            </div>

            {levelCode && (
              <div style={{ padding: '0.875rem', background: '#fff8db', border: '2px solid var(--c-xp)', borderRadius: 'var(--r-lg)' }}>
                <div style={{ fontWeight: 800, marginBottom: '0.375rem', fontSize: 'var(--fs-sm)' }}>🏅 Vorleistungs-Code für Klasse 8:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <code style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.1em', color: '#92400e' }}>{levelCode}</code>
                  <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(levelCode)}
                    style={{ fontSize: 'var(--fs-xs)', padding: '0.25rem 0.625rem', minHeight: '2rem' }}>📋 Kopieren</button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}
              style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)' }}>
              ← Zur Übersicht
            </button>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-xs)' }}>
              💡 Zeige diese Seite deiner Lehrkraft zum Drucken
            </span>
          </div>
        </div>
      </div>

      {/* ── URKUNDE ── */}
      {/* Am Bildschirm: Vorschau */}
      <div className="cert-screen-wrapper" style={{ background: '#e8e8e8', padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <Certificate
          studentName={studentName}
          merksatz={merksatz}
          levelCode={levelCode}
          today={today}
          achievements={achievements}
          base={BASE}
        />
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          /* Alles ausblenden außer der Urkunde */
          .no-print { display: none !important; }
          .cert-screen-wrapper { 
            background: white !important; 
            padding: 0 !important;
            display: block !important;
          }
          body { 
            margin: 0 !important; 
            padding: 0 !important;
            background: white !important;
          }
          /* A4 Hochformat */
          @page { 
            size: A4 portrait; 
            margin: 0;
          }
          /* Urkunde füllt genau eine A4-Seite */
          .cert-page {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 12mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          .cert-inner {
            height: calc(297mm - 24mm) !important;
          }
        }
      `}</style>
    </>
  )
}

// Urkunden-Komponente (separat für saubere Drucklogik)
function Certificate({ studentName, merksatz, levelCode, today, achievements, base }) {
  return (
    <div className="cert-page" style={{
      width: '210mm',
      maxWidth: '100%',
      background: 'white',
      boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      borderRadius: '8px',
      padding: '12mm',
      boxSizing: 'border-box',
    }}>
      <div className="cert-inner" style={{
        border: '6px solid #087f83',
        outline: '2px solid #ffda76',
        outlineOffset: '-12px',
        padding: '8mm 10mm',
        height: 'calc(297mm - 24mm)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at 50% 0%, #e8f7f4 0%, white 60%)',
        position: 'relative',
      }}>

        {/* Logo oben rechts */}
        <div style={{ position: 'absolute', top: '8mm', right: '8mm' }}>
          <img
            src={base + 'slzb-ki-logo.png'}
            alt="SLZB KI Logo"
            style={{ width: '28mm', height: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>

        {/* Oberer Teil */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontWeight: 800, letterSpacing: '2px', color: '#087f83', fontSize: '9pt', textTransform: 'uppercase', marginBottom: '3mm' }}>
            KI-Führerschein · Klasse 7
          </div>
          <div style={{ fontSize: '28pt', margin: '2mm 0' }}>🤖 🏅 🌍</div>
          <h1 style={{ fontSize: '28pt', color: '#095c6b', letterSpacing: '1px', margin: '2mm 0 3mm', fontFamily: 'inherit', lineHeight: 1.1 }}>
            KI-FÜHRERSCHEIN
          </h1>
          <p style={{ fontSize: '10pt', color: '#536f7c', margin: '0 0 6mm' }}>
            Zertifikat für einen kompetenten und verantwortungsvollen Umgang mit KI
          </p>

          {/* Name */}
          <div style={{ fontSize: '20pt', fontWeight: 900, color: '#16495b', margin: '0 auto 5mm', borderBottom: '2px solid #ffda76', maxWidth: '140mm', paddingBottom: '3mm', minHeight: '12mm', overflowWrap: 'anywhere' }}>
            {studentName || 'Name der Schülerin / des Schülers'}
          </div>

          <p style={{ fontSize: '10pt', color: '#536f7c', margin: '0 0 5mm', lineHeight: 1.5 }}>
            hat alle vier Pflichtmodule des KI-Führerscheins erfolgreich abgeschlossen<br/>
            und dabei folgende Kompetenzen erworben:
          </p>

          {/* Achievement-Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3mm', margin: '0 0 5mm' }}>
            {MODULES.filter(m => !m.optional).map(mod => (
              <div key={mod.id} style={{ background: '#dff5f1', border: '1px solid #b6e1da', borderRadius: '99px', padding: '2mm 5mm', fontSize: '9pt', fontWeight: 800, color: '#095c6b', display: 'flex', alignItems: 'center', gap: '2mm' }}>
                <span>{mod.achievement.icon}</span><span>{mod.achievement.title}</span>
              </div>
            ))}
          </div>

          {/* Persönlicher Merksatz */}
          {merksatz && (
            <div style={{ margin: '0 auto 5mm', padding: '4mm 6mm', background: '#f0fafb', borderLeft: '4px solid #ffda76', maxWidth: '140mm', fontWeight: 700, fontSize: '10pt', lineHeight: 1.5, textAlign: 'left', color: '#163348' }}>
              „{merksatz}"
            </div>
          )}

          {/* Vorleistungs-Code */}
          {levelCode && (
            <div style={{ display: 'inline-block', padding: '2mm 5mm', background: '#fff8db', border: '1px solid #ffda76', borderRadius: '4px', marginBottom: '4mm' }}>
              <span style={{ fontSize: '8pt', color: '#825300', fontWeight: 700, marginRight: '3mm' }}>🏅 Vorleistungs-Code für Klasse 8:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '11pt', letterSpacing: '0.1em', color: '#825300' }}>{levelCode}</span>
            </div>
          )}
        </div>

        {/* Unterer Teil – Datum und Unterschrift */}
        <div style={{ marginTop: 'auto', paddingTop: '6mm' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15mm', alignItems: 'flex-end' }}>

            {/* Datum */}
            <div style={{ minWidth: '45mm' }}>
              <div style={{ fontSize: '9pt', color: '#536f7c', marginBottom: '2mm' }}>Datum</div>
              <div style={{ fontWeight: 700, fontSize: '11pt', marginBottom: '2mm' }}>{today}</div>
              <div style={{ borderTop: '1px solid #7196a7', paddingTop: '1mm' }}></div>
            </div>

            {/* Unterschrift */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '9pt', color: '#536f7c', marginBottom: '14mm' }}>Unterschrift der Lehrkraft</div>
              <div style={{ borderTop: '1px solid #7196a7', paddingTop: '2mm' }}>
                <div style={{ fontSize: '8pt', color: '#7196a7' }}>Stempel / Unterschrift</div>
              </div>
            </div>

            {/* Logo unten rechts (Wiederholung für Druck) */}
            <div style={{ minWidth: '20mm', textAlign: 'right' }}>
              <img
                src={base + 'slzb-ki-logo.png'}
                alt="SLZB KI"
                style={{ width: '18mm', height: 'auto', objectFit: 'contain', opacity: 0.7 }}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '7pt', color: '#547080', marginTop: '4mm' }}>
            KI-Führerschein · Klasse 7 · Alle vier Pflichtmodule bestanden · SLZB
          </div>
        </div>
      </div>
    </div>
  )
}