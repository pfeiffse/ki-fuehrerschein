// ============================================================
// KI-Führerschein · Lehrkraft-Dashboard
// Stil: Modul 5 – dunkles Petrol, Teal, Gold
// ============================================================

import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { teacherLogout, getTeacherProfile } from '../../lib/auth.js'

const MODULE_LABELS = {
  'modul-01': 'Was ist KI?',
  'modul-02': 'KI sinnvoll nutzen',
  'modul-03': 'Kennzeichnungspflicht',
  'modul-04': 'Datenschutz',
  'modul-05': 'KI & Nachhaltigkeit',
}

const STATUS_DISPLAY = {
  not_started: { label: '–',             color: '#8899aa' },
  in_progress: { label: 'In Bearb.',     color: '#e7a32a' },
  completed:   { label: 'Abgeschl.',     color: '#2484bb' },
  passed:      { label: '✓ Bestanden',   color: '#21875d' },
}

export default function TeacherDashboard({ teacher, onLogout }) {
  const [profile,       setProfile]       = useState(null)
  const [classes,       setClasses]       = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students,      setStudents]      = useState([])
  const [progress,      setProgress]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [showNewClass,  setShowNewClass]  = useState(false)

  useEffect(() => {
    async function load() {
      const prof = await getTeacherProfile()
      setProfile(prof)
      const { data: cls } = await supabase
        .from('classes').select('*')
        .eq('teacher_id', prof?.id)
        .order('created_at', { ascending: false })
      setClasses(cls ?? [])
      if (cls?.length > 0) setSelectedClass(cls[0])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    async function loadClass() {
      setLoading(true)
      const { data: studs } = await supabase
        .from('students').select('*')
        .eq('class_id', selectedClass.id)
        .order('display_name')
      const ids = (studs ?? []).map(s => s.id)
      const { data: prog } = ids.length > 0
        ? await supabase.from('student_module_progress').select('*').in('student_id', ids)
        : { data: [] }
      setStudents(studs ?? [])
      setProgress(prog ?? [])
      setLoading(false)
    }
    loadClass()
  }, [selectedClass])

  function getProgress(studentId, moduleId) {
    return progress.find(p => p.student_id === studentId && p.module_id === moduleId)
  }

  function exportCSV() {
    const moduleIds = Object.keys(MODULE_LABELS)
    const header = ['Name', 'Beigetreten',
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Status)'),
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Punkte)')]
    const rows = students.map(s => [
      s.display_name,
      new Date(s.created_at).toLocaleDateString('de-DE'),
      ...moduleIds.map(mid => getProgress(s.id, mid)?.status ?? 'not_started'),
      ...moduleIds.map(mid => getProgress(s.id, mid)?.score ?? 0),
    ])
    const csv = [header, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `ki-fuehrerschein_${selectedClass?.name ?? 'klasse'}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleLogout() {
    await teacherLogout()
    onLogout()
  }

  const moduleIds = Object.keys(MODULE_LABELS)

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Header */}
        <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '6px' }}>KI-Führerschein · Lehrkraft-Bereich</div>
            <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
              👩‍🏫 Dashboard
            </h1>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>
              {profile?.display_name ?? ''} · {profile?.schools?.name ?? 'KI-Führerschein'}
            </p>
          </div>
          <button className="btn" onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>
            Abmelden
          </button>
        </div>

        {/* Klassen */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <h2 style={{ margin: 0 }}>Meine Klassen</h2>
            <button className="btn btn-primary" onClick={() => setShowNewClass(true)}
              style={{ fontSize: '0.9rem', padding: '10px 16px', minHeight: '40px' }}>
              + Neue Klasse
            </button>
          </div>

          {/* Klassen-Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
            {classes.map(cls => (
              <button key={cls.id} onClick={() => setSelectedClass(cls)}
                className={`nav-btn ${selectedClass?.id === cls.id ? 'active' : ''}`}>
                {cls.name}
                <span style={{ marginLeft: '6px', opacity: 0.65, fontWeight: 400, fontSize: '0.8rem' }}>
                  Jg. {cls.grade}
                </span>
              </button>
            ))}
            {classes.length === 0 && !loading && (
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Noch keine Klassen angelegt.</p>
            )}
          </div>

          {/* Klassencode */}
          {selectedClass && (
            <div className="box-info">
              <strong>Klassencode für Schüler:innen:</strong>{' '}
              <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.12em', color: 'var(--color-platform)' }}>
                {selectedClass.join_code}
              </span>
              <span style={{ marginLeft: '12px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Diesen Code geben Schüler:innen bei der Anmeldung ein.
              </span>
            </div>
          )}
        </div>

        {/* Schülerfortschritt */}
        {selectedClass && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <h2 style={{ margin: 0 }}>
                Klasse {selectedClass.name} · {students.length} Schüler:innen
              </h2>
              <button className="btn btn-ghost" onClick={exportCSV}
                style={{ fontSize: '0.9rem', padding: '10px 16px', minHeight: '40px' }}>
                📥 CSV exportieren
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--color-text-muted)' }}>Wird geladen …</p>
            ) : students.length === 0 ? (
              <div className="box-info">
                Noch keine Schüler:innen. Teile den Code <strong>{selectedClass.join_code}</strong> mit deiner Klasse.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      {moduleIds.map(mid => (
                        <th key={mid} style={{ minWidth: '110px', fontSize: '0.82rem' }}>
                          {MODULE_LABELS[mid]}
                        </th>
                      ))}
                      <th>Gesamt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => {
                      const passedCount = moduleIds.slice(0,4).filter(mid => getProgress(s.id, mid)?.passed).length
                      return (
                        <tr key={s.id}>
                          <td>
                            <strong>{s.display_name}</strong>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                              {new Date(s.created_at).toLocaleDateString('de-DE')}
                            </div>
                          </td>
                          {moduleIds.map(mid => {
                            const p  = getProgress(s.id, mid)
                            const st = p?.status ?? 'not_started'
                            const sd = STATUS_DISPLAY[st]
                            return (
                              <td key={mid} style={{ textAlign: 'center' }}>
                                <span style={{ color: sd.color, fontWeight: 800, fontSize: '0.85rem' }}>{sd.label}</span>
                                {p?.score > 0 && (
                                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                    {p.score}/{p.max_score} Pkt.
                                  </div>
                                )}
                              </td>
                            )
                          })}
                          <td style={{ textAlign: 'center', fontWeight: 800 }}>
                            <span style={{ color: passedCount >= 4 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                              {passedCount}/4
                            </span>
                            {passedCount >= 4 && (
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-abschluss)' }}>🏆 Zertifikat</div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Klassenstatistik */}
            {students.length > 0 && (
              <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)' }}>
                <h3 style={{ color: 'var(--color-platform-teal)', marginTop: 0 }}>Klassenstatistik (Pflichtmodule)</h3>
                <div className="grid-3">
                  {moduleIds.slice(0,4).map(mid => {
                    const passedInModule = students.filter(s => getProgress(s.id, mid)?.passed).length
                    const pct = students.length > 0 ? Math.round((passedInModule / students.length) * 100) : 0
                    return (
                      <div key={mid} style={{
                        background:   'var(--color-platform-pale)',
                        border:       '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding:      'var(--space-md)',
                        textAlign:    'center',
                      }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-platform-teal)' }}>{pct} %</div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{MODULE_LABELS[mid]}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{passedInModule} / {students.length} bestanden</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Neue Klasse */}
        {showNewClass && (
          <NewClassForm
            teacherId={profile?.id}
            schoolId={profile?.school_id}
            onCreated={cls => { setClasses(c => [cls, ...c]); setSelectedClass(cls); setShowNewClass(false) }}
            onCancel={() => setShowNewClass(false)}
          />
        )}
      </div>
    </div>
  )
}

// ── Neue Klasse anlegen ───────────────────────────────────────

function NewClassForm({ teacherId, schoolId, onCreated, onCancel }) {
  const [name,    setName]    = useState('')
  const [grade,   setGrade]   = useState(7)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Bitte einen Klassennamen eingeben.'); return }
    setLoading(true)
    const joinCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    const { data, error: err } = await supabase
      .from('classes')
      .insert({ name: name.trim(), grade, teacher_id: teacherId, school_id: schoolId, join_code: joinCode })
      .select().single()
    setLoading(false)
    if (err) { setError('Fehler: ' + err.message); return }
    onCreated(data)
  }

  const inputStyle = {
    width: '100%', padding: '12px',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '1rem', fontFamily: 'inherit',
    background: 'var(--color-platform-pale)',
  }

  return (
    <div className="card" style={{ border: '2px solid var(--color-platform-teal)' }}>
      <h2 style={{ marginTop: 0 }}>Neue Klasse anlegen</h2>
      <form onSubmit={handleCreate} noValidate>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
          <div style={{ flex: 2, minWidth: '180px' }}>
            <label htmlFor="className" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Klassenname</label>
            <input id="className" type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="z. B. 7a" style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label htmlFor="grade" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Jahrgang</label>
            <select id="grade" value={grade} onChange={e => setGrade(Number(e.target.value))} style={inputStyle}>
              {[7,8,9,10,11,12,13].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="box-warning" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}
        <div className="actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Wird angelegt …' : 'Klasse anlegen'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>
        </div>
      </form>
    </div>
  )
}