// ============================================================
// KI-Führerschein · Modul-Navigation
// Zurück · Weiter · Zur Übersicht (wie Modul 2 sticky dashboard)
// ============================================================

import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ModuleNav({
  onBack,
  onNext,
  backLabel  = '← Zurück',
  nextLabel  = 'Weiter →',
  nextDisabled = false,
  showOverview = true,
  score,
  maxScore,
  progressPercent,
  moduleColor = 'var(--color-platform)',
}) {
  const navigate = useNavigate()

  return (
    <div
      className="no-print"
      style={{
        position:   'sticky',
        top:        '56px',   // unterhalb PlatformHeader
        zIndex:     90,
        background: 'white',
        border:     '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding:    '12px 16px',
        margin:     '12px 0',
        boxShadow:  'var(--shadow-md)',
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
            <strong style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
              Fortschritt: <span>{progressPercent} %</span>
            </strong>
            <div className="progress-shell" style={{ flex: 1, minWidth: '160px' }}>
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
          <div style={{ fontWeight: 700, color: moduleColor, whiteSpace: 'nowrap' }}>
            ⭐ {score} / {maxScore} Punkte
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {showOverview && (
            <button
              className="btn btn-ghost"
              onClick={() => navigate('/dashboard')}
              style={{ fontSize: '0.85rem', padding: '8px 12px', minHeight: '38px' }}
            >
              Modulübersicht
            </button>
          )}
          {onBack && (
            <button
              className="btn btn-secondary"
              onClick={onBack}
              style={{ fontSize: '0.85rem', padding: '8px 12px', minHeight: '38px' }}
            >
              {backLabel}
            </button>
          )}
          {onNext && (
            <button
              className="btn btn-primary"
              onClick={onNext}
              disabled={nextDisabled}
              style={{ fontSize: '0.85rem', padding: '8px 12px', minHeight: '38px' }}
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}