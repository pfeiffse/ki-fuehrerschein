// ============================================================
// KI-Führerschein · Schüler-Dashboard
// Modulübersicht mit Status – wie Modul 2 Fortschrittsanzeige
// ============================================================

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadAllProgress, checkCertificateEligibility } from '../../lib/progress.js'

// Pflichtmodule für Zertifikat
const REQUIRED_MODULES = ['modul-01', 'modul-02', 'modul-03', 'modul-04']

// Modulkonfiguration
const MODULES = [
  {
    id:          'modul-01',
    title:       'Was ist KI?',
    description: 'Trainingsdaten, Mustererkennung und wie Sprach-KI funktioniert.',
    icon:        '🤖',
    color:       'var(--color-modul-01)',
    colorLight:  'var(--color-modul-01-light)',
    path:        '/modul/01',
    optional:    false,
    available:   false,   // noch nicht implementiert
  },
  {
    id:          'modul-02',
    title:       'KI sinnvoll nutzen',
    description: 'Fehler erkennen, Prompts formulieren, Verantwortung übernehmen.',
    icon:        '🧠',
    color:       'var(--color-modul-02)',
    colorLight:  'var(--color-modul-02-light)',
    path:        '/modul/02',
    optional:    false,
    available:   true,
  },
  {
    id:          'modul-03',
    title:       'Kennzeichnungspflicht',
    description: 'Wann und wie KI-generierte Inhalte gekennzeichnet werden müssen.',
    icon:        '🏷️',
    color:       'var(--color-modul-03)',
    colorLight:  'var(--color-modul-03-light)',
    path:        '/modul/03',
    optional:    false,
    available:   false,
  },
  {
    id:          'modul-04',
    title:       'Datenschutz',
    description: 'Welche Daten du bei der KI-Nutzung schützen musst.',
    icon:        '🔒',
    color:       'var(--color-modul-04)',
    colorLight:  'var(--color-modul-04-light)',
    path:        '/modul/04',
    optional:    false,
    available:   false,
  },
  {
    id:          'modul-05',
    title:       'KI & Nachhaltigkeit',
    description: 'Ressourcen, Energiebedarf und bewusster Umgang mit KI.',
    icon:        '🌍',
    color:       'var(--color-modul-05)',
    colorLight:  'var(--color-modul-05-light)',
    path:        '/modul/05',
    optional:    true,
    available:   false,
  },
]

const STATUS_LABELS = {
  not_started: { label: 'Noch nicht begonnen', color: '#8899aa' },
  in_progress: { label: 'In Bearbeitung',       color: '#f2b705' },
  completed:   { label: 'Abgeschlossen',         color: '#0d76c7' },
  passed:      { label: 'Bestanden ✓',           color: '#1e7a46' },
}

export default function Dashboard({ student }) {
  const navigate  = useNavigate()
  const [progress, setProgress]   = useState([])
  const [eligible, setEligible]   = useState(false)
  const [loading,  setLoading]    = useState(true)

  useEffect(() => {
    async function load() {
      const all  = await loadAllProgress()
      const cert = await checkCertificateEligibility(REQUIRED_MODULES)
      setProgress(all)
      setEligible(cert)
      setLoading(false)
    }
    load()
  }, [])

  function getModuleProgress(moduleId) {
    return progress.find(p => p.module_id === moduleId)
  }

  // Gesamtfortschritt berechnen
  const passedCount   = REQUIRED_MODULES.filter(id => getModuleProgress(id)?.passed).length
  const totalRequired = REQUIRED_MODULES.length
  const overallPct    = Math.round((passedCount / totalRequired) * 100)

  return (
    <div className="wrap">

      {/* Hero */}
      <div style={{
        background:   'linear-gradient(135deg, #064c87, #1184cf)',
        color:        'white',
        padding:      'clamp(24px, 4vw, 36px)',
        borderRadius: 'var(--radius-xl)',
        boxShadow:    'var(--shadow-lg)',
        marginBottom: 'var(--space-lg)',
      }}>
        <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '8px', display: 'inline-block' }}>
          KI-Führerschein Klasse 7
        </span>
        <h1 style={{ margin: '8px 0 4px', fontSize: 'var(--font-size-2xl)' }}>
          Hallo, {student?.display_name ?? 'Schüler:in'}! 👋
        </h1>
        <p style={{ margin: '4px 0 0', opacity: 0.9 }}>
          Hier siehst du alle Module und deinen Fortschritt.
        </p>
      </div>

      {/* Gesamtfortschritt */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <strong>Gesamtfortschritt Pflichtmodule</strong>
            <div className="progress-shell" style={{ marginTop: '8px' }}>
              <div className="progress-bar" style={{ width: `${overallPct}%` }}
                role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100} />
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-platform)', whiteSpace: 'nowrap' }}>
            {passedCount} / {totalRequired} bestanden
          </div>
        </div>

        {/* Zertifikat-Hinweis */}
        {eligible ? (
          <div className="box-memory" style={{ marginTop: 'var(--space-md)' }}>
            🏆 Du hast alle Pflichtmodule bestanden! Dein Zertifikat ist freigeschaltet.{' '}
            <a href="/zertifikat" style={{ color: 'var(--color-success)' }}>Zertifikat öffnen →</a>
          </div>
        ) : (
          <div className="box-info" style={{ marginTop: 'var(--space-md)' }}>
            Das Zertifikat wird freigeschaltet, wenn du alle {totalRequired} Pflichtmodule bestanden hast.
          </div>
        )}
      </div>

      {/* Modulliste */}
      <h2 style={{ color: 'var(--color-platform)' }}>Deine Module</h2>

      {loading ? (
        <p>Fortschritt wird geladen …</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {MODULES.map(mod => {
            const prog   = getModuleProgress(mod.id)
            const status = prog?.status ?? 'not_started'
            const sl     = STATUS_LABELS[status]

            return (
              <div
                key={mod.id}
                className="card"
                style={{
                  borderLeft:  `6px solid ${mod.color}`,
                  marginBottom: 0,
                  display:     'flex',
                  alignItems:  'center',
                  gap:         'var(--space-md)',
                  flexWrap:    'wrap',
                  opacity:     mod.available ? 1 : 0.7,
                }}
              >
                {/* Icon */}
                <div style={{
                  fontSize:     '2.2rem',
                  background:   mod.colorLight,
                  borderRadius: 'var(--radius-md)',
                  width:        '56px',
                  height:       '56px',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  flexShrink:   0,
                }}>
                  {mod.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, color: mod.color }}>{mod.title}</h3>
                    {mod.optional && (
                      <span className="pill" style={{ fontSize: '0.75rem' }}>Optional</span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 6px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    {mod.description}
                  </p>
                  <span style={{
                    fontSize:   'var(--font-size-xs)',
                    fontWeight: 700,
                    color:      sl.color,
                  }}>
                    ● {sl.label}
                  </span>
                  {prog?.score !== undefined && prog.score > 0 && (
                    <span style={{ marginLeft: '12px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {prog.score} / {prog.max_score} Punkte
                    </span>
                  )}
                </div>

                {/* Button */}
                <div>
                  {mod.available ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(mod.path)}
                      style={{ background: mod.color }}
                    >
                      {status === 'not_started' ? 'Starten →'
                        : status === 'passed'   ? 'Wiederholen'
                        : 'Weiter →'}
                    </button>
                  ) : (
                    <span style={{
                      fontSize:   'var(--font-size-sm)',
                      color:      'var(--color-text-muted)',
                      fontStyle:  'italic',
                    }}>
                      Demnächst verfügbar
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}