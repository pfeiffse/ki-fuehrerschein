// TeacherDashboard - Lehrkraft-Ansicht (dunkles Design)

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { teacherLogout, getTeacherProfile } from '../../lib/auth.js'

const MODULE_LABELS = {
  'modul-01': 'Was ist KI?',
  'modul-02': 'Mission KI-Check',
  'modul-03': 'Kennzeichnung & DS',
  'modul-04': 'KI & Nachhaltigkeit',
}

const STATUS_ICONS = {
  not_started: { icon: '○', color: 'rgba(255,255,255,0.3)', label: 'Nicht begonnen' },
  in_progress: { icon: '◑', color: '#f59e0b',              label: 'In Bearbeitung' },
  completed:   { icon: '●', color: '#60a5fa',              label: 'Abgeschlossen'  },
  passed:      { icon: '✓', color: '#4ade80',              label: 'Bestanden'      },
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
  const [msg,             setMsg]             = useState(null)

  useEffect(() => {
    async function load() {
      const prof = await getTeacherProfile()
      setProfile(prof)
      const { data: cls } = await supabase.from('classes').select('*')
        .eq('teacher_id', prof?.id).order('grade').order('name')
      setClasses(cls || [])
      if (cls?.length > 0) setSelectedClass(cls[0])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    async function loadClass() {
      setLoading(true)
      const { data: studs } = await supabase.from('students').select('*')
        .eq('class_id', selectedClass.id).order('display_name')
      const ids = (studs || []).map(s => s.id)
      const { data: prog } = ids.length > 0
        ? await supabase.from('student_module_progress').select('*').in('student_id', ids)
        : { data: [] }
      setStudents(studs || [])
      setProgress(prog || [])
      setLoading(false)
    }
    loadClass()
  }, [selectedClass])

  function getProgress(studentId, moduleId) {
    return progress.find(p => p.student_id === studentId && p.module_id === moduleId)
  }

  function showMsg(type, text) {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  function exportCSV() {
    const moduleIds = Object.keys(MODULE_LABELS)
    const header = ['Name', 'Beigetreten',
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Status)'),
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Punkte)'), 'Zertifikat']
    const rows = students.map(s => {
      const statuses = moduleIds.map(mid => getProgress(s.id, mid)?.status || 'not_started')
      const scores   = moduleIds.map(mid => getProgress(s.id, mid)?.score || 0)
      const cert     = moduleIds.every(mid => getProgress(s.id, mid)?.passed) ? 'Ja' : 'Nein'
      return [s.display_name, new Date(s.created_at).toLocaleDateString('de-DE'), ...statuses, ...scores, cert]
    })
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'}))
    a.download = `ki-fuehrerschein_${selectedClass?.name||'klasse'}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  async function handleLogout() { await teacherLogout(); onLogout() }

  const moduleIds  = Object.keys(MODULE_LABELS)
  const certCount  = students.filter(s => moduleIds.every(mid => getProgress(s.id, mid)?.passed)).length

  // Klassenstatistik
  const stats = moduleIds.map(mid => ({
    mid, label: MODULE_LABELS[mid],
    passed:     students.filter(s => getProgress(s.id, mid)?.passed).length,
    inProgress: students.filter(s => getProgress(s.id, mid)?.status === 'in_progress').length,
  }))

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>

      {/* Toast */}
      {msg && (
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 300,
          background: msg.type === 'ok' ? 'var(--c-success-bg)' : 'var(--c-error-bg)',
          border: `2px solid ${msg.type === 'ok' ? 'var(--c-success)' : 'var(--c-error)'}`,
          borderRadius: 'var(--r-lg)', padding: '0.75rem 1.25rem', fontWeight: 700,
          color: msg.type === 'ok' ? 'var(--c-success)' : 'var(--c-error)', boxShadow: 'var(--sh-lg)' }}>
          {msg.type === 'ok' ? '✅ ' : '❌ '}{msg.text}
        </div>
      )}

      <div className="wrap">

        {/* Header */}
        <div className="mission-header" style={{ marginBottom: 'var(--sp-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>KI-Führerschein · Lehrkraft-Bereich</div>
              <h1 style={{ margin: '0 0 0.25rem', color: 'white', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>👩‍🏫 Mein Dashboard</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 'var(--fs-sm)' }}>
                {profile?.display_name || ''} · {students.length} Schüler:innen · {certCount} Zertifikate
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {profile?.role === 'superadmin' && (
                <button className="btn" onClick={() => navigate('/admin')}
                  style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.5)', color: '#fbbf24', fontSize: 'var(--fs-sm)' }}>
                  🛡️ Admin-Ansicht
                </button>
              )}
              <button className="btn" onClick={handleLogout}
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
                Abmelden
              </button>
            </div>
          </div>
        </div>

        {/* Klassen-Auswahl */}
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: 'var(--sp-md)' }}>
            <h2 style={{ margin: 0, color: '#7dd3fc' }}>Meine Klassen</h2>
            <button className="btn btn-primary" onClick={() => setShowNewClass(true)}>+ Neue Klasse</button>
          </div>

          {/* Klassen-Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 'var(--sp-md)' }}>
            {classes.map(cls => (
              <button key={cls.id}
                onClick={() => { setSelectedClass(cls); setSelectedStudent(null) }}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--r-pill)', border: `2px solid ${selectedClass?.id === cls.id ? '#7dd3fc' : 'rgba(255,255,255,0.2)'}`, background: selectedClass?.id === cls.id ? 'rgba(125,211,252,0.15)' : 'rgba(255,255,255,0.06)', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'var(--fs-sm)', transition: 'all 0.2s' }}>
                {cls.name} <span style={{ opacity: 0.6, fontWeight: 400 }}>Jg.{cls.grade}</span>
              </button>
            ))}
            {classes.length === 0 && !loading && (
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Noch keine Klassen angelegt.</p>
            )}
          </div>

          {/* Klassencode */}
          {selectedClass && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '0.875rem 1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Klassencode</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.12em', color: '#7dd3fc' }}>{selectedClass.join_code}</div>
              </div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'rgba(255,255,255,0.6)' }}>
                {students.length} Schüler:innen angemeldet · {certCount} Zertifikate
              </div>
              <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(selectedClass.join_code)}
                style={{ marginLeft: 'auto', fontSize: 'var(--fs-sm)' }}>
                📋 Kopieren
              </button>
            </div>
          )}
        </div>

        {/* Klassenstatistik */}
        {selectedClass && students.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)', color: 'white' }}>
            <h2 style={{ marginTop: 0, color: '#7dd3fc' }}>Klassenstatistik</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: 'var(--sp-md)' }}>
              {stats.map(s => {
                const pct = students.length > 0 ? Math.round((s.passed / students.length) * 100) : 0
                return (
                  <div key={s.mid} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)' }}>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '0.375rem', fontWeight: 700 }}>{s.label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ade80' }}>{pct}%</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
                      {s.passed} bestanden · {s.inProgress} aktiv
                    </div>
                    <div className="progress-track" style={{ marginTop: '0.5rem' }}>
                      <div className="progress-fill green" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Schüler-Detail */}
        {selectedStudent && (
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid #7dd3fc', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-md)' }}>
              <h2 style={{ margin: 0, color: '#7dd3fc' }}>👤 {selectedStudent.display_name}</h2>
              <button className="btn btn-ghost" onClick={() => setSelectedStudent(null)}>✕ Schließen</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: 'var(--sp-md)' }}>
              {moduleIds.map(mid => {
                const p  = getProgress(selectedStudent.id, mid)
                const st = p?.status || 'not_started'
                const si = STATUS_ICONS[st]
                return (
                  <div key={mid} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', border: `1px solid ${p?.passed ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '0.375rem', fontWeight: 700 }}>{MODULE_LABELS[mid]}</div>
                    <div style={{ fontWeight: 800, color: si.color, fontSize: 'var(--fs-lg)' }}>{si.icon} {si.label}</div>
                    {p?.score > 0 && <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>{p.score}/{p.max_score} Punkte</div>}
                    {p?.started_at && <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Begonnen: {new Date(p.started_at).toLocaleDateString('de-DE')}</div>}
                    {p?.completed_at && <div style={{ fontSize: 'var(--fs-xs)', color: '#4ade80', marginTop: '0.125rem' }}>Abgeschlossen: {new Date(p.completed_at).toLocaleDateString('de-DE')}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Schüler-Tabelle */}
        {selectedClass && (
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'var(--sp-md)' }}>
              <h2 style={{ margin: 0, color: '#7dd3fc' }}>Klasse {selectedClass.name} · {students.length} Schüler:innen</h2>
              <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: 'var(--fs-sm)' }}>📥 CSV</button>
            </div>

            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Wird geladen …</p>
            ) : students.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-lg)', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                Noch keine Schüler:innen. Teile den Code <strong style={{ color: '#7dd3fc' }}>{selectedClass.join_code}</strong> mit deiner Klasse.
              </div>
            ) : (
              <>
                {/* Legende */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: 'var(--sp-md)', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.5)' }}>
                  {Object.entries(STATUS_ICONS).map(([k, v]) => (
                    <span key={k}><span style={{ color: v.color }}>{v.icon}</span> {v.label}</span>
                  ))}
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ color: 'white', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'left', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>Name</th>
                        {moduleIds.map(mid => (
                          <th key={mid} style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.7rem', minWidth: '80px' }}>
                            {MODULE_LABELS[mid].split(' ')[0]}
                          </th>
                        ))}
                        <th style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'center', fontSize: 'var(--fs-sm)' }}>Zert.</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const allPassed = moduleIds.every(mid => getProgress(s.id, mid)?.passed)
                        const isSelected = selectedStudent?.id === s.id
                        return (
                          <tr key={s.id}
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: isSelected ? 'rgba(125,211,252,0.08)' : 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}
                            onClick={() => setSelectedStudent(s === selectedStudent ? null : s)}>
                            <td style={{ padding: '0.625rem 0.5rem', fontWeight: 700 }}>
                              {s.display_name}
                              <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                                {new Date(s.created_at).toLocaleDateString('de-DE')}
                              </div>
                            </td>
                            {moduleIds.map(mid => {
                              const p  = getProgress(s.id, mid)
                              const st = p?.status || 'not_started'
                              const si = STATUS_ICONS[st]
                              return (
                                <td key={mid} style={{ padding: '0.625rem 0.5rem', textAlign: 'center' }}>
                                  <span style={{ color: si.color, fontWeight: 900, fontSize: '1rem' }}>{si.icon}</span>
                                  {p?.score > 0 && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{p.score}P</div>}
                                </td>
                              )
                            })}
                            <td style={{ padding: '0.625rem 0.5rem', textAlign: 'center', color: allPassed ? '#fbbf24' : 'rgba(255,255,255,0.2)', fontSize: '1.1rem' }}>
                              {allPassed ? '🏆' : '–'}
                            </td>
                            <td style={{ padding: '0.625rem 0.5rem' }}>
                              <span style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.4)' }}>
                                {isSelected ? '▲' : '▼'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Neue Klasse */}
        {showNewClass && (
          <NewClassForm
            onCreated={() => { setShowNewClass(false); showMsg('ok', 'Klasse angelegt!') }}
            onCancel={() => setShowNewClass(false)}
            onError={err => showMsg('err', err)}
            teacherId={profile?.id}
          />
        )}
      </div>
    </div>
  )
}

function NewClassForm({ onCreated, onCancel, onError, teacherId }) {
  const [name,    setName]    = useState('')
  const [grade,   setGrade]   = useState(7)
  const [loading, setLoading] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) { onError('Bitte einen Klassennamen eingeben.'); return }
    setLoading(true)
    const joinCode = Math.random().toString(36).slice(2,8).toUpperCase()
    const { error } = await supabase.from('classes').insert({
      name: name.trim(), grade, teacher_id: teacherId || null,
      school_id: '00000000-0000-0000-0000-000000000001', join_code: joinCode
    })
    setLoading(false)
    if (error) { onError('Fehler: ' + error.message); return }
    onCreated()
  }

  const inp = { width: '100%', padding: '10px', border: '2px solid var(--c-border)', borderRadius: 'var(--r-md)', fontSize: '1rem', fontFamily: 'inherit' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '26rem', width: '100%' }}>
        <h2 style={{ marginTop: 0, color: '#103d54' }}>🏫 Neue Klasse anlegen</h2>
        <form onSubmit={handleCreate} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Klassenname</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="z. B. 7a" style={inp} />
            </div>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Jahrgang</label>
              <select value={grade} onChange={e => setGrade(Number(e.target.value))} style={inp}>
                {[7,8,9,10,11,12,13].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Wird angelegt …' : 'Klasse anlegen'}</button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  )
}