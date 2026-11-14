// Dashboard - Gamification mit XP, Level, Missionen

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const BASE = import.meta.env.BASE_URL
import { MODULES, REQUIRED_MODULE_IDS, getAchievementsLocal, allRequiredPassed, getXP, getLevel, saveAchievementLocal } from '../../lib/achievements.js'
import { loadAllProgress } from '../../lib/progress.js'
import { applyCode } from '../../lib/levelCode.js'

export default function Dashboard({ student }) {
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState(getAchievementsLocal)
  const [eligible,     setEligible]     = useState(allRequiredPassed)
  const [xp,           setXp]           = useState(getXP)
  const [codeInput,    setCodeInput]    = useState('')
  const [codeResult,   setCodeResult]   = useState(null)
  const [showCode,     setShowCode]     = useState(false)
  const [feedbackDone, setFeedbackDone] = useState(() => !!localStorage.getItem('ki_feedback_done'))


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
    <div style={{ background: 'linear-gradient(145deg, var(--slzb-navy), var(--slzb-blue))', minHeight: '100vh' }}>
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
            <div style={{ background: level.level >= 2 ? 'rgba(22,163,74,0.2)' : 'rgba(124,58,237,0.2)', border: `2px solid ${level.level >= 2 ? 'rgba(22,163,74,0.5)' : 'rgba(124,58,237,0.5)'}`, borderRadius: 'var(--r-xl)', padding: 'var(--sp-md)', minWidth: '10rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{level.icon}</div>
              <div style={{ fontWeight: 900, color: level.level >= 2 ? '#4ade80' : '#c4b5fd', fontSize: 'var(--fs-sm)' }}>Level {level.level}</div>
              <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: 'var(--fs-xs)' }}>{level.title}</div>
              <div style={{ marginTop: '0.5rem', fontWeight: 900, color: '#f59e0b', fontSize: 'var(--fs-lg)' }}>⭐ {xp} XP</div>
            </div>
          </div>

          {/* Level-Bedeutung + XP-Fortschrittsbalken */}
          <div style={{ marginTop: 'var(--sp-lg)' }}>
            {/* Ziel-Erklärung */}
            {level.level === 1 && (
              <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 'var(--r-lg)', padding: '0.75rem var(--sp-md)', marginBottom: 'var(--sp-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>🎯</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: 'var(--fs-sm)' }}>Dein Ziel: KI-Grundlagen ✓</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--fs-xs)', marginTop: '2px' }}>
                    Schließe alle 4 Module ab → Level 2 erreicht → KI-Führerschein Klasse 7!
                  </div>
                </div>
              </div>
            )}
            {level.level >= 2 && (
              <div style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.4)', borderRadius: 'var(--r-lg)', padding: '0.75rem var(--sp-md)', marginBottom: 'var(--sp-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>🎓</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#4ade80', fontSize: 'var(--fs-sm)' }}>KI-Grundlagen abgeschlossen! ✓</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--fs-xs)', marginTop: '2px' }}>
                    {level.level === 2 ? 'In Klasse 8 geht es weiter – dann erreichst du Level 3: KI-Anwender:in!' : `Level ${level.level} erreicht – weiter so!`}
                  </div>
                </div>
              </div>
            )}
            {/* Fortschrittsbalken */}
            {level.next && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>
                  <span>{level.level === 1 ? `Noch ${level.next - xp} XP bis KI-Grundlagen ✓` : `Fortschritt zu Level ${level.level + 1}`}</span>
                  <span>{pct}%</span>
                </div>
                <div className="xp-bar-track">
                  <div className="xp-bar-fill" style={{ width: `${pct}%`, background: level.level >= 2 ? 'linear-gradient(90deg, #4ade80, #22c55e)' : undefined }} />
                </div>
              </>
            )}
          </div>
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
            <button className="btn btn-ghost" onClick={() => setShowCode(true)} style={{ fontSize: 'var(--fs-sm)' }}>
              🏅 Vorleistungs-Code eingeben
            </button>
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

        {/* Lernpfad – versetzt wie beim Kollegen */}
        <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--slzb-ice)', marginBottom: '0.875rem' }}>
          Dein Lernpfad
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '780px' }}>
          {MODULES.map((mod, idx) => {
            const earned    = !!achievements[mod.id]
            const isEven    = idx % 2 === 1
            const modColors = ['#1d77bd','#c26a00','#d0121a','#2b8a2b']
            const modColor  = modColors[idx] || mod.color
            const isLocked  = !earned && idx > 0 && !achievements[MODULES[idx-1]?.id]
            return (
              <div key={mod.id} style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '68px 1fr auto',
                gap: '1rem',
                alignItems: 'center',
                background: 'white',
                color: '#17243b',
                borderRadius: '18px',
                padding: '1rem 1.25rem',
                boxShadow: '0 10px 24px rgba(0,20,60,0.25)',
                marginLeft: isEven ? '3.5rem' : '0',
                opacity: isLocked ? 0.75 : 1,
                transition: 'all 0.2s',
              }}>
                {/* BESTANDEN-Stempel */}
                {earned && (
                  <div style={{
                    position: 'absolute', right: '1rem', top: '-0.75rem',
                    transform: 'rotate(-9deg)',
                    border: '3px solid #2b7a26', color: '#2b7a26',
                    background: 'white', fontWeight: 900, fontSize: '0.75rem',
                    letterSpacing: '0.12em', padding: '3px 10px',
                    borderRadius: '7px', textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>BESTANDEN</div>
                )}

                {/* Nummer-Kreis */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  display: 'grid', placeItems: 'center',
                  fontSize: '1.5rem', fontWeight: 900, color: 'white',
                  background: earned ? '#2b7a26' : modColor,
                  boxShadow: `0 0 0 4px white, 0 0 0 7px ${earned ? '#2b7a26' : modColor}`,
                  flexShrink: 0,
                }}>
                  {earned ? '✓' : isLocked ? '🔒' : mod.icon}
                </div>

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: earned ? '#2b7a26' : '#56667c', marginBottom: '2px' }}>
                    {earned ? '✓ Bestanden' : isLocked ? 'Gesperrt' : `Etappe ${idx + 1}`}
                  </div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: '#17243b' }}>{mod.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#56667c' }}>{mod.subtitle}</p>
                  {earned && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', background: '#e6f5e4', color: '#2b7a26', fontWeight: 700, fontSize: '0.8rem', borderRadius: '99px', padding: '3px 10px' }}>
                      {mod.achievement.icon} {mod.achievement.title}
                    </div>
                  )}
                  {!earned && (
                    <div style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#a86a00' }}>
                      ⭐ +{mod.xp} XP
                    </div>
                  )}
                </div>

                {/* Button */}
                {!isLocked && (
                  <button onClick={() => navigate(mod.path)}
                    style={{ background: earned ? '#2b7a26' : modColor, color: 'white', border: 'none', borderRadius: '99px', padding: '0.625rem 1.25rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {earned ? 'Wiederholen' : 'Starten →'}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Feedback als Pflicht-Etappe */}
        {eligible && (
          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '68px 1fr auto',
            gap: '1rem',
            alignItems: 'center',
            background: feedbackDone ? 'white' : 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            color: '#17243b',
            borderRadius: '18px',
            padding: '1rem 1.25rem',
            boxShadow: feedbackDone ? '0 10px 24px rgba(0,20,60,0.25)' : '0 10px 24px rgba(245,158,11,0.3)',
            border: feedbackDone ? 'none' : '2px solid #f59e0b',
            marginTop: '0.875rem',
            maxWidth: '780px',
          }}>
            {!feedbackDone && (
              <div style={{ position: 'absolute', right: '1rem', top: '-0.75rem', background: '#f59e0b', color: 'white', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', padding: '3px 10px', borderRadius: '7px', textTransform: 'uppercase' }}>
                Pflicht
              </div>
            )}
            {feedbackDone && (
              <div style={{ position: 'absolute', right: '1rem', top: '-0.75rem', transform: 'rotate(-9deg)', border: '3px solid #2b7a26', color: '#2b7a26', background: 'white', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.12em', padding: '3px 10px', borderRadius: '7px', textTransform: 'uppercase' }}>
                BESTANDEN
              </div>
            )}
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'white', background: feedbackDone ? '#2b7a26' : '#f59e0b', boxShadow: `0 0 0 4px white, 0 0 0 7px ${feedbackDone ? '#2b7a26' : '#f59e0b'}`, flexShrink: 0 }}>
              {feedbackDone ? '✓' : '💬'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: feedbackDone ? '#2b7a26' : '#92400e', marginBottom: '2px' }}>
                {feedbackDone ? '✓ Abgeschlossen' : 'Abschluss-Aufgabe'}
              </div>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: '#17243b' }}>Feedback zum KI-Führerschein</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#56667c' }}>
                {feedbackDone ? 'Danke für dein Feedback!' : 'Bitte gib uns kurz Rückmeldung – das dauert nur 2 Minuten.'}
              </p>
            </div>
            {!feedbackDone && (
              <a href="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=Hu4TuZlhDkyzozIG7ZRtpkactxD1NGxJjGpkgOG5fdpUOEczVDRIVE5NT1RMQzZHSDc4MVA2VzIxVS4u" target="_blank" rel="noopener"
                onClick={() => { localStorage.setItem('ki_feedback_done', '1'); setFeedbackDone(true) }}
                style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: '99px', padding: '0.625rem 1.25rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none', display: 'inline-block' }}>
                Zum Feedback →
              </a>
            )}
          </div>
        )}

        {/* Arbeitsblatt + Feedback */}
        <div style={{ marginTop: 'var(--sp-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxWidth: '780px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>📋 Arbeitsblätter</div>
            {[
              { label: 'Modul 1 · Was ist KI?',          file: 'arbeitsblatt-modul1.html', color: '#1d77bd' },
              { label: 'Modul 2 · KI sinnvoll nutzen',   file: 'arbeitsblatt-modul2.html', color: '#c26a00' },
              { label: 'Modul 3 · Datenschutz',          file: 'arbeitsblatt-modul3.html', color: '#d0121a' },
              { label: 'Modul 4 · Nachhaltigkeit',       file: 'arbeitsblatt-modul4.html', color: '#2b8a2b' },
            ].map(ab => (
              <a key={ab.file} href={BASE + ab.file} target="_blank" rel="noopener"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--r-md)', padding: '6px 10px', color: 'white', textDecoration: 'none', fontSize: 'var(--fs-xs)', fontWeight: 700 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ab.color, flexShrink: 0 }} />
                {ab.label}
              </a>
            ))}
          </div>
          {eligible && (
            <a href="https://forms.cloud.microsoft/Pages/DesignPageV2.aspx?subpage=design&FormId=Hu4TuZlhDkyzozIG7ZRtpkactxD1NGxJjGpkgOG5fdpUOEczVDRIVE5NT1RMQzZHSDc4MVA2VzIxVS4u&Token=4b0aaf8eab004846af8c5083f5ce5a25" target="_blank" rel="noopener"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,178,37,0.15)', border: '1px solid rgba(255,178,37,0.4)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', color: 'white', textDecoration: 'none' }}>
              <span style={{ fontSize: '1.5rem' }}>💬</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 'var(--fs-sm)' }}>Feedback geben</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>Was hat dir gefallen?</div>
              </div>
            </a>
          )}
        </div>

        {/* Footer-Links */}
        <div style={{ marginTop: 'var(--sp-lg)', paddingBottom: 'var(--sp-xl)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/datenschutz')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 'var(--fs-xs)', cursor: 'pointer', fontFamily: 'inherit' }}>Datenschutz</button>
          <button onClick={() => navigate('/meine-daten')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 'var(--fs-xs)', cursor: 'pointer', fontFamily: 'inherit' }}>Meine Daten</button>
          <a href={BASE + 'elterninformation.html'} target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--fs-xs)', textDecoration: 'none' }}>Elterninformation</a>
        </div>
      </div>
    </div>
  )
}