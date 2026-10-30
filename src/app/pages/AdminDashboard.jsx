// ============================================================
// KI-Führerschein · Admin-Dashboard
// Schulweite Übersicht: alle Schulen, Lehrkräfte, Klassen
// ============================================================

import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { teacherLogout } from '../../lib/auth.js'

const MOD_COLOR = '#103d54'

const STATUS_DISPLAY = {
  not_started: { label: '–',            color: '#8899aa' },
  in_progress: { label: 'In Bearb.',    color: '#e7a32a' },
  completed:   { label: 'Abgeschl.',    color: '#2484bb' },
  passed:      { label: '✓ Bestanden',  color: '#21875d' },
}

const MODULE_LABELS = {
  'modul-01': 'Was ist KI?',
  'modul-02': 'KI sinnvoll nutzen',
  'modul-03': 'Kennzeichnung & DS',
  'modul-04': 'KI & Nachhaltigkeit',
}

export default function AdminDashboard({ teacher, onLogout }) {
  const [tab,      setTab]      = useState('overview')  // overview | classes | teachers
  const [schools,  setSchools]  = useState([])
  const [classes,  setClasses]  = useState([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [progress, setProgress] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [stats,    setStats]    = useState(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [
      { data: sc },
      { data: cl },
      { data: te },
      { data: st },
      { data: pr },
    ] = await Promise.all([
      supabase.from('schools').select('*').order('name'),
      supabase.from('classes').select('*, schools(name)').order('grade').order('name'),
      supabase.from('users').select('*, schools(name)').order('display_name'),
      supabase.from('students').select('*, classes(name, grade, join_code)').order('display_name'),
      supabase.from('student_module_progress').select('*'),
    ])

    setSchools(sc ?? [])
    setClasses(cl ?? [])
    setTeachers(te ?? [])
    setStudents(st ?? [])
    setProgress(pr ?? [])

    // Statistiken berechnen
    const totalStudents = (st ?? []).length
    const passedM1 = (pr ?? []).filter(p => p.module_id === 'modul-01' && p.passed).length
    const passedM2 = (pr ?? []).filter(p => p.module_id === 'modul-02' && p.passed).length
    const passedM3 = (pr ?? []).filter(p => p.module_id === 'modul-03' && p.passed).length
    const passedM4 = (pr ?? []).filter(p => p.module_id === 'modul-04' && p.passed).length
    const allPassed = (st ?? []).filter(s => {
      const sProgress = (pr ?? []).filter(p => p.student_id === s.id)
      return ['modul-01','modul-02','modul-03','modul-04'].every(mid =>
        sProgress.find(p => p.module_id === mid && p.passed)
      )
    }).length

    setStats({ totalStudents, passedM1, passedM2, passedM3, passedM4, allPassed,
      totalClasses: (cl ?? []).length, totalTeachers: (te ?? []).length, totalSchools: (sc ?? []).length })
    setLoading(false)
  }

  function getStudentProgress(studentId, moduleId) {
    return progress.find(p => p.student_id === studentId && p.module_id === moduleId)
  }

  function exportCSV() {
    const moduleIds = Object.keys(MODULE_LABELS)
    const header = ['Name', 'Klasse', 'Jahrgang', 'Schule', 'Beigetreten',
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Status)'),
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Punkte)'),
      'Zertifikat']
    const rows = students.map(s => {
      const cls = s.classes
      const school = classes.find(c => c.id === s.class_id)?.schools?.name ?? '–'
      const statuses = moduleIds.map(mid => getStudentProgress(s.id, mid)?.status ?? 'not_started')
      const scores   = moduleIds.map(mid => getStudentProgress(s.id, mid)?.score ?? 0)
      const cert     = moduleIds.every(mid => getStudentProgress(s.id, mid)?.passed) ? 'Ja' : 'Nein'
      return [s.display_name, cls?.name ?? '–', cls?.grade ?? '–', school,
        new Date(s.created_at).toLocaleDateString('de-DE'), ...statuses, ...scores, cert]
    })
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `ki-fuehrerschein-gesamt-${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  async function handleLogout() { await teacherLogout(); onLogout() }

  const cardStyle = { background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Header */}
        <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '6px' }}>KI-Führerschein · Admin-Bereich</div>
            <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>🛡️ Admin-Dashboard</h1>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>Schulweite Übersicht aller Klassen, Lehrkräfte und Schüler:innen</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn" onClick={exportCSV}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontSize: '0.85rem' }}>
              📥 Gesamt-CSV
            </button>
            <button className="btn" onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>
              Abmelden
            </button>
          </div>
        </div>

        {/* Tab-Navigation */}
        <div className="station-tabs no-print">
          {[
            { id: 'overview',  label: '📊 Übersicht' },
            { id: 'classes',   label: '🏫 Klassen' },
            { id: 'teachers',  label: '👩‍🏫 Lehrkräfte' },
            { id: 'students',  label: '👤 Schüler:innen' },
          ].map(t => (
            <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Wird geladen …</p>
        ) : (
          <>
            {/* ── Übersicht ── */}
            {tab === 'overview' && stats && (
              <>
                {/* Kennzahlen */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  {[
                    { label: 'Schulen',         value: stats.totalSchools,   icon: '🏫', color: MOD_COLOR },
                    { label: 'Lehrkräfte',       value: stats.totalTeachers,  icon: '👩‍🏫', color: '#1a6b7a' },
                    { label: 'Klassen',          value: stats.totalClasses,   icon: '📚', color: '#2859d8' },
                    { label: 'Schüler:innen',    value: stats.totalStudents,  icon: '👤', color: '#087f83' },
                    { label: 'Zertifikate',      value: stats.allPassed,      icon: '🏆', color: '#b8860b' },
                  ].map(s => (
                    <div key={s.label} style={{ ...cardStyle, textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Modul-Fortschritt */}
                <div style={cardStyle}>
                  <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Modul-Fortschritt (schulweit)</h2>
                  {Object.entries(MODULE_LABELS).map(([mid, label]) => {
                    const passed = progress.filter(p => p.module_id === mid && p.passed).length
                    const pct    = stats.totalStudents > 0 ? Math.round((passed / stats.totalStudents) * 100) : 0
                    return (
                      <div key={mid} style={{ marginBottom: 'var(--space-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                          <span>{label}</span>
                          <span style={{ color: MOD_COLOR }}>{passed} / {stats.totalStudents} bestanden ({pct} %)</span>
                        </div>
                        <div className="progress-shell dark">
                          <div className="progress-bar green" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Klassen-Übersicht */}
                <div style={cardStyle}>
                  <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Klassen-Übersicht</h2>
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Klasse</th>
                          <th>Jahrgang</th>
                          <th>Code</th>
                          <th>Schüler:innen</th>
                          <th>Modul 1</th>
                          <th>Modul 2</th>
                          <th>Modul 3</th>
                          <th>Modul 4</th>
                          <th>Zertifikate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map(cls => {
                          const clsStudents = students.filter(s => s.class_id === cls.id)
                          const moduleIds   = Object.keys(MODULE_LABELS)
                          const passedCounts = moduleIds.map(mid =>
                            clsStudents.filter(s => getStudentProgress(s.id, mid)?.passed).length
                          )
                          const certCount = clsStudents.filter(s =>
                            moduleIds.every(mid => getStudentProgress(s.id, mid)?.passed)
                          ).length
                          return (
                            <tr key={cls.id}>
                              <td style={{ fontWeight: 700 }}>{cls.name}</td>
                              <td>{cls.grade}</td>
                              <td><code style={{ background: '#f0fafb', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>{cls.join_code}</code></td>
                              <td>{clsStudents.length}</td>
                              {passedCounts.map((c, i) => (
                                <td key={i} style={{ textAlign: 'center', color: c > 0 ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: c > 0 ? 800 : 400 }}>
                                  {c}/{clsStudents.length}
                                </td>
                              ))}
                              <td style={{ textAlign: 'center', fontWeight: 800, color: certCount > 0 ? '#b8860b' : 'var(--color-text-muted)' }}>
                                {certCount > 0 ? `🏆 ${certCount}` : '–'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── Klassen ── */}
            {tab === 'classes' && (
              <div style={cardStyle}>
                <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Alle Klassen ({classes.length})</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Klasse</th><th>Jahrgang</th><th>Schule</th><th>Klassencode</th>
                        <th>Schüler:innen</th><th>Angelegt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map(cls => (
                        <tr key={cls.id}>
                          <td style={{ fontWeight: 700 }}>{cls.name}</td>
                          <td>{cls.grade}</td>
                          <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{cls.schools?.name ?? '–'}</td>
                          <td><code style={{ background: '#f0fafb', padding: '2px 8px', borderRadius: '4px', fontWeight: 900, letterSpacing: '0.05em' }}>{cls.join_code}</code></td>
                          <td>{students.filter(s => s.class_id === cls.id).length}</td>
                          <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{new Date(cls.created_at).toLocaleDateString('de-DE')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Lehrkräfte ── */}
            {tab === 'teachers' && (
              <div style={cardStyle}>
                <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Alle Lehrkräfte ({teachers.length})</h2>
                {teachers.length === 0 ? (
                  <div className="box-info">
                    Noch keine Lehrkräfte angelegt. Lehrkräfte über{' '}
                    <a href="https://supabase.com/dashboard/project/tkmdyvlzespnkdzdzuwu/auth/users" target="_blank" rel="noopener">
                      Authentication → Users → Invite user ↗
                    </a>{' '}
                    einladen, dann UUID in die users-Tabelle eintragen.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr><th>Name</th><th>Rolle</th><th>Schule</th><th>Klassen</th><th>Angelegt</th></tr>
                      </thead>
                      <tbody>
                        {teachers.map(t => (
                          <tr key={t.id}>
                            <td style={{ fontWeight: 700 }}>{t.display_name}</td>
                            <td>
                              <span style={{ background: t.role === 'superadmin' ? '#fff8db' : 'var(--color-platform-pale)', color: t.role === 'superadmin' ? '#825300' : 'var(--color-platform)', borderRadius: '99px', padding: '3px 10px', fontSize: 'var(--font-size-xs)', fontWeight: 800 }}>
                                {t.role === 'superadmin' ? '🛡️ Admin' : '👩‍🏫 Lehrkraft'}
                              </span>
                            </td>
                            <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{t.schools?.name ?? '–'}</td>
                            <td>{classes.filter(c => c.teacher_id === t.id).length}</td>
                            <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{new Date(t.created_at).toLocaleDateString('de-DE')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Anleitung */}
                <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: '#f0fafb', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)' }}>
                  <strong>Neue Lehrkraft anlegen:</strong>
                  <ol style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: 2 }}>
                    <li><a href="https://supabase.com/dashboard/project/tkmdyvlzespnkdzdzuwu/auth/users" target="_blank" rel="noopener">Authentication → Users → Invite user ↗</a></li>
                    <li>E-Mail eingeben → Einladungsmail kommt → Passwort setzen</li>
                    <li>UUID aus der User-Liste kopieren</li>
                    <li>Im SQL-Editor ausführen:<br />
                      <code style={{ background: '#e8f0f5', padding: '4px 8px', borderRadius: '4px', display: 'block', marginTop: '4px', fontSize: '0.8rem' }}>
                        INSERT INTO users (id, school_id, role, display_name)<br />
                        VALUES ('UUID', '00000000-0000-0000-0000-000000000001', 'teacher', 'Name');
                      </code>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* ── Schüler:innen ── */}
            {tab === 'students' && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                  <h2 style={{ color: MOD_COLOR, margin: 0 }}>Alle Schüler:innen ({students.length})</h2>
                  <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: '0.85rem' }}>📥 CSV exportieren</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th><th>Klasse</th>
                        {Object.values(MODULE_LABELS).map(l => <th key={l} style={{ minWidth: '100px', fontSize: '0.78rem' }}>{l}</th>)}
                        <th>Zertifikat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const cls = s.classes
                        const moduleIds = Object.keys(MODULE_LABELS)
                        const allPassed = moduleIds.every(mid => getStudentProgress(s.id, mid)?.passed)
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 700 }}>{s.display_name}</td>
                            <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                              {cls?.name ?? '–'} (Jg. {cls?.grade ?? '?'})
                            </td>
                            {moduleIds.map(mid => {
                              const p  = getStudentProgress(s.id, mid)
                              const st = p?.status ?? 'not_started'
                              const sd = STATUS_DISPLAY[st]
                              return (
                                <td key={mid} style={{ textAlign: 'center' }}>
                                  <span style={{ color: sd.color, fontWeight: 700, fontSize: '0.82rem' }}>{sd.label}</span>
                                  {p?.score > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{p.score}/{p.max_score}</div>}
                                </td>
                              )
                            })}
                            <td style={{ textAlign: 'center', fontWeight: 800, color: allPassed ? '#b8860b' : 'var(--color-text-muted)' }}>
                              {allPassed ? '🏆' : '–'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}