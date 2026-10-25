// ============================================================
// KI-Führerschein · Modul-Navigation
// Stil: Modul 5 – sticky, Teal, Gold für aktive Elemente
// ============================================================

import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ModuleNav({
  onBack,
  onNext,
  backLabel    = '← Zurück',
  nextLabel    = 'Weiter →',
  nextDisabled = false,
  showOverview = true,
  score,
  maxScore,
  progressPercent,
  moduleColor  = 'var(--color-platform-teal)',
}) {
  const navigate = useNavigate()

  return (
    <div
      className="no-print"
      style={{
        position:     'sticky',
        top:          '56px',
        zIndex:       90,
        background:   'white',
        border:       '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding:      '12px 16px',
        margin:       '12px 0',
        boxShadow:    'var(--shadow-sm)',
      }}
      aria-label="Lernfortschritt"
    >
      <div style={{
        display:    'flex',
        gap:        '12px',
        alignItems: 'center',
        flexWrap:   'wrap',
      }}>
        {/* Fortschrittsbalken */}
        {progressPercent !== undefined && (
          <>
            <strong style={{ whiteSpace: 'nowrap', fontSize: '0.88rem', color: 'var(--color-text)' }}>
              Fortschritt: <span>{progressPercent} %</span>
            </strong>
            <div className="progress-shell dark" style={{ flex: 1, minWidth: '140px' }}>
              <div
                className="progress-bar"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </>
        )}

        {/* Punkte */}
        {score !== undefined && (
          <div style={{
            fontWeight:  800,
            color:       moduleColor,
            whiteSpace:  'nowrap',
            fontSize:    '0.9rem',
          }}>
            ⭐ {score} / {maxScore} Punkte
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {showOverview && (
            <button
              className="nav-btn"
              onClick={() => navigate('/dashboard')}
            >
              Modulübersicht
            </button>
          )}
          {onBack && (
            <button className="nav-btn" onClick={onBack}>
              {backLabel}
            </button>
          )}
          {onNext && (
            <button
              className="btn btn-primary"
              onClick={onNext}
              disabled={nextDisabled}
              style={{ fontSize: '0.88rem', padding: '8px 16px', minHeight: '38px' }}
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}