// ModuleStamp - BESTANDEN-Stempel Animation beim Modulabschluss

import React, { useEffect, useState } from 'react'

export default function ModuleStamp({ moduleName, moduleIcon, onClose }) {
  const [phase, setPhase] = useState('stamp') // stamp → confetti → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('confetti'), 300)
    const t2 = setTimeout(() => setPhase('done'), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <style>{`
        @keyframes stampIn {
          0%   { transform: scale(3) rotate(-15deg); opacity: 0 }
          60%  { transform: scale(0.9) rotate(2deg); opacity: 1 }
          80%  { transform: scale(1.05) rotate(-1deg) }
          100% { transform: scale(1) rotate(0deg); opacity: 1 }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1 }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0 }
        }
        .stamp-anim { animation: stampIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards }
        .confetti-fall { position: fixed; animation: confettiFall ease-in forwards }
      `}</style>

      {/* Konfetti */}
      {phase === 'confetti' && Array.from({ length: 40 }, (_, i) => (
        <div key={i} className="confetti-fall" style={{
          left: `${Math.random() * 100}%`,
          top: '-10px',
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
          background: ['#fbbf24','#4ade80','#60a5fa','#f472b6','#a78bfa','#34d399'][i % 6],
          borderRadius: i % 3 === 0 ? '50%' : '2px',
          animationDelay: `${Math.random() * 0.8}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        }} />
      ))}

      {/* Stempel */}
      <div className="stamp-anim" onClick={e => e.stopPropagation()} style={{
        position: 'relative',
        background: 'white',
        borderRadius: '1.25rem',
        padding: '2.5rem 2rem',
        maxWidth: '20rem', width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
      }}>
        {/* Stempel-Overlay */}
        <div style={{
          position: 'absolute', inset: '1rem',
          border: '6px solid #16a34a',
          borderRadius: '0.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'rotate(-8deg)',
          pointerEvents: 'none',
          opacity: 0.15,
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#16a34a', letterSpacing: '0.05em' }}>
            BESTANDEN
          </div>
        </div>

        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{moduleIcon}</div>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#16a34a', marginBottom: '0.5rem' }}>
          Modul abgeschlossen!
        </div>
        <h2 style={{ margin: '0 0 0.5rem', color: '#0f2a3d', fontSize: '1.25rem' }}>
          {moduleName}
        </h2>
        <div style={{ display: 'inline-block', background: '#dcfce7', border: '3px solid #16a34a',
          borderRadius: '99px', padding: '0.375rem 1.25rem',
          fontWeight: 900, color: '#15803d', fontSize: '1.1rem',
          marginBottom: '1.25rem', transform: 'rotate(-3deg)' }}>
          ✓ BESTANDEN
        </div>
        <div style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.75rem', marginBottom: '1rem' }}>
          Tippe irgendwo um weiterzumachen
        </div>
        <button onClick={onClose} style={{
          background: '#16a34a', border: 'none', borderRadius: '0.75rem',
          color: 'white', fontWeight: 800, fontSize: '0.9rem',
          padding: '0.625rem 1.5rem', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
        }}>
          Weiter →
        </button>
      </div>
    </div>
  )
}
