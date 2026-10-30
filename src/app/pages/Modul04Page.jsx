// ============================================================
// KI-Führerschein · Modul 04 – KI & Nachhaltigkeit
// Basiert auf: legacy/KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html
// Übergabedokument: KI_Nachhaltigkeit_Modul_Uebergabe_KI.md
// 5 Stationen, Stationssperre, 5 Achievements, persistenter Fortschritt
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { startModule, passModule, updateModuleProgress } from '../../lib/progress.js'
import { MemoryBox, InfoBox, WarningBox } from '../../components/ui/InfoBox.jsx'
import Station1 from '../../modules/modul-04/Station1.jsx'
import Station2 from '../../modules/modul-04/Station2.jsx'
import Station3 from '../../modules/modul-04/Station3.jsx'
import Station4 from '../../modules/modul-04/Station4.jsx'
import Station5 from '../../modules/modul-04/Station5.jsx'

const MOD       = getModule('modul-04')
const MOD_COLOR = '#087f83'
const STORAGE_KEY = 'ki_m04_v2'

// ── Persistenter Fortschritt ──────────────────────────────────

function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY)
    if (r) return JSON.parse(r)
  } catch {}
  return {
    version: 1,
    module: 'ki-nachhaltigkeit',
    station1Complete: false,
    completed: [],   // abgeschlossene Stationen (1-5)
    awarded: [],     // vergebene Achievements
    currentStation: 'home',
  }
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

// ── Achievements ──────────────────────────────────────────────

const ACHIEVEMENTS = {
  1: { id: 'ressourcen-profi',      icon: '🔍', title: 'Ressourcen-Profi',      desc: 'Alle 12 Informationskarten gelesen und verstanden.' },
  2: { id: 'ki-durchblicker',       icon: '🎬', title: 'KI-Durchblicker',       desc: 'Den Filmcheck erfolgreich abgeschlossen.' },
  3: { id: 'wasser-detektiv',       icon: '💧', title: 'Wasser-Detektiv',       desc: 'Den Wasserverbrauch von KI-Anfragen untersucht.' },
  4: { id: 'energie-checker',       icon: '🔋', title: 'Energie-Checker',       desc: 'Den Energiebedarf von KI-Anfragen berechnet.' },
  5: { id: 'ki-zukunftsgestalter',  icon: '🌱', title: 'KI-Zukunftsgestalter', desc: 'KI-Nutzung im Alltag reflektiert und eine persönliche Regel formuliert.' },
}

export default function Modul04Page() {
  const navigate = useNavigate()
  const [state,    setState]    = useState(null)
  const [achieved, setAchieved] = useState(false)
  const [showAchievement, setShowAchievement] = useState(null)

  

  function updateState(updates) {
    setState(prev => {
      const next = { ...prev, ...updates }
      saveState(next)
      return next
    })
  }

  function goStation(n) {
    updateState({ currentStation: n === 'home' ? 'home' : n })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  

  function resetModule() {
    if (!confirm('Modul wirklich neu starten? Dein gesamter Fortschritt wird gelöscht.')) return
    const fresh = loadState()
    fresh.station1Complete = false
    fresh.completed = []
    fresh.awarded = []
    fresh.currentStation = 'home'
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    setState(fresh)
    setAchieved(false)
  }

  if (!state) return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap"><p style={{ color: 'var(--color-text-muted)' }}>Modul wird geladen …</p></div>
    </div>
  )

  const { station1Complete, completed, awarded, currentStation } = state
  const progress = Math.round((completed.length / 5) * 100)

  // Stationen gesperrt bis Station 1 abgeschlossen
  function isLocked(n) { return n > 1 && !station1Complete }

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* ── Achievement-Overlay ── */}
        {showAchievement && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 'var(--space-lg)',
          }}
            onClick={() => setShowAchievement(null)}
            role="dialog" aria-modal="true" aria-label="Achievement freigeschaltet">
            <div style={{
              background: '#fff8db', border: '3px solid var(--color-gold-dark)',
              borderRadius: 'var(--radius-2xl)', padding: 'var(--space-2xl)',
              textAlign: 'center', maxWidth: '400px', width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>{showAchievement.icon}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#825300', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Achievement freigeschaltet!
              </div>
              <h2 style={{ color: '#825300', margin: '0 0 8px' }}>{showAchievement.title}</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>{showAchievement.desc}</p>
              <button className="btn btn-primary" onClick={() => setShowAchievement(null)}
                style={{ background: MOD_COLOR, width: '100%', justifyContent: 'center' }}
                autoFocus>
                Weiter →
              </button>
            </div>
          </div>
        )}

        {/* ── Modulkopf ── */}
        <header className="hero" style={{ background: 'linear-gradient(120deg, #063a45, #087f83)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 4</div>
              <h1 style={{ margin: '8px 0 6px' }}>🌍 KI & Nachhaltigkeit</h1>
              <p className="lead" style={{ margin: '4px 0 4px', opacity: 0.9 }}>
                <strong>Leitfrage:</strong> Wann ist der Nutzen einer KI-Anwendung den Einsatz von Ressourcen wert?
              </p>
              <p style={{ margin: '0 0 16px', opacity: 0.75, fontSize: 'var(--font-size-sm)' }}>
                Entdecken → Verstehen → Vergleichen → Rechnen → Entscheiden
              </p>
              <div className="hero-progress">
                <div className="hero-progress-bar" style={{ width: `${progress}%` }}
                  role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
          </div>
        </header>

        {/* ── Stations-Navigation ── */}
        <div className="station-tabs no-print">
          <button className={`nav-btn ${currentStation === 'home' ? 'active' : ''}`}
            onClick={() => goStation('home')}>Start</button>
          {[1,2,3,4,5].map(n => {
            const locked = isLocked(n)
            const done   = completed.includes(n)
            const labels = ['1·Ressourcen','2·Film','3·Wasser','4·Akku','5·Alltag']
            return (
              <button key={n}
                className={`nav-btn ${currentStation === n ? 'active' : ''}`}
                onClick={() => !locked && goStation(n)}
                disabled={locked}
                title={locked ? 'Erst Station 1 abschließen' : ''}
                style={{ opacity: locked ? 0.45 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}>
                {locked ? '🔒 ' : done ? '✓ ' : ''}{labels[n-1]}
              </button>
            )
          })}
        </div>

        {/* ── Achievements-Übersicht ── */}
        {awarded.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
            {awarded.map(n => (
              <div key={n} style={{
                background: '#fff8db', border: '1px solid var(--color-gold-dark)',
                borderRadius: 'var(--radius-pill)', padding: '4px 12px',
                fontSize: 'var(--font-size-xs)', fontWeight: 800, color: '#825300',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {ACHIEVEMENTS[n].icon} {ACHIEVEMENTS[n].title}
              </div>
            ))}
          </div>
        )}

        {/* ── Startseite ── */}
        {currentStation === 'home' && (
          <div className="card">
            <h2 style={{ color: MOD_COLOR }}>Entdecke die Umweltseite der KI!</h2>
            <p className="lead">Fünf Stationen zeigen dir, welche Ressourcen KI benötigt und wann sich ihr Einsatz wirklich lohnt.</p>

            <div style={{ background: '#f0fafb', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', marginBottom: 'var(--space-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: MOD_COLOR, marginBottom: '8px' }}>
                So rechnen wir in diesem Modul
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                <div>⚡ <strong>Energie pro Textanfrage:</strong> 0,3 Wh – <em>Modellannahme</em></div>
                <div>💧 <strong>Wasser für 1.000 Anfragen:</strong> 15 Liter – <em>didaktische Näherung</em></div>
                <div>🔋 <strong>Vergleichsakku:</strong> 15 Wh – <em>Beispielwert</em></div>
                <div style={{ marginTop: '6px', fontSize: 'var(--font-size-xs)' }}>
                  Tatsächliche Werte variieren stark je nach KI-Modell, Anfrage und Rechenzentrum. Diese Werte dienen der Veranschaulichung, nicht als exakte Vorhersage.
                </div>
              </div>
            </div>

            <InfoBox>
              Station 1 ist verpflichtend. Die Stationen 2–5 werden erst freigeschaltet, nachdem du alle 12 Verständnisfragen in Station 1 richtig beantwortet hast.
            </InfoBox>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', margin: 'var(--space-lg) 0' }}>
              {[
                { n: 1, icon: '🔍', label: 'Ressourcen', sub: 'Entdecken' },
                { n: 2, icon: '🎬', label: 'Film',       sub: 'Verstehen' },
                { n: 3, icon: '💧', label: 'Wasser',     sub: 'Vergleichen' },
                { n: 4, icon: '🔋', label: 'Akku',       sub: 'Rechnen' },
                { n: 5, icon: '🌱', label: 'KI im Alltag', sub: 'Entscheiden' },
              ].map(s => (
                <div key={s.n} style={{
                  background: completed.includes(s.n) ? 'var(--color-success-light)' : isLocked(s.n) ? '#f5f5f5' : 'white',
                  border: `1px solid ${completed.includes(s.n) ? 'var(--color-success)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', textAlign: 'center',
                  opacity: isLocked(s.n) ? 0.5 : 1,
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{completed.includes(s.n) ? '✅' : isLocked(s.n) ? '🔒' : s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{s.n}. {s.label}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="actions">
              <button className="btn btn-primary" onClick={() => goStation(1)} style={{ background: MOD_COLOR, fontSize: '1.05rem', padding: '14px 28px' }}>
                Station 1 starten →
              </button>
              <button className="btn btn-ghost" onClick={resetModule} style={{ fontSize: '0.85rem' }}>
                ↺ Neu starten
              </button>
            </div>
          </div>
        )}

        {/* ── Stationen ── */}
        {currentStation === 1 && (
          <Station1
            done={completed.includes(1)}
            onComplete={() => { completeStation(1); goStation(2) }}
          />
        )}
        {currentStation === 2 && !isLocked(2) && (
          <Station2
            done={completed.includes(2)}
            onComplete={() => { completeStation(2); goStation(3) }}
            onSkip={() => { completeStation(2); goStation(3) }}
          />
        )}
        {currentStation === 3 && !isLocked(3) && (
          <Station3
            done={completed.includes(3)}
            onComplete={() => { completeStation(3); goStation(4) }}
          />
        )}
        {currentStation === 4 && !isLocked(4) && (
          <Station4
            done={completed.includes(4)}
            onComplete={() => { completeStation(4); goStation(5) }}
          />
        )}
        {currentStation === 5 && !isLocked(5) && (
          <Station5
            done={completed.includes(5)}
            onComplete={() => { completeStation(5); goStation('home') }}
            achieved={achieved}
            onDashboard={() => navigate('/dashboard')}
          />
        )}

        {/* Gesperrt-Hinweis */}
        {typeof currentStation === 'number' && isLocked(currentStation) && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔒</div>
            <h2 style={{ color: MOD_COLOR }}>Station noch gesperrt</h2>
            <p>Schließe zuerst Station 1 ab, um diese Station freizuschalten.</p>
            <div className="actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => goStation(1)} style={{ background: MOD_COLOR }}>
                Zu Station 1 →
              </button>
            </div>
          </div>
        )}

        {/* Zurück-Navigation */}
        {currentStation !== 'home' && (
          <div className="actions no-print" style={{ marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-ghost" onClick={() => goStation(typeof currentStation === 'number' && currentStation > 1 ? currentStation - 1 : 'home')}>
              ← Zurück
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Zur Übersicht</button>
          </div>
        )}
      </div>
    </div>
  )
}