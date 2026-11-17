// LevelUpOverlay - Level-Up-Animation mit Canvas-Konfetti
import React, { useEffect, useState } from 'react'
import { useConfetti } from '../../hooks/useConfetti.js'

export default function LevelUpOverlay({ newLevel, onClose }) {
  const [phase, setPhase] = useState('enter')
  const { cannons, rain } = useConfetti()

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('celebrate'); cannons() }, 400)
    const t2 = setTimeout(() => { cannons() }, 1400)
    const t3 = setTimeout(() => setPhase('done'), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const isKlasse7Goal = newLevel === 2

  const titles = {
    2: 'KI-Grundlagen ✓',
    3: 'KI-Anwender:in',
    4: 'KI-Gestalter:in',
    5: 'KI-Expert:in',
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      background: 'rgba(0,20,50,0.78)',
      backdropFilter: 'blur(3px)',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { 0%{transform:scale(0.5) rotate(-5deg);opacity:0} 60%{transform:scale(1.08) rotate(2deg)} 80%{transform:scale(0.97) rotate(-1deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes floatIcon { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes ptsGain { 0%{transform:scale(0) translateY(20px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
      `}</style>

      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(145deg, #0f2a3d, #16213e)',
        border: '3px solid #f59e0b',
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
        maxWidth: '22rem', width: '100%',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(251,191,36,0.4), 0 25px 50px rgba(0,0,0,0.5)',
        animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        color: 'white',
      }}>
        {/* Icon */}
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'floatIcon 2s ease-in-out infinite' }}>
          {isKlasse7Goal ? '🎓' : '⭐'}
        </div>

        {/* Label */}
        <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '0.5rem' }}>
          Level Up!
        </div>

        <h2 style={{ margin: '0 0 0.5rem', color: 'white', fontSize: '1.75rem' }}>
          Level {newLevel} erreicht!
        </h2>

        <div style={{ fontWeight: 900, color: '#f59e0b', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
          {titles[newLevel] || 'Neues Level'}
        </div>

        {/* Punkte-Gewinn */}
        <div style={{
          display: 'inline-block', margin: '0 0 16px',
          background: '#fff8e6', border: '2px solid #ffd27a',
          color: '#8a5200', fontWeight: 900, fontSize: '18px',
          borderRadius: '999px', padding: '4px 16px',
          animation: 'ptsGain .6s 1.15s cubic-bezier(.2,1.6,.4,1) both',
        }}>
          +250 Punkte ⭐
        </div>

        {/* Klasse-7-Nachricht */}
        {isKlasse7Goal && (
          <div style={{ background: 'rgba(251,191,36,0.15)', border: '2px solid rgba(251,191,36,0.4)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.5 }}>
              Du hast den <strong style={{ color: '#f59e0b' }}>KI-Führerschein Klasse 7</strong> abgeschlossen!
              Dein Zertifikat wartet auf dich.
            </p>
          </div>
        )}

        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
          Tippe irgendwo um weiterzumachen
        </div>

        <button onClick={onClose} style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
