// ============================================================
// KI-Führerschein · Lehrkraft-Dashboard
// ============================================================

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { teacherLogout, getTeacherProfile } from '../../lib/auth.js'

const MODULE_LABELS = {
  'modul-01': 'Was ist KI?',
  'modul-02': 'KI sinnvoll nutzen',
  'modul-03': 'Kennzeichnung & DS',
  'modul-04': 'KI & Nachhaltigkeit',
}

const STATUS_DISPLAY = {
  not_started: { label: '–',           color: '#8899aa', bg: 'transparent' },
  in_progress: { label: 'In Bearb.',   color: '#e7a32a', bg: '#fff3d8'     },
  completed:   { label: 'Abgeschl.',   color: '#2484bb', bg: '#e8f5fc'     },
  passed:      { label: '✓ Bestanden', color: '#21875d', bg: '#d8f4e5'     },
}

export default function TeacherDashboard({ teacher, onLogout }) {
  const navigate = useNavigate()
  const [profile,         setProfile]         = useState(null)
  const [classes,         setClasses]         = useState([])
  const [selectedClass,   setSelectedClass]   = useState(null)
  const [students,        setStudents]        = useState([])
  const [progress,        setProgress]        = useState([])
  const [loading,         setLoading]         = useState(true)
  const [showNewClass,    setShowNewClass]    = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    async function load() {
      const prof = await getTeacherProfile()
      setProfile(prof)
      const { data: cls } = await supabase
        .from('classes').select('*')
        .eq('teacher_id', prof?.id)
        .order('grade').order('name')
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
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Punkte)'),
      'Zertifikat']
    const rows = students.map(s => {
      const statuses = moduleIds.map(mid => getProgress(s.id, mid)?.status ?? 'not_started')
      const scores   = moduleIds.map(mid => getProgress(s.id, mid)?.score ?? 0)
      const cert     = moduleIds.every(mid => getProgress(s.id, mid)?.passed) ? 'Ja' : 'Nein'
      return [s.display_name, new Date(s.created_at).toLocaleDateString('de-DE'), ...statuses, ...scores, cert]
    })
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `ki-fuehrerschein_${selectedClass?.name ?? 'klasse'}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleLogout() { await teacherLogout(); onLogout() }

  const moduleIds  = Object.keys(MODULE_LABELS)
  const stats      = moduleIds.map(mid => ({
    mid, label: MODULE_LABELS[mid],
    passed:     students.filter(s => getProgress(s.id, mid)?.passed).length,
    inProgress: students.filter(s => getProgress(s.id, mid)?.status === 'in_progress').length,
  }))
  const certCount = students.filter(s => moduleIds.every(mid => getProgress(s.id, mid)?.passed)).length

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Header */}
        <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '6px' }}>KI-Führerschein · Lehrkraft-Bereich</div>
            <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>👩‍🏫 Dashboard</h1>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>
              {profile?.display_name ?? ''} · {profile?.schools?.name ?? 'KI-Führerschein'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {profile?.role === 'superadmin' && (
              <button className="btn" onClick={() => navigate('/admin')}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontSize: '0.9rem' }}>
                🛡️ Admin-Ansicht
              </button>
            )}
            <button className="btn" onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>
              Abmelden
            </button>
          </div>
        </div>

        {/* Klassen-Tabs */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <h2 style={{ margin: 0, color: 'var(--color-platform-teal)' }}>Meine Klassen</h2>
            <button className="btn btn-primary" onClick={() => setShowNewClass(true)}
              style={{ fontSize: '0.9rem', padding: '8px 14px', minHeight: '38px' }}>
              + Neue Klasse
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
            {classes.map(cls => (
              <button key={cls.id} onClick={() => { setSelectedClass(cls); setSelectedStudent(null) }}
                className={`nav-btn ${selectedClass?.id === cls.id ? 'active' : ''}`}>
                {cls.name}
                <span style={{ marginLeft: '6px', opacity: 0.65, fontWeight: 400, fontSize: '0.8rem' }}>Jg. {cls.grade}</span>
              </button>
            ))}
            {classes.length === 0 && !loading && (
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Noch keine Klassen angelegt.</p>
            )}
          </div>

          {/* Klassencode */}
          {selectedClass && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap', padding: 'var(--space-md)', background: 'var(--color-platform-pale)', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '4px' }}>KLASSENCODE</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.12em', color: 'var(--color-platform)' }}>
                  {selectedClass.join_code}
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Diesen Code geben Schüler:innen bei der Anmeldung ein.<br />
                <strong>{students.length}</strong> Schüler:innen angemeldet · <strong>{certCount}</strong> Zertifikate
              </div>
              <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(selectedClass.join_code)}
                style={{ marginLeft: 'auto', fontSize: '0.85rem', padding: '8px 14px', minHeight: '36px' }}>
                📋 Kopieren
              </button>
            </div>
          )}
        </div>

        {/* Klassenstatistik */}
        {selectedClass && students.length > 0 && (
          <div className="card">
            <h2 style={{ color: 'var(--color-platform-teal)', marginTop: 0 }}>Klassenstatistik</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
              {stats.map(s => {
                const pct = students.length > 0 ? Math.round((s.passed / students.length) * 100) : 0
                return (
                  <div key={s.mid} style={{ background: 'var(--color-platform-pale)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '6px' }}>{s.label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-platform-teal)' }}>{pct} %</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {s.passed} bestanden · {s.inProgress} in Bearbeitung
                    </div>
                    <div className="progress-shell dark" style={{ marginTop: '8px' }}>
                      <div className="progress-bar green" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Schüler-Detailansicht */}
        {selectedStudent && (
          <div className="card" style={{ border: '2px solid var(--color-platform-teal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <h2 style={{ color: 'var(--color-platform-teal)', margin: 0 }}>👤 {selectedStudent.display_name}</h2>
              <button className="btn btn-ghost" onClick={() => setSelectedStudent(null)}>✕ Schließen</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              {moduleIds.map(mid => {
                const p  = getProgress(selectedStudent.id, mid)
                const st = p?.status ?? 'not_started'
                const sd = STATUS_DISPLAY[st]
                return (
                  <div key={mid} style={{ background: sd.bg || 'var(--color-platform-pale)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', border: `1px solid ${p?.passed ? 'var(--color-success)' : 'var(--color-border)'}` }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '6px' }}>{MODULE_LABELS[mid]}</div>
                    <div style={{ fontWeight: 800, color: sd.color }}>{sd.label}</div>
                    {p?.score > 0 && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{p.score} / {p.max_score} Punkte</div>}
                    {p?.started_at && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>Begonnen: {new Date(p.started_at).toLocaleDateString('de-DE')}</div>}
                    {p?.completed_at && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', marginTop: '2px' }}>Abgeschlossen: {new Date(p.completed_at).toLocaleDateString('de-DE')}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Schüler-Tabelle */}
        {selectedClass && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <h2 style={{ margin: 0, color: 'var(--color-platform-teal)' }}>
                Klasse {selectedClass.name} · {students.length} Schüler:innen
              </h2>
              <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: '0.9rem', padding: '8px 14px', minHeight: '38px' }}>
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
                      {moduleIds.map(mid => <th key={mid} style={{ minWidth: '110px', fontSize: '0.78rem' }}>{MODULE_LABELS[mid]}</th>)}
                      <th>Zertifikat</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => {
                      const allPassed = moduleIds.every(mid => getProgress(s.id, mid)?.passed)
                      return (
                        <tr key={s.id} style={{ cursor: 'pointer' }}>
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
                                <span style={{ color: sd.color, fontWeight: 700, fontSize: '0.82rem', background: sd.bg, borderRadius: '99px', padding: '2px 8px', display: 'inline-block' }}>
                                  {sd.label}
                                </span>
                                {p?.score > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{p.score}/{p.max_score}</div>}
                              </td>
                            )
                          })}
                          <td style={{ textAlign: 'center', fontWeight: 800, color: allPassed ? '#b8860b' : 'var(--color-text-muted)' }}>
                            {allPassed ? '🏆' : '–'}
                          </td>
                          <td>
                            <button className="nav-btn" onClick={() => setSelectedStudent(s === selectedStudent ? null : s)}
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                              Details
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Neue Klasse */}
        {showNewClass && (
          <NewClassForm teacherId={profile?.id} schoolId={profile?.school_id}
            onCreated={cls => { setClasses(c => [cls, ...c]); setSelectedClass(cls); setShowNewClass(false) }}
            onCancel={() => setShowNewClass(false)} />
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
      <h2 style={{ marginTop: 0, color: 'var(--color-platform-teal)' }}>Neue Klasse anlegen</h2>
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