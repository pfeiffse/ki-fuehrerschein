// ============================================================
// KI-Führerschein · Schüler-Dashboard
// Alle 4 Module erreichbar + Achievement-Anzeige + Zertifikat
// ============================================================

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODULES, REQUIRED_MODULE_IDS, getAchievementsLocal, allRequiredPassed } from '../../lib/achievements.js'

const STATUS_CONFIG = {
  earned:      { label: 'Bestanden ✓',       color: '#21875d', dot: '✓', bg: 'var(--color-success-light)' },
  not_earned:  { label: 'Noch nicht begonnen', color: '#8899aa', dot: '○', bg: 'white' },
}

export default function Dashboard({ student }) {
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState({})
  const [eligible,     setEligible]     = useState(false)

  useEffect(() => {
    const ach = getAchievementsLocal()
    setAchievements(ach)
    setEligible(allRequiredPassed())
  }, [])

  // Bei jedem Fokus neu laden (nach Rückkehr vom Modul)
  useEffect(() => {
    function onFocus() {
      const ach = getAchievementsLocal()
      setAchievements(ach)
      setEligible(allRequiredPassed())
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const requiredModules = MODULES.filter(m => !m.optional)
  const passedCount     = REQUIRED_MODULE_IDS.filter(id => achievements[id]).length
  const overallPct      = Math.round((passedCount / REQUIRED_MODULE_IDS.length) * 100)

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Hero */}
        <div className="hero">
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein · Klasse 7</div>
          <h1 style={{ margin: '8px 0 6px', fontSize: 'var(--font-size-2xl)' }}>
            Hallo, {student?.display_name ?? 'Schüler:in'}! 👋
          </h1>
          <p style={{ margin: '4px 0 20px', opacity: 0.9 }}>
            Schließe alle vier Pflichtmodule ab, um deinen KI-Führerschein zu erhalten.
          </p>

          {/* Gesamtfortschritt */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <div className="progress-shell" style={{ height: '13px' }}>
                <div className="progress-bar" style={{ width: `${overallPct}%` }}
                  role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              {passedCount} / {REQUIRED_MODULE_IDS.length} Pflichtmodule
            </div>
          </div>
        </div>

        {/* Zertifikat-Banner */}
        {eligible ? (
          <div style={{
            background:   'linear-gradient(120deg, #825300, #b8860b)',
            color:        'white',
            borderRadius: 'var(--radius-xl)',
            padding:      'var(--space-lg) var(--space-xl)',
            marginBottom: 'var(--space-lg)',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'space-between',
            flexWrap:     'wrap',
            gap:          'var(--space-md)',
            boxShadow:    '0 8px 24px #b8860b40',
          }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '4px' }}>
                🏆 Herzlichen Glückwunsch!
              </div>
              <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                Du hast alle Pflichtmodule bestanden. Dein KI-Führerschein wartet auf dich!
              </div>
            </div>
            <button className="btn" onClick={() => navigate('/zertifikat')}
              style={{ background: 'white', color: '#825300', fontWeight: 900, padding: '12px 24px' }}>
              Zertifikat öffnen →
            </button>
          </div>
        ) : (
          <div className="box-info" style={{ marginBottom: 'var(--space-lg)' }}>
            🔒 Das Zertifikat wird freigeschaltet, wenn du alle {REQUIRED_MODULE_IDS.length} Pflichtmodule abgeschlossen hast.
          </div>
        )}

        {/* Pflichtmodule */}
        <h2 style={{ color: 'var(--color-platform)', marginBottom: 'var(--space-md)' }}>
          Pflichtmodule
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          {requiredModules.map((mod, idx) => {
            const earned = !!achievements[mod.id]
            return (
              <div key={mod.id} className="card" style={{
                marginBottom: 0,
                display:      'flex',
                alignItems:   'center',
                gap:          'var(--space-md)',
                flexWrap:     'wrap',
                borderLeft:   `5px solid ${earned ? 'var(--color-success)' : mod.color}`,
                background:   earned ? 'var(--color-success-light)' : 'white',
              }}>
                {/* Nummer */}
                <div style={{
                  width:          '36px',
                  height:         '36px',
                  borderRadius:   '50%',
                  background:     earned ? 'var(--color-success)' : mod.colorLight,
                  color:          earned ? 'white' : mod.color,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontWeight:     900,
                  fontSize:       '1rem',
                  flexShrink:     0,
                }}>
                  {earned ? '✓' : idx + 1}
                </div>

                {/* Icon */}
                <div style={{
                  fontSize:       '1.8rem',
                  background:     earned ? 'rgba(33,135,93,0.15)' : mod.colorLight,
                  borderRadius:   'var(--radius-md)',
                  width:          '52px',
                  height:         '52px',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  flexShrink:     0,
                }}>
                  {mod.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <h3 style={{ margin: '0 0 2px', color: earned ? 'var(--color-success)' : mod.color, fontSize: '1rem' }}>
                    {mod.title}
                  </h3>
                  <p style={{ margin: '0 0 4px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    {mod.subtitle}
                  </p>
                  {/* Achievement */}
                  {earned && (
                    <div style={{
                      display:      'inline-flex',
                      alignItems:   'center',
                      gap:          '5px',
                      background:   'var(--color-gold)',
                      borderRadius: '99px',
                      padding:      '3px 10px',
                      fontSize:     'var(--font-size-xs)',
                      fontWeight:   800,
                      color:        '#825300',
                    }}>
                      {mod.achievement.icon} {mod.achievement.title}
                    </div>
                  )}
                </div>

                {/* Button */}
                <div>
                  {mod.available ? (
                    <button className="btn btn-primary" onClick={() => navigate(mod.path)}
                      style={{ background: earned ? 'var(--color-success)' : mod.color }}>
                      {earned ? 'Wiederholen' : 'Starten →'}
                    </button>
                  ) : (
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      Demnächst
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Optionale Module */}
        {MODULES.filter(m => m.optional).length > 0 && (
          <>
            <h2 style={{ color: 'var(--color-platform)', marginBottom: 'var(--space-md)' }}>
              Optionale Module
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {MODULES.filter(m => m.optional).map(mod => {
                const earned = !!achievements[mod.id]
                return (
                  <div key={mod.id} className="card" style={{
                    marginBottom: 0,
                    display:      'flex',
                    alignItems:   'center',
                    gap:          'var(--space-md)',
                    flexWrap:     'wrap',
                    borderLeft:   `5px solid ${mod.color}`,
                    opacity:      mod.available ? 1 : 0.65,
                  }}>
                    <div style={{
                      fontSize: '1.8rem', background: mod.colorLight,
                      borderRadius: 'var(--radius-md)', width: '52px', height: '52px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {mod.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <h3 style={{ margin: 0, color: mod.color, fontSize: '1rem' }}>{mod.title}</h3>
                        <span className="pill-dark" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '99px' }}>Optional</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{mod.subtitle}</p>
                    </div>
                    <div>
                      {mod.available
                        ? <button className="btn btn-primary" onClick={() => navigate(mod.path)} style={{ background: mod.color }}>{earned ? 'Wiederholen' : 'Starten →'}</button>
                        : <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Demnächst</span>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}