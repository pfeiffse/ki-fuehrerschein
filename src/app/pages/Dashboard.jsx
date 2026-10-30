// KI-Fuehrerschein - Schüler-Dashboard

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODULES, REQUIRED_MODULE_IDS, getAchievementsLocal, allRequiredPassed, saveAchievementLocal } from '../../lib/achievements.js'
import { applyCode } from '../../lib/levelCode.js'
import { loadAllProgress } from '../../lib/progress.js'

export default function Dashboard({ student }) {
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState({})
  const [eligible,     setEligible]     = useState(false)
  const [codeInput,    setCodeInput]    = useState('')
  const [codeResult,   setCodeResult]   = useState(null)
  const [showCode,     setShowCode]     = useState(false)
  const [syncing,      setSyncing]      = useState(false)

  function reloadLocal() {
    setAchievements(getAchievementsLocal())
    setEligible(allRequiredPassed())
  }

  async function reloadFromSupabase() {
    setSyncing(true)
    try {
      const progress = await loadAllProgress()
      progress.forEach(p => {
        if (p.passed && p.module_id) saveAchievementLocal(p.module_id)
      })
    } catch {}
    reloadLocal()
    setSyncing(false)
  }

  useEffect(() => {
    reloadLocal()
    reloadFromSupabase()
  }, [])

  useEffect(() => {
    window.addEventListener('focus', reloadLocal)
    return () => window.removeEventListener('focus', reloadLocal)
  }, [])

  function handleCodeApply() {
    if (!codeInput.trim()) return
    const result = applyCode(codeInput.trim())
    setCodeResult(result)
    if (result.success) reloadLocal()
  }

  const passedCount = REQUIRED_MODULE_IDS.filter(id => achievements[id]).length
  const overallPct  = Math.round((passedCount / REQUIRED_MODULE_IDS.length) * 100)

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Hero */}
        <div className="hero">
          <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>KI-Führerschein · Klasse 7</div>
          <h1 style={{ margin: '0.5rem 0 0.375rem', fontSize: 'var(--font-size-2xl)' }}>
            Hallo, {student?.display_name ?? 'Schüler:in'}! 👋
          </h1>
          <p className="lead" style={{ margin: '0.25rem 0 1.25rem', opacity: 0.9 }}>
            Schließe alle vier Pflichtmodule ab, um deinen KI-Führerschein zu erhalten.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="hero-progress" style={{ flex: 1, minWidth: '10rem' }}>
              <div className="hero-progress-bar" style={{ width: `${overallPct}%` }}
                role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100}
                aria-label={`${passedCount} von ${REQUIRED_MODULE_IDS.length} Pflichtmodulen bestanden`} />
            </div>
            <div style={{ fontWeight: 800, color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              {syncing ? '🔄 Wird geladen …' : `${passedCount} / ${REQUIRED_MODULE_IDS.length} Pflichtmodule`}
            </div>
          </div>
        </div>

        {/* Vorleistungs-Code */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          {!showCode ? (
            <button className="btn btn-ghost" onClick={() => setShowCode(true)}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.875rem', minHeight: '2.25rem' }}>
              🏅 Vorleistungs-Code eingeben
            </button>
          ) : (
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', border: '1px solid var(--color-gold-dark)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="text" value={codeInput}
                  onChange={e => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="KI-7-ABCD-X4" maxLength={20}
                  aria-label="Vorleistungs-Code"
                  style={{ flex: 1, minWidth: '10rem', padding: '0.625rem', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'monospace', fontWeight: 700 }} />
                <button className="btn btn-primary" onClick={handleCodeApply}
                  style={{ background: '#825300', minHeight: '2.75rem' }}>Einlösen</button>
                <button className="btn btn-ghost" onClick={() => { setShowCode(false); setCodeResult(null); setCodeInput('') }}
                  style={{ minHeight: '2.75rem' }} aria-label="Schließen">✕</button>
              </div>
              {codeResult && (
                <div className={`feedback ${codeResult.success ? 'correct' : 'wrong'}`} style={{ display: 'block', marginTop: '0.5rem' }}>
                  {codeResult.success
                    ? `✅ ${codeResult.moduleIds.length} Achievement(s) aus Jahrgang ${codeResult.grade} übernommen!`
                    : `❌ ${codeResult.error}`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zertifikat-Banner */}
        {eligible ? (
          <div style={{
            background: 'linear-gradient(120deg, #825300, #b8860b)', color: 'white',
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg) var(--space-xl)',
            marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)',
            boxShadow: '0 0.5rem 1.5rem rgba(184,134,11,0.25)',
          }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.25rem' }}>🏆 Herzlichen Glückwunsch!</div>
              <div style={{ opacity: 0.9 }}>Du hast alle Pflichtmodule bestanden. Dein KI-Führerschein wartet!</div>
            </div>
            <button className="btn" onClick={() => navigate('/zertifikat')}
              style={{ background: 'white', color: '#825300', fontWeight: 900, padding: '0.75rem 1.5rem' }}>
              Zertifikat öffnen →
            </button>
          </div>
        ) : (
          <div className="box-info" style={{ marginBottom: 'var(--space-lg)' }}>
            🔒 Das Zertifikat wird freigeschaltet, wenn du alle {REQUIRED_MODULE_IDS.length} Pflichtmodule abgeschlossen hast.
          </div>
        )}

        {/* Modulliste */}
        <h2 style={{ color: 'var(--color-platform)', marginBottom: 'var(--space-md)' }}>Deine Module</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {MODULES.map((mod, idx) => {
            const earned = !!achievements[mod.id]
            return (
              <div key={mod.id} className="card" style={{
                marginBottom: 0,
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap',
                borderLeft: `5px solid ${earned ? 'var(--color-success)' : mod.color}`,
                background: earned ? 'var(--color-success-light)' : 'white',
              }}>
                {/* Nummer */}
                <div style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '50%', flexShrink: 0,
                  background: earned ? 'var(--color-success)' : mod.colorLight,
                  color: earned ? 'white' : mod.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1rem',
                }}>
                  {earned ? '✓' : idx + 1}
                </div>

                {/* Icon */}
                <div style={{
                  fontSize: '1.8rem', flexShrink: 0,
                  background: earned ? 'rgba(26,107,58,0.12)' : mod.colorLight,
                  borderRadius: 'var(--radius-md)', width: '3.25rem', height: '3.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {mod.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '10rem' }}>
                  <h3 style={{ margin: '0 0 0.125rem', color: earned ? 'var(--color-success)' : mod.color, fontSize: '1rem' }}>
                    {mod.title}
                  </h3>
                  <p style={{ margin: '0 0 0.25rem', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    {mod.subtitle}
                  </p>
                  {earned && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3125rem',
                      background: 'var(--color-gold)', borderRadius: '99px',
                      padding: '0.1875rem 0.625rem', fontSize: 'var(--font-size-xs)', fontWeight: 800, color: '#7a5800',
                    }}>
                      {mod.achievement.icon} {mod.achievement.title}
                    </div>
                  )}
                </div>

                {/* Button */}
                <div>
                  <button className="btn btn-primary" onClick={() => navigate(mod.path)}
                    style={{ background: earned ? 'var(--color-success)' : mod.color }}>
                    {earned ? 'Wiederholen' : 'Starten →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}