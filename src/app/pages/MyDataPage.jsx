// ============================================================
// KI-Führerschein · Meine Daten
// Art. 17 DSGVO – Recht auf Löschung
// Art. 20 DSGVO – Recht auf Datenübertragbarkeit
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { getStudentLocal, studentLogout } from '../../lib/auth.js'
import { getAchievementsLocal, getMerksatz, MODULES } from '../../lib/achievements.js'
import { loadAllProgress, loadTaskProgress } from '../../lib/progress.js'
import { InfoBox, WarningBox } from '../../components/ui/InfoBox.jsx'

export default function MyDataPage() {
  const navigate = useNavigate()

  const [student,      setStudent]      = useState(null)
  const [allProgress,  setAllProgress]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [deleteStep,   setDeleteStep]   = useState(0)   // 0=idle, 1=confirm, 2=done
  const [deleteError,  setDeleteError]  = useState('')
  const [exportDone,   setExportDone]   = useState(false)

  useEffect(() => {
    async function load() {
      const s = getStudentLocal()
      setStudent(s)
      if (s) {
        const prog = await loadAllProgress()
        setAllProgress(prog)
      }
      setLoading(false)
    }
    load()
  }, [])

  // ── Datenexport (Art. 20 DSGVO) ──────────────────────────

  async function handleExport() {
    const s            = getStudentLocal()
    const achievements = getAchievementsLocal()
    const merksatz     = getMerksatz()

    // Aufgaben-Fortschritt für alle Module laden
    const taskData = {}
    for (const mod of MODULES) {
      taskData[mod.id] = await loadTaskProgress(mod.id)
    }

    const exportData = {
      export_date:    new Date().toISOString(),
      export_info:    'KI-Führerschein Klasse 7 – Datenauszug gemäß Art. 20 DSGVO',
      hinweis:        'Dein persönlicher Merksatz und dein Zertifikatsname werden nur lokal gespeichert und sind nicht auf dem Server vorhanden.',
      profil: {
        anzeigename:   s?.display_name ?? '(nicht verfügbar)',
        beigetreten:   s?.created_at ?? '(nicht verfügbar)',
        klasse:        s?.classes?.name ?? '(nicht verfügbar)',
      },
      module_fortschritt: allProgress.map(p => ({
        modul:        p.module_id,
        status:       p.status,
        punkte:       p.score,
        max_punkte:   p.max_score,
        bestanden:    p.passed,
        begonnen_am:  p.started_at,
        abgeschlossen_am: p.completed_at,
      })),
      achievements: Object.entries(achievements).map(([moduleId, data]) => ({
        modul:        moduleId,
        erworben_am:  data.earnedAt,
      })),
      lokale_daten: {
        merksatz_vorhanden: merksatz.length > 0,
        hinweis: 'Der Merksatz selbst wird aus Datenschutzgründen nicht exportiert, da er nur lokal gespeichert ist.',
      },
    }

    // Als JSON-Datei herunterladen
    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      { type: 'application/json;charset=utf-8;' }
    )
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `ki-fuehrerschein-daten-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
  }

  // ── Datenlöschung (Art. 17 DSGVO) ────────────────────────

  async function handleDelete() {
    const s = getStudentLocal()
    if (!s?.id) { setDeleteError('Kein Konto gefunden.'); return }

    try {
      // 1. Aufgaben-Fortschritt löschen
      const { error: e1 } = await supabase
        .from('student_task_progress')
        .delete()
        .eq('student_id', s.id)
      if (e1) throw e1

      // 2. Modul-Fortschritt löschen
      const { error: e2 } = await supabase
        .from('student_module_progress')
        .delete()
        .eq('student_id', s.id)
      if (e2) throw e2

      // 3. Zertifikat löschen (falls vorhanden)
      const { error: e3 } = await supabase
        .from('certificates')
        .delete()
        .eq('student_id', s.id)
      if (e3 && e3.code !== 'PGRST116') throw e3  // PGRST116 = not found, ok

      // 4. Schüler-Datensatz löschen
      const { error: e4 } = await supabase
        .from('students')
        .delete()
        .eq('id', s.id)
      if (e4) throw e4

      // 5. Lokale Daten löschen
      const keysToDelete = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('ki_')) keysToDelete.push(key)
      }
      keysToDelete.forEach(k => localStorage.removeItem(k))

      setDeleteStep(2)

    } catch (err) {
      setDeleteError(`Fehler beim Löschen: ${err.message}. Bitte wende dich an deine Lehrkraft.`)
    }
  }

  if (loading) return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap"><p style={{ color: 'var(--color-text-muted)' }}>Wird geladen …</p></div>
    </div>
  )

  // Löschung abgeschlossen
  if (deleteStep === 2) return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap" style={{ maxWidth: '600px' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✅</div>
          <h2 style={{ color: 'var(--color-success)' }}>Alle Daten gelöscht</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Dein Konto und alle gespeicherten Daten wurden vollständig gelöscht.
            Du wirst jetzt zur Startseite weitergeleitet.
          </p>
          <button className="btn btn-primary" onClick={() => { studentLogout(); navigate('/') }}
            style={{ marginTop: 'var(--space-lg)' }}>
            Zur Startseite →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap" style={{ maxWidth: '800px' }}>

        {/* Hero */}
        <div className="hero">
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein · Datenschutz</div>
          <h1 style={{ margin: '8px 0 6px' }}>📦 Meine Daten</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Hier kannst du deine Daten herunterladen oder löschen.
          </p>
        </div>

        {/* Übersicht gespeicherter Daten */}
        <div className="card">
          <h2>Was ist gespeichert?</h2>

          {/* Profil */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ color: 'var(--color-platform-teal)', marginBottom: 'var(--space-sm)' }}>
              👤 Profil
            </h3>
            <div style={{ background: 'var(--color-platform-pale)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 700 }}>Anzeigename:</span>
                <span>{student?.display_name ?? '–'}</span>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 700 }}>Beigetreten:</span>
                <span>{student?.created_at ? new Date(student.created_at).toLocaleDateString('de-DE') : '–'}</span>
              </div>
            </div>
          </div>

          {/* Modul-Fortschritt */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ color: 'var(--color-platform-teal)', marginBottom: 'var(--space-sm)' }}>
              📚 Modul-Fortschritt ({allProgress.length} Einträge)
            </h3>
            {allProgress.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Noch kein Fortschritt gespeichert.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Modul</th>
                      <th>Status</th>
                      <th>Punkte</th>
                      <th>Bestanden</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProgress.map(p => (
                      <tr key={p.module_id}>
                        <td style={{ fontSize: 'var(--font-size-sm)' }}>{p.module_id}</td>
                        <td style={{ fontSize: 'var(--font-size-sm)' }}>{p.status}</td>
                        <td style={{ fontSize: 'var(--font-size-sm)' }}>{p.score} / {p.max_score}</td>
                        <td style={{ fontSize: 'var(--font-size-sm)', color: p.passed ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                          {p.passed ? '✓ Ja' : 'Nein'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Lokale Daten */}
          <div>
            <h3 style={{ color: 'var(--color-platform-teal)', marginBottom: 'var(--space-sm)' }}>
              💻 Nur auf diesem Gerät gespeichert
            </h3>
            <InfoBox>
              Dein persönlicher Merksatz und dein Zertifikatsname sind
              <strong> nur in diesem Browser</strong> gespeichert –
              nicht auf unserem Server. Sie werden beim Löschen ebenfalls entfernt.
            </InfoBox>
          </div>
        </div>

        {/* Export */}
        <div className="card">
          <h2>📦 Daten herunterladen</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Du kannst alle über dich gespeicherten Daten als Datei herunterladen
            (Art. 20 DSGVO – Recht auf Datenübertragbarkeit).
          </p>
          {exportDone && (
            <div className="feedback correct" style={{ display: 'block', marginBottom: 'var(--space-md)' }}>
              ✅ Datei wurde heruntergeladen.
            </div>
          )}
          <button className="btn btn-primary" onClick={handleExport}>
            📥 Meine Daten als JSON herunterladen
          </button>
        </div>

        {/* Löschung */}
        <div className="card" style={{ border: '2px solid var(--color-error-light)' }}>
          <h2 style={{ color: 'var(--color-error)' }}>🗑️ Alle Daten löschen</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Du kannst alle gespeicherten Daten löschen (Art. 17 DSGVO – Recht auf Löschung).
            Das umfasst deinen Fortschritt, deine Achievements und dein Konto.
          </p>

          {deleteStep === 0 && (
            <>
              <WarningBox title="Achtung:">
                Diese Aktion kann nicht rückgängig gemacht werden.
                Dein gesamter Lernfortschritt wird unwiderruflich gelöscht.
              </WarningBox>
              <div className="actions">
                <button className="btn" onClick={() => setDeleteStep(1)}
                  style={{ background: 'var(--color-error)', color: 'white' }}>
                  Alle Daten löschen
                </button>
              </div>
            </>
          )}

          {deleteStep === 1 && (
            <>
              <div style={{
                background:   'var(--color-error-light)',
                border:       '2px solid var(--color-error)',
                borderRadius: 'var(--radius-lg)',
                padding:      'var(--space-lg)',
                marginBottom: 'var(--space-md)',
                textAlign:    'center',
              }}>
                <p style={{ fontWeight: 800, color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>
                  Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <div className="actions" style={{ justifyContent: 'center' }}>
                  <button className="btn" onClick={handleDelete}
                    style={{ background: 'var(--color-error)', color: 'white' }}>
                    Ja, alle Daten endgültig löschen
                  </button>
                  <button className="btn btn-ghost" onClick={() => setDeleteStep(0)}>
                    Abbrechen
                  </button>
                </div>
              </div>
              {deleteError && (
                <div className="feedback wrong" style={{ display: 'block' }}>{deleteError}</div>
              )}
            </>
          )}
        </div>

        <div className="actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Zurück</button>
          <button className="btn btn-ghost" onClick={() => navigate('/datenschutz')}>
            🔒 Datenschutzerklärung lesen
          </button>
        </div>
      </div>
    </div>
  )
}