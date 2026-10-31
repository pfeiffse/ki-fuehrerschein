// Dashboard - Gamification mit XP, Level, Missionen

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODULES, REQUIRED_MODULE_IDS, getAchievementsLocal, allRequiredPassed, getXP, getLevel, saveAchievementLocal } from '../../lib/achievements.js'
import { loadAllProgress, debugSync } from '../../lib/progress.js'
import { applyCode } from '../../lib/levelCode.js'

export default function Dashboard({ student }) {
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState(getAchievementsLocal)
  const [eligible,     setEligible]     = useState(allRequiredPassed)
  const [xp,           setXp]           = useState(getXP)
  const [codeInput,    setCodeInput]    = useState('')
  const [codeResult,   setCodeResult]   = useState(null)
  const [showCode,     setShowCode]     = useState(false)
  const [debugMsg,     setDebugMsg]     = useState('')

  async function handleDebugSync() {
    setDebugMsg('Teste...')
    const res = await debugSync()
    if (res?.error) setDebugMsg('❌ ' + (res.error.message || JSON.stringify(res.error)))
    else setDebugMsg('✅ Supabase-Sync OK! Status: ' + (res?.status || 'ok'))
  }

  const level = getLevel(xp)
  const prevXP = level.level === 1 ? 0 : level.level === 2 ? 400 : level.level === 3 ? 900 : 1600
  const pct   = level.next ? Math.round(((xp - prevXP) / (level.next - prevXP)) * 100) : 100

  useEffect(() => {
    // Supabase im Hintergrund laden
    loadAllProgress().then(progress => {
      progress.forEach(p => {
        if (p.passed && p.module_id) saveAchievementLocal(p.module_id)
      })
      setAchievements(getAchievementsLocal())
      setEligible(allRequiredPassed())
      setXp(getXP())
    }).catch(() => {})

    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  function refresh() {
    setAchievements(getAchievementsLocal())
    setEligible(allRequiredPassed())
    setXp(getXP())
  }

  function handleCode() {
    if (!codeInput.trim()) return
    const result = applyCode(codeInput.trim())
    setCodeResult(result)
    if (result.success) refresh()
  }

  const passedCount = REQUIRED_MODULE_IDS.filter(id => achievements[id]).length

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Hero mit XP */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-xl)', marginBottom: 'var(--sp-lg)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
            <div>
              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.375rem' }}>
                KI-Führerschein · Klasse 7
              </div>
              <h1 style={{ margin: '0 0 0.25rem', fontSize: 'var(--fs-2xl)' }}>
                Hallo, {student?.display_name ?? 'Detektiv:in'}! 👋
              </h1>
              <p style={{ margin: 0, opacity: 0.8, fontSize: 'var(--fs-lg)' }}>
                {passedCount} von {REQUIRED_MODULE_IDS.length} Modulen abgeschlossen
              </p>
            </div>

            {/* Level-Card */}
            <div style={{ background: 'rgba(124,58,237,0.2)', border: '2px solid rgba(124,58,237,0.5)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-md)', minWidth: '10rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{level.icon}</div>
              <div style={{ fontWeight: 900, color: '#c4b5fd', fontSize: 'var(--fs-sm)' }}>Level {level.level}</div>
              <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: 'var(--fs-xs)' }}>{level.title}</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 900, color: '#f59e0b', fontSize: 'var(--fs-lg)' }}>⭐ {xp} XP</div>
            </div>
          </div>

          {/* XP-Fortschrittsbalken */}
          {level.next && (
            <div style={{ marginTop: 'var(--sp-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>
                <span>Fortschritt zu Level {level.level + 1}</span>
                <span>{pct}%</span>
              </div>
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Zertifikat-Banner */}
        {eligible ? (
          <div style={{ background: 'linear-gradient(135deg, #92400e, #b8860b)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', boxShadow: '0 0 30px rgba(184,134,11,0.4)', color: 'white' }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 'var(--fs-xl)', marginBottom: '0.25rem' }}>🏆 KI-Führerschein bestanden!</div>
              <div style={{ opacity: 0.9 }}>Alle Pflichtmodule abgeschlossen. Dein Zertifikat wartet!</div>
            </div>
            <button className="btn" onClick={() => navigate('/zertifikat')}
              style={{ background: 'white', color: '#92400e', fontWeight: 900 }}>
              Zertifikat öffnen →
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-lg)', color: 'rgba(255,255,255,0.7)', fontSize: 'var(--fs-sm)' }}>
            🔒 Zertifikat wird freigeschaltet nach Abschluss aller {REQUIRED_MODULE_IDS.length} Pflichtmodule
          </div>
        )}

        {/* Vorleistungs-Code */}
        <div style={{ marginBottom: 'var(--sp-lg)' }}>
          {!showCode ? (
            <React.Fragment>
              <button className="btn btn-ghost" onClick={() => setShowCode(true)} style={{ fontSize: 'var(--fs-sm)' }}>
                🏅 Vorleistungs-Code eingeben
              </button>
              <button className="btn" onClick={handleDebugSync}
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem', marginLeft: '0.5rem' }}>
                🔧 Sync testen
              </button>
              {debugMsg && <span style={{ fontSize: '0.75rem', color: debugMsg.startsWith('✅') ? '#4ade80' : '#f87171', fontWeight: 700, display: 'block', marginTop: '0.25rem' }}>{debugMsg}</span>}
            </React.Fragment>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input type="text" value={codeInput} onChange={e => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="KI-7-ABCD-X4" maxLength={20}
                  style={{ flex: 1, minWidth: '10rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontFamily: 'monospace', fontWeight: 700 }} />
                <button className="btn btn-xp" onClick={handleCode}>Einlösen</button>
                <button className="btn btn-ghost" onClick={() => { setShowCode(false); setCodeResult(null) }}>✕</button>
              </div>
              {codeResult && (
                <div style={{ marginTop: '0.5rem', color: codeResult.success ? '#4ade80' : '#f87171', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>
                  {codeResult.success ? `✅ ${codeResult.moduleIds.length} Achievement(s) übernommen!` : `❌ ${codeResult.error}`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modul-Karten */}
        <h2 style={{ color: 'white', marginBottom: 'var(--sp-md)' }}>Deine Missionen</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
          {MODULES.map((mod, idx) => {
            const earned = !!achievements[mod.id]
            return (
              <div key={mod.id} style={{
                background: earned ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.06)',
                border: `2px solid ${earned ? 'rgba(22,163,74,0.5)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)',
                display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap',
                transition: 'all 0.2s',
              }}>
                {/* Nummer */}
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', flexShrink: 0, background: earned ? 'var(--c-success)' : mod.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 'var(--fs-lg)' }}>
                  {earned ? '✓' : idx + 1}
                </div>

                {/* Icon */}
                <div style={{ fontSize: '2rem', flexShrink: 0, background: earned ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.1)', borderRadius: 'var(--r-md)', width: '3.5rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mod.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '10rem' }}>
                  <h3 style={{ margin: '0 0 0.125rem', color: earned ? '#4ade80' : 'white', fontSize: 'var(--fs-md)' }}>
                    {mod.title}
                  </h3>
                  <p style={{ margin: '0 0 0.375rem', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-sm)' }}>
                    {mod.subtitle}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', borderRadius: '99px', padding: '0.125rem 0.5rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>
                      ⭐ +{mod.xp} XP
                    </span>
                    {earned && (
                      <span style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80', borderRadius: '99px', padding: '0.125rem 0.5rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>
                        {mod.achievement.icon} {mod.achievement.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Button */}
                <button className="btn" onClick={() => navigate(mod.path)}
                  style={{ background: earned ? 'var(--c-success)' : mod.color, color: 'white', flexShrink: 0 }}>
                  {earned ? 'Wiederholen' : 'Starten →'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}