// ============================================================
// KI-Führerschein · Lehrkraft-Dashboard
// Klassenübersicht, Schülerfortschritt, CSV-Export
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
  not_started: { label: '–',              color: '#aab' },
  in_progress: { label: 'In Bearb.',      color: '#f2b705' },
  completed:   { label: 'Abgeschlossen',  color: '#0d76c7' },
  passed:      { label: '✓ Bestanden',    color: '#1e7a46' },
}

export default function TeacherDashboard({ teacher, onLogout }) {
  const [profile,        setProfile]        = useState(null)
  const [classes,        setClasses]        = useState([])
  const [selectedClass,  setSelectedClass]  = useState(null)
  const [students,       setStudents]       = useState([])
  const [progress,       setProgress]       = useState([])   // alle Fortschrittsdaten der Klasse
  const [loading,        setLoading]        = useState(true)
  const [showNewClass,   setShowNewClass]   = useState(false)

  // Profil + Klassen laden
  useEffect(() => {
    async function load() {
      const prof = await getTeacherProfile()
      setProfile(prof)

      const { data: cls } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', prof?.id)
        .order('created_at', { ascending: false })

      setClasses(cls ?? [])
      if (cls?.length > 0) setSelectedClass(cls[0])
      setLoading(false)
    }
    load()
  }, [])

  // Schüler + Fortschritt laden wenn Klasse gewechselt
  useEffect(() => {
    if (!selectedClass) return
    async function loadClass() {
      setLoading(true)

      const { data: studs } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', selectedClass.id)
        .order('display_name')

      const studentIds = (studs ?? []).map(s => s.id)

      const { data: prog } = studentIds.length > 0
        ? await supabase
            .from('student_module_progress')
            .select('*')
            .in('student_id', studentIds)
        : { data: [] }

      setStudents(studs ?? [])
      setProgress(prog ?? [])
      setLoading(false)
    }
    loadClass()
  }, [selectedClass])

  function getStudentProgress(studentId, moduleId) {
    return progress.find(p => p.student_id === studentId && p.module_id === moduleId)
  }

  // CSV-Export
  function exportCSV() {
    const moduleIds = Object.keys(MODULE_LABELS)
    const header = ['Name', 'Beigetreten', ...moduleIds.map(id => MODULE_LABELS[id] + ' (Status)'), ...moduleIds.map(id => MODULE_LABELS[id] + ' (Punkte)')]
    const rows = students.map(s => {
      const statuses = moduleIds.map(mid => {
        const p = getStudentProgress(s.id, mid)
        return p?.status ?? 'not_started'
      })
      const scores = moduleIds.map(mid => {
        const p = getStudentProgress(s.id, mid)
        return p?.score ?? 0
      })
      return [
        s.display_name,
        new Date(s.created_at).toLocaleDateString('de-DE'),
        ...statuses,
        ...scores,
      ]
    })

    const csv = [header, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
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
    <div className="wrap">

      {/* Header */}
      <div style={{
        background:   'linear-gradient(135deg, #064c87, #1184cf)',
        color:        'white',
        padding:      'clamp(20px, 4vw, 32px)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 'var(--space-lg)',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        flexWrap:     'wrap',
        gap:          'var(--space-md)',
      }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            👩‍🏫 Lehrkraft-Dashboard
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
            {profile?.display_name ?? ''} · {profile?.schools?.name ?? 'KI-Führerschein'}
          </p>
        </div>
        <button className="btn" onClick={handleLogout}
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>
          Abmelden
        </button>
      </div>

      {/* Klassen-Tabs */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <h2 style={{ margin: 0, color: 'var(--color-platform)' }}>Meine Klassen</h2>
          <button className="btn btn-primary" onClick={() => setShowNewClass(true)}
            style={{ fontSize: '0.9rem', padding: '8px 14px', minHeight: '38px' }}>
            + Neue Klasse
          </button>
        </div>

        {/* Klassen-Auswahl */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              style={{
                padding:      '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border:       `2px solid ${selectedClass?.id === cls.id ? 'var(--color-platform)' : 'var(--color-border)'}`,
                background:   selectedClass?.id === cls.id ? 'var(--color-platform-light)' : 'white',
                fontWeight:   700,
                cursor:       'pointer',
                fontSize:     '0.9rem',
              }}
            >
              {cls.name}
              <span style={{ marginLeft: '6px', opacity: 0.6, fontWeight: 400, fontSize: '0.8rem' }}>
                Jahrgang {cls.grade}
              </span>
            </button>
          ))}
          {classes.length === 0 && !loading && (
            <p style={{ color: 'var(--color-text-muted)' }}>Noch keine Klassen angelegt.</p>
          )}
        </div>

        {/* Klassencode */}
        {selectedClass && (
          <div className="box-info">
            <strong>Klassencode für Schüler:innen:</strong>{' '}
            <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em' }}>
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
            <h2 style={{ margin: 0, color: 'var(--color-platform)' }}>
              Klasse {selectedClass.name} · {students.length} Schüler:innen
            </h2>
            <button className="btn btn-ghost" onClick={exportCSV}
              style={{ fontSize: '0.9rem', padding: '8px 14px', minHeight: '38px' }}>
              📥 CSV exportieren
            </button>
          </div>

          {loading ? (
            <p>Wird geladen …</p>
          ) : students.length === 0 ? (
            <div className="box-info">
              Noch keine Schüler:innen in dieser Klasse. Teile den Klassencode <strong>{selectedClass.join_code}</strong> mit deiner Klasse.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-platform-light)' }}>
                    <th style={thStyle}>Name</th>
                    {moduleIds.map(mid => (
                      <th key={mid} style={{ ...thStyle, minWidth: '120px' }}>
                        {MODULE_LABELS[mid]}
                      </th>
                    ))}
                    <th style={thStyle}>Gesamt</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => {
                    const totalScore = moduleIds.reduce((sum, mid) => {
                      return sum + (getStudentProgress(s.id, mid)?.score ?? 0)
                    }, 0)
                    const passedCount = moduleIds.filter(mid =>
                      getStudentProgress(s.id, mid)?.passed
                    ).length

                    return (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? 'white' : '#f7fbfc' }}>
                        <td style={tdStyle}>
                          <strong>{s.display_name}</strong>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                            {new Date(s.created_at).toLocaleDateString('de-DE')}
                          </div>
                        </td>
                        {moduleIds.map(mid => {
                          const p  = getStudentProgress(s.id, mid)
                          const st = p?.status ?? 'not_started'
                          const sd = STATUS_DISPLAY[st]
                          return (
                            <td key={mid} style={{ ...tdStyle, textAlign: 'center' }}>
                              <span style={{ color: sd.color, fontWeight: 700, fontSize: '0.85rem' }}>
                                {sd.label}
                              </span>
                              {p?.score > 0 && (
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                  {p.score}/{p.max_score} Pkt.
                                </div>
                              )}
                            </td>
                          )
                        })}
                        <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>
                          <span style={{ color: passedCount >= 4 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                            {passedCount}/4 bestanden
                          </span>
                          {passedCount >= 4 && (
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-abschluss)' }}>
                              🏆 Zertifikat
                            </div>
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
              <h3 style={{ color: 'var(--color-platform)', marginTop: 0 }}>Klassenstatistik</h3>
              <div className="grid-3">
                {moduleIds.slice(0, 4).map(mid => {
                  const passedInModule = students.filter(s =>
                    getStudentProgress(s.id, mid)?.passed
                  ).length
                  const pct = students.length > 0
                    ? Math.round((passedInModule / students.length) * 100)
                    : 0
                  return (
                    <div key={mid} style={{
                      background:   'var(--color-platform-light)',
                      borderRadius: 'var(--radius-md)',
                      padding:      'var(--space-md)',
                      textAlign:    'center',
                    }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-platform)' }}>
                        {pct} %
                      </div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {MODULE_LABELS[mid]}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        {passedInModule} / {students.length} bestanden
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Neue Klasse anlegen */}
      {showNewClass && (
        <NewClassForm
          teacherId={profile?.id}
          schoolId={profile?.school_id}
          onCreated={cls => {
            setClasses(c => [cls, ...c])
            setSelectedClass(cls)
            setShowNewClass(false)
          }}
          onCancel={() => setShowNewClass(false)}
        />
      )}
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
    // Zufälligen 6-stelligen Code generieren
    const joinCode = Math.random().toString(36).slice(2, 8).toUpperCase()

    const { data, error: err } = await supabase
      .from('classes')
      .insert({ name: name.trim(), grade, teacher_id: teacherId, school_id: schoolId, join_code: joinCode })
      .select()
      .single()

    setLoading(false)
    if (err) { setError('Fehler beim Anlegen: ' + err.message); return }
    onCreated(data)
  }

  return (
    <div className="card" style={{ border: '2px solid var(--color-platform)' }}>
      <h2 style={{ marginTop: 0, color: 'var(--color-platform)' }}>Neue Klasse anlegen</h2>
      <form onSubmit={handleCreate} noValidate>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
          <div style={{ flex: 2, minWidth: '180px' }}>
            <label htmlFor="className" style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Klassenname
            </label>
            <input id="className" type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="z. B. 7a oder 7b Informatik"
              style={{ width: '100%', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem' }} />
          </div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label htmlFor="grade" style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Jahrgang
            </label>
            <select id="grade" value={grade} onChange={e => setGrade(Number(e.target.value))}
              style={{ width: '100%', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', font: 'inherit' }}>
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

// ── Styles ────────────────────────────────────────────────────

const thStyle = {
  textAlign:   'left',
  padding:     '12px',
  fontWeight:  700,
  borderBottom: '2px solid var(--color-border)',
  whiteSpace:  'nowrap',
}

const tdStyle = {
  padding:     '10px 12px',
  borderBottom: '1px solid var(--color-border)',
  verticalAlign: 'top',
}