// LevelUpOverlay - Feier-Animation wenn Level 2 erreicht wird

import React, { useEffect, useState } from 'react'

export default function LevelUpOverlay({ newLevel, onClose }) {
  const [phase, setPhase] = useState('enter') // enter → celebrate → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('celebrate'), 400)
    const t2 = setTimeout(() => setPhase('done'), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const isKlasse7Goal = newLevel === 2

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0 } 70% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes confetti { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1 } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0 } }
        .levelup-badge { animation: popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards }
        .levelup-icon { animation: float 2s ease-in-out infinite }
        .confetti-piece { position: fixed; width: 10px; height: 10px; animation: confetti 3s ease-in forwards }
      `}</style>

      {/* Konfetti */}
      {phase === 'celebrate' && Array.from({ length: 30 }, (_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${Math.random() * 100}%`,
          top: '-20px',
          background: ['#fbbf24','#4ade80','#60a5fa','#f472b6','#a78bfa'][i % 5],
          borderRadius: i % 3 === 0 ? '50%' : '2px',
          animationDelay: `${Math.random() * 1.5}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }} />
      ))}

      <div className="levelup-badge" onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)',
        border: '3px solid #fbbf24',
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
        maxWidth: '22rem', width: '100%',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(251,191,36,0.4), 0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Icon */}
        <div className="levelup-icon" style={{ fontSize: '5rem', marginBottom: '1rem' }}>
          {isKlasse7Goal ? '🎓' : '⭐'}
        </div>

        {/* Level-Up Text */}
        <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#fbbf24', marginBottom: '0.5rem' }}>
          Level Up!
        </div>
        <h2 style={{ margin: '0 0 0.5rem', color: 'white', fontSize: '1.75rem' }}>
          Level {newLevel} erreicht!
        </h2>
        <div style={{ fontWeight: 900, color: '#fbbf24', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          {newLevel === 2 ? 'KI-Grundlagen ✓' : newLevel === 3 ? 'KI-Anwender:in' : newLevel === 4 ? 'KI-Gestalter:in' : 'KI-Expert:in'}
        </div>

        {/* Klasse-7-Spezial-Nachricht */}
        {isKlasse7Goal && (
          <div style={{ background: 'rgba(251,191,36,0.15)', border: '2px solid rgba(251,191,36,0.4)',
            borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.5 }}>
              Du hast den <strong style={{ color: '#fbbf24' }}>KI-Führerschein Klasse 7</strong> abgeschlossen!
              Dein Zertifikat wartet auf dich.
            </p>
          </div>
        )}

        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
          Tippe irgendwo um weiterzumachen
        </div>

        <button onClick={onClose} style={{
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          border: 'none', borderRadius: '0.75rem',
          color: '#0f2a3d', fontWeight: 900, fontSize: '1rem',
          padding: '0.75rem 2rem', cursor: 'pointer', fontFamily: 'inherit',
          width: '100%',
        }}>
          {isKlasse7Goal ? '🎓 Zum Zertifikat →' : 'Weiter! →'}
        </button>
      </div>
    </div>
  )
}
