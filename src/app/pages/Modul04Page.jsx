// Modul04Page - Original KI-Nachhaltigkeit-HTML als iframe
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { startModuleLocal, passModule, saveNotesToSupabase } from '../../lib/progress.js'
import ModuleStamp from '../../components/ui/ModuleStamp.jsx'
import ModuleSkip from '../../components/ui/ModuleSkip.jsx'
import { SLZBArcs } from '../../components/ui/SLZBArcs.jsx'

const MOD = getModule('modul-04')
const BASE = import.meta.env.BASE_URL

export default function Modul04Page() {
  const navigate   = useNavigate()
  const [achieved, setAchieved] = useState(() => hasAchievement(MOD.id))
  const [showStamp, setShowStamp] = useState(false)

  useEffect(() => {
    startModuleLocal(MOD.id)

    function onMessage(e) {
      const d = e.data
      if (!d || !d.kifs) return
      if (d.type === 'complete') {
        passModule(MOD.id, 100, 100)
        saveAchievementLocal(MOD.id)
        saveNotesToSupabase()
        setAchieved(true)
        setShowStamp(true)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div style={{ background: 'linear-gradient(145deg, var(--slzb-navy), var(--slzb-blue))', minHeight: '100vh', position: 'relative' }}>
      <SLZBArcs />
      {showStamp && (
        <ModuleStamp
          moduleName={MOD.title}
          moduleIcon="🌱"
          onClose={() => { setShowStamp(false); navigate('/dashboard') }}
        />
      )}

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>KI-Führerschein · Modul 4</div>
          <h1 style={{ margin: 0, color: 'white', fontSize: '22px' }}>🌱 KI & Nachhaltigkeit</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {achieved && <div style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.5)', borderRadius: '99px', padding: '4px 12px', color: '#4ade80', fontWeight: 800, fontSize: '13px' }}>✓ Abgeschlossen</div>}
          <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '99px', color: 'white', padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '13px' }}>← Übersicht</button>
        </div>
      </div>

      {/* iframe mit Original-HTML */}
      <div style={{ position: 'relative', zIndex: 1, margin: '0 0 16px', height: 'calc(100vh - 80px)' }}>
        <iframe
          src={BASE + 'm4_ki_nachhaltigkeit.html'}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Modul 4: KI & Nachhaltigkeit"
          allow="fullscreen"
        />
      </div>

      <ModuleSkip moduleName={MOD.title} moduleId={MOD.id} onSkip={(isMaster) => {
        passModule(MOD.id, 100, 100)
        saveAchievementLocal(MOD.id)
        saveNotesToSupabase()
        setAchieved(true)
        setShowStamp(true)
        if (isMaster) navigate('/dashboard')
      }} />
    </div>
  )
}
