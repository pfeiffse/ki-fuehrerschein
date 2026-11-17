// ModuleStamp - Feier-Overlay mit Canvas-Konfetti (nach Kollegen-Design)
import React, { useEffect } from 'react'
import { useConfetti } from '../../hooks/useConfetti.js'
import { MODULES, getXP, getLevel } from '../../lib/achievements.js'

export default function ModuleStamp({ moduleName, moduleIcon, onClose, isFinal }) {
  const { cannons, rain } = useConfetti()

  useEffect(() => {
    // Kanonen-Konfetti beim Öffnen
    setTimeout(() => cannons(), 300)
    if (isFinal) {
      setTimeout(() => cannons(), 1300)
      setTimeout(() => cannons(), 2300)
    }
  }, [])

  const xp = getXP()
  const level = getLevel(xp)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0,20,50,0.78)',
        backdropFilter: 'blur(3px)',
        animation: 'celFade .25s ease',
      }}>
      <style>{`
        @keyframes celFade { from{opacity:0} to{opacity:1} }
        @keyframes celSlam { 0%{transform:translate(-50%,-50%) rotate(-12deg) scale(3.2);opacity:0} 100%{transform:translate(-50%,-50%) rotate(-12deg) scale(1);opacity:1} }
        @keyframes celFill { 0%{background:rgba(255,255,255,.5);color:#9aa9bf;border:2px dashed #aebcd0;transform:scale(1)} 50%{transform:scale(1.25)} 100%{background:var(--fc);color:#fff;border:2px solid var(--fc);transform:scale(1)} }
        @keyframes ptsGain { 0%{transform:scale(0) translateY(20px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes celShake { 0%,100%{transform:translate(0)} 25%{transform:translate(-5px,3px)} 50%{transform:translate(4px,-3px)} 75%{transform:translate(-3px,2px)} }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', color: '#17243b',
          borderRadius: '26px', maxWidth: '480px', width: '100%',
          padding: '28px 26px 24px', textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
        }}>

        {/* Kick-Label */}
        <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: isFinal ? '#2b8a2b' : '#063b81', marginBottom: '4px' }}>
          {isFinal ? `Alle 4 Etappen bestanden` : `Etappe bestanden`}
        </div>

        {/* Mini-Führerscheinkarte */}
        <div className="cel-lic" style={{
          position: 'relative', margin: '10px auto 18px',
          width: '100%', maxWidth: '400px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg,#fbe8ef,#e9edfc 50%,#e4f4e6)',
          border: '1px solid #cfcadf',
          padding: '14px 16px', textAlign: 'left',
          display: 'grid', gridTemplateColumns: '70px 1fr',
          gap: '10px 14px',
          boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
        }}>
          {/* Avatar */}
          <div style={{ height: '84px', borderRadius: '10px', background: 'linear-gradient(160deg,#dfe8f4,#c9d7ea)', border: '3px solid white', display: 'grid', placeItems: 'center', fontSize: '34px', fontWeight: 900, color: '#063b81' }}>
            {moduleIcon}
          </div>
          {/* Info */}
          <div>
            <small style={{ display: 'block', color: '#56667c', fontWeight: 700, fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              KI-Führerschein · {isFinal ? 'erteilt' : 'in Ausbildung'}
            </small>
            <b style={{ display: 'block', fontSize: '18px', color: '#00295f', margin: '2px 0' }}>{moduleName}</b>
          </div>
          {/* Abzeichen-Felder */}
          <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
            {MODULES.filter(m => !m.optional).map(mod => {
              const earned = false // wird durch achievements bestimmt
              return (
                <div key={mod.id} style={{
                  height: '48px', borderRadius: '9px',
                  border: '2px dashed #aebcd0',
                  display: 'grid', placeItems: 'center',
                  textAlign: 'center', fontWeight: 800,
                  color: '#9aa9bf', fontSize: '12px',
                  lineHeight: 1.1, background: 'rgba(255,255,255,0.5)',
                }}>
                  <span style={{ display: 'block', fontSize: '18px' }}>{mod.achievement.icon}</span>
                  M{mod.nr || MODULES.indexOf(mod)+1}
                </div>
              )
            })}
          </div>
          {/* BESTANDEN-Stempel */}
          <div style={{
            position: 'absolute', left: '50%', top: '44%',
            transform: 'translate(-50%,-50%) rotate(-12deg)',
            border: `6px solid ${isFinal ? '#2b8a2b' : '#063b81'}`,
            color: isFinal ? '#2b8a2b' : '#063b81',
            background: 'rgba(255,255,255,0.88)',
            fontSize: 'clamp(20px,5vw,28px)', fontWeight: 900,
            letterSpacing: '.14em', padding: '4px 18px',
            borderRadius: '12px', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            animation: 'celSlam .55s .45s cubic-bezier(.2,1.6,.4,1) both',
          }}>
            {isFinal ? 'Erteilt' : 'Bestanden'}
          </div>
        </div>

        {/* Punkte-Gewinn */}
        <div style={{
          display: 'inline-block', margin: '0 0 10px',
          background: '#fff8e6', border: '2px solid #ffd27a',
          color: '#8a5200', fontWeight: 900, fontSize: '20px',
          borderRadius: '999px', padding: '4px 16px',
          animation: 'ptsGain .6s 1.15s cubic-bezier(.2,1.6,.4,1) both',
        }}>
          +250 Punkte ⭐
        </div>

        {/* Titel */}
        <h2 style={{ fontSize: '22px', margin: '4px 0 8px', color: '#00295f' }}>
          {isFinal ? '🎓 Dein KI-Führerschein ist erteilt!' : `${moduleIcon} Abzeichen erworben!`}
        </h2>
        <p style={{ margin: '0 0 18px', color: '#56667c', fontSize: '15px' }}>
          {isFinal ? 'Du hast alle vier Abzeichen gesammelt!' : moduleName}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onClose}
            style={{ background: '#00295f', color: 'white', border: 'none', borderRadius: '999px', padding: '11px 24px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {isFinal ? 'Zum Zertifikat →' : 'Weiter →'}
          </button>
        </div>
      </div>
    </div>
  )
}
