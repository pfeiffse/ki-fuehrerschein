// ModuleSkip - Modul überspringen mit Code (für Entwickler/Lehrkräfte)

import React, { useState } from 'react'
import { checkSkipCode, checkMasterCode, logSkip } from '../../lib/devSkip.js'
import { getStudentLocal } from '../../lib/auth.js'

export default function ModuleSkip({ onSkip, moduleName, moduleId }) {
  const [open,    setOpen]    = useState(false)
  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const student = getStudentLocal()
    const studentName = student?.display_name || 'unbekannt'

    if (checkSkipCode(code) || checkMasterCode(code)) {
      // Logging
      await logSkip(moduleId || moduleName, studentName, code)
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setCode('')
        onSkip(checkMasterCode(code))
      }, 1200)
    } else {
      setError('Falscher Code.')
      setCode('')
    }
  }

  return (
    <>
      {/* Sichtbarer Button – dezent aber auffindbar */}
      <div style={{ textAlign: 'center', marginTop: 'var(--sp-lg)', paddingTop: 'var(--sp-md)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => setOpen(true)}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 14px', borderRadius: '99px', fontWeight: 600 }}>
          🔑 Modul überspringen (Lehrkraft)
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '22rem', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                <p style={{ fontWeight: 800, color: 'var(--c-success)', margin: 0 }}>{moduleName} übersprungen!</p>
              </div>
            ) : (
              <>
                <h3 style={{ margin: '0 0 0.25rem', color: 'var(--c-dark)' }}>🔑 Modul überspringen</h3>
                <p style={{ margin: '0 0 1rem', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
                  Nur für Lehrkräfte. Code eingeben:
                </p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="password"
                    value={code}
                    onChange={e => { setCode(e.target.value); setError('') }}
                    placeholder="Code eingeben …"
                    autoFocus
                    style={{ width: '100%', padding: '0.625rem', border: `2px solid ${error ? 'var(--c-error)' : 'var(--c-border)'}`, borderRadius: 'var(--r-md)', font: 'inherit', fontSize: '1rem', marginBottom: '0.5rem', boxSizing: 'border-box' }}
                  />
                  {error && <p style={{ color: 'var(--c-error)', fontSize: 'var(--fs-xs)', margin: '0 0 0.5rem', fontWeight: 700 }}>{error}</p>}
                  <p style={{ fontSize: '0.7rem', color: 'var(--c-muted)', margin: '0 0 0.75rem' }}>
                    💡 Mit dem Master-Code werden alle Module gleichzeitig abgeschlossen.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" style={{ flex: 1, background: 'var(--slzb-navy)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', padding: '0.625rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Überspringen
                    </button>
                    <button type="button" onClick={() => { setOpen(false); setCode(''); setError('') }}
                      style={{ flex: 1, background: 'var(--c-pale2)', color: 'var(--c-dark)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)', padding: '0.625rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Abbrechen
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
