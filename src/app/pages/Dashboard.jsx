// ============================================================
// KI-Führerschein · Schüler-Dashboard
// Stil: Modul 5 – Teal, Gold, Petrol
// ============================================================

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadAllProgress, checkCertificateEligibility } from '../../lib/progress.js'

const REQUIRED_MODULES = ['modul-01', 'modul-02', 'modul-03', 'modul-04']

const MODULES = [
  {
    id:         'modul-01',
    title:      'Was ist KI?',
    description:'Trainingsdaten, Mustererkennung und wie Sprach-KI funktioniert.',
    icon:       '🤖',
    color:      '#2859d8',
    colorLight: '#e6f4ff',
    path:       '/modul/01',
    optional:   false,
    available:  false,
  },
  {
    id:         'modul-02',
    title:      'KI sinnvoll nutzen',
    description:'Fehler erkennen, Prompts formulieren, Verantwortung übernehmen.',
    icon:       '🧠',
    color:      '#087f83',
    colorLight: '#dff5f1',
    path:       '/modul/02',
    optional:   false,
    available:  true,
  },
  {
    id:         'modul-03',
    title:      'Kennzeichnungspflicht',
    description:'Wann und wie KI-generierte Inhalte gekennzeichnet werden müssen.',
    icon:       '🏷️',
    color:      '#1a6b7a',
    colorLight: '#e0f4f6',
    path:       '/modul/03',
    optional:   false,
    available:  false,
  },
  {
    id:         'modul-04',
    title:      'Datenschutz',
    description:'Welche Daten du bei der KI-Nutzung schützen musst.',
    icon:       '🔒',
    color:      '#095c6b',
    colorLight: '#dff4ec',
    path:       '/modul/04',
    optional:   false,
    available:  false,
  },
  {
    id:         'modul-05',
    title:      'KI & Nachhaltigkeit',
    description:'Ressourcen, Energiebedarf und bewusster Umgang mit KI.',
    icon:       '🌍',
    color:      '#087f83',
    colorLight: '#dff5f1',
    path:       '/modul/05',
    optional:   true,
    available:  false,
  },
]

const STATUS_CONFIG = {
  not_started: { label: 'Noch nicht begonnen', color: '#8899aa', dot: '○' },
  in_progress: { label: 'In Bearbeitung',       color: '#e7a32a', dot: '◑' },
  completed:   { label: 'Abgeschlossen',         color: '#2484bb', dot: '●' },
  passed:      { label: 'Bestanden',             color: '#21875d', dot: '✓' },
}

export default function Dashboard({ student }) {
  const navigate = useNavigate()
  const [progress, setProgress] = useState([])
  const [eligible, setEligible] = useState(false)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      const [all, cert] = await Promise.all([
        loadAllProgress(),
        checkCertificateEligibility(REQUIRED_MODULES),
      ])
      setProgress(all)
      setEligible(cert)
      setLoading(false)
    }
    load()
  }, [])

  function getModuleProgress(moduleId) {
    return progress.find(p => p.module_id === moduleId)
  }

  const passedCount   = REQUIRED_MODULES.filter(id => getModuleProgress(id)?.passed).length
  const overallPct    = Math.round((passedCount / REQUIRED_MODULES.length) * 100)

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
            Hier siehst du alle Module und deinen Fortschritt.
          </p>

          {/* Gesamtfortschritt im Hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <div className="progress-shell" style={{ height: '13px' }}>
                <div className="progress-bar" style={{ width: `${overallPct}%` }}
                  role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              {passedCount} / {REQUIRED_MODULES.length} Pflichtmodule bestanden
            </div>
          </div>
        </div>

        {/* Zertifikat-Hinweis */}
        {eligible ? (
          <div className="box-memory" style={{ marginBottom: 'var(--space-lg)' }}>
            🏆 Du hast alle Pflichtmodule bestanden! Dein Zertifikat ist freigeschaltet.{' '}
            <a href="/zertifikat" style={{ color: 'var(--color-success)' }}>Zertifikat öffnen →</a>
          </div>
        ) : (
          <div className="box-info" style={{ marginBottom: 'var(--space-lg)' }}>
            Das Zertifikat wird freigeschaltet, wenn du alle {REQUIRED_MODULES.length} Pflichtmodule bestanden hast.
          </div>
        )}

        {/* Modulliste */}
        <h2 style={{ color: 'var(--color-platform)', marginBottom: 'var(--space-md)' }}>
          Deine Module
        </h2>

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Fortschritt wird geladen …</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {MODULES.map(mod => {
              const prog   = getModuleProgress(mod.id)
              const status = prog?.status ?? 'not_started'
              const sc     = STATUS_CONFIG[status]

              return (
                <div
                  key={mod.id}
                  className="card"
                  style={{
                    marginBottom: 0,
                    display:      'flex',
                    alignItems:   'center',
                    gap:          'var(--space-md)',
                    flexWrap:     'wrap',
                    borderLeft:   `5px solid ${mod.available ? mod.color : '#c9e3e8'}`,
                    opacity:      mod.available ? 1 : 0.72,
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    fontSize:       '2rem',
                    background:     mod.colorLight,
                    borderRadius:   'var(--radius-lg)',
                    width:          '58px',
                    height:         '58px',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    flexShrink:     0,
                  }}>
                    {mod.icon}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h3 style={{ margin: 0, color: mod.available ? mod.color : 'var(--color-text-muted)', fontSize: '1.05rem' }}>
                        {mod.title}
                      </h3>
                      {mod.optional && (
                        <span className="pill-dark" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '99px' }}>
                          Optional
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 6px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                      {mod.description}
                    </p>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: sc.color }}>
                      {sc.dot} {sc.label}
                    </span>
                    {prog?.score > 0 && (
                      <span style={{ marginLeft: '12px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        · {prog.score} / {prog.max_score} Punkte
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
                        fontSize:  'var(--font-size-sm)',
                        color:     'var(--color-text-muted)',
                        fontStyle: 'italic',
                      }}>
                        Demnächst
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}