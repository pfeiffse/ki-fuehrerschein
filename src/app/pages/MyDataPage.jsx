// MyDataPage - Datenverwaltung (Art. 17/20 DSGVO)

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { getStudentLocal, studentLogout } from '../../lib/auth.js'
import { getAchievementsLocal, getMerksatz, MODULES } from '../../lib/achievements.js'
import { loadAllProgress } from '../../lib/progress.js'

export default function MyDataPage() {
  const navigate = useNavigate()
  const [progress,    setProgress]    = useState([])
  const [deleteStep,  setDeleteStep]  = useState(0)
  const [deleteError, setDeleteError] = useState('')
  const student = getStudentLocal()

  useEffect(() => {
    loadAllProgress().then(setProgress).catch(() => {})
  }, [])

  async function handleExport() {
    const data = {
      export_date: new Date().toISOString(),
      info: 'KI-Führerschein – Datenauszug gemäß Art. 20 DSGVO',
      profil: { anzeigename: student?.display_name, beigetreten: student?.created_at },
      module_fortschritt: progress.map(p => ({ modul: p.module_id, status: p.status, punkte: p.score, bestanden: p.passed })),
      achievements: Object.keys(getAchievementsLocal()),
      hinweis: 'Merksatz und Zertifikatsname werden nur lokal gespeichert.',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ki-fuehrerschein-daten-' + new Date().toISOString().slice(0,10) + '.json'
    a.click()
  }

  async function handleDelete() {
    if (!student?.id) { setDeleteError('Kein Konto gefunden.'); return }
    try {
      await supabase.from('student_task_progress').delete().eq('student_id', student.id)
      await supabase.from('student_module_progress').delete().eq('student_id', student.id)
      await supabase.from('students').delete().eq('id', student.id)
      Object.keys(localStorage).filter(k => k.startsWith('ki_')).forEach(k => localStorage.removeItem(k))
      setDeleteStep(2)
    } catch (err) {
      setDeleteError('Fehler: ' + err.message)
    }
  }

  if (deleteStep === 2) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2>Alle Daten gelöscht</h2>
        <p style={{ color: 'var(--c-muted)' }}>Dein Konto und alle gespeicherten Daten wurden gelöscht.</p>
        <button className="btn btn-primary" onClick={() => { studentLogout(); navigate('/') }} style={{ marginTop: '1rem' }}>Zur Startseite</button>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>
      <div className="wrap" style={{ maxWidth: '50rem' }}>
        <div style={{ color: 'white', marginBottom: '1.5rem' }}>
          <h1>📦 Meine Daten</h1>
          <p style={{ opacity: 0.8 }}>Hier kannst du deine Daten herunterladen oder löschen.</p>
        </div>

        <div className="card">
          <h2>Gespeicherte Daten</h2>
          <p><strong>Name:</strong> {student?.display_name ?? '–'}</p>
          <p><strong>Module:</strong> {progress.length} Einträge</p>
          <p style={{ color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>Merksatz und Zertifikatsname werden nur lokal gespeichert – nicht auf dem Server.</p>
        </div>

        <div className="card">
          <h2>📥 Daten herunterladen</h2>
          <p style={{ color: 'var(--c-muted)' }}>Alle gespeicherten Daten als JSON-Datei (Art. 20 DSGVO).</p>
          <button className="btn btn-primary" onClick={handleExport}>Daten herunterladen</button>
        </div>

        <div className="card" style={{ border: '2px solid var(--c-error-bg)' }}>
          <h2 style={{ color: 'var(--c-error)' }}>🗑️ Alle Daten löschen</h2>
          <p style={{ color: 'var(--c-muted)' }}>Löscht deinen Fortschritt, deine Achievements und dein Konto (Art. 17 DSGVO). Nicht rückgängig zu machen.</p>
          {deleteStep === 0 && (
            <button className="btn btn-danger" onClick={() => setDeleteStep(1)}>Alle Daten löschen</button>
          )}
          {deleteStep === 1 && (
            <div>
              <p style={{ fontWeight: 800, color: 'var(--c-error)' }}>Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden.</p>
              <div className="actions">
                <button className="btn btn-danger" onClick={handleDelete}>Ja, endgültig löschen</button>
                <button className="btn btn-ghost" onClick={() => setDeleteStep(0)}>Abbrechen</button>
              </div>
              {deleteError && <p style={{ color: 'var(--c-error)', marginTop: '0.5rem' }}>{deleteError}</p>}
            </div>
          )}
        </div>

        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Zurück</button>
      </div>
    </div>
  )
}