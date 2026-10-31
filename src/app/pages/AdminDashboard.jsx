// AdminDashboard - Schulverwaltung

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { teacherLogout } from '../../lib/auth.js'

const MOD_COLOR = '#103d54'
const SCHOOL_ID = '00000000-0000-0000-0000-000000000001'
const EDGE_FN   = 'https://tkmdyvlzespnkdzdzuwu.supabase.co/functions/v1/invite-user'

const MODULE_LABELS = {
  'modul-01': 'Was ist KI?',
  'modul-02': 'Mission KI-Check',
  'modul-03': 'Kennzeichnung & DS',
  'modul-04': 'KI & Nachhaltigkeit',
}

const STATUS_ICONS = {
  not_started: { icon: 'o', color: 'rgba(255,255,255,0.3)', label: 'Nicht begonnen' },
  in_progress: { icon: '~', color: '#f59e0b',              label: 'In Bearbeitung' },
  completed:   { icon: '*', color: '#60a5fa',              label: 'Abgeschlossen'  },
  passed:      { icon: 'v', color: '#4ade80',              label: 'Bestanden'      },
}

export default function AdminDashboard({ teacher, onLogout }) {
  const navigate = useNavigate()
  const [tab,            setTab]            = useState('overview')
  const [classes,        setClasses]        = useState([])
  const [teachers,       setTeachers]       = useState([])
  const [students,       setStudents]       = useState([])
  const [progress,       setProgress]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [msg,            setMsg]            = useState(null)
  const [showNewTeacher, setShowNewTeacher] = useState(false)
  const [showNewClass,   setShowNewClass]   = useState(false)
  const [showDeadlines,  setShowDeadlines]  = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [cl, te, st, pr] = await Promise.all([
      supabase.from('classes').select('*, users(display_name)').order('grade').order('name'),
      supabase.from('users').select('*').order('display_name'),
      supabase.from('students').select('*, classes(name, grade, join_code)').order('display_name'),
      supabase.from('student_module_progress').select('*'),
    ])
    setClasses(cl.data || [])
    setTeachers(te.data || [])
    setStudents(st.data || [])
    setProgress(pr.data || [])
    setLoading(false)
  }

  function showMsg(type, text) {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 5000)
  }

  function getProgress(studentId, moduleId) {
    return progress.find(p => p.student_id === studentId && p.module_id === moduleId)
  }

  const moduleIds = Object.keys(MODULE_LABELS)
  const certCount = students.filter(s => moduleIds.every(mid => getProgress(s.id, mid)?.passed)).length

  async function handleDelete() {
    if (!confirmDelete) return
    const { type, id, name } = confirmDelete
    setConfirmDelete(null)
    try {
      if (type === 'student') {
        await supabase.from('student_task_progress').delete().eq('student_id', id)
        await supabase.from('student_module_progress').delete().eq('student_id', id)
        await supabase.from('students').delete().eq('id', id)
        showMsg('ok', '"' + name + '" geloescht.')
      } else if (type === 'class') {
        const studs = students.filter(s => s.class_id === id).map(s => s.id)
        if (studs.length > 0) {
          await supabase.from('student_task_progress').delete().in('student_id', studs)
          await supabase.from('student_module_progress').delete().in('student_id', studs)
          await supabase.from('students').delete().in('id', studs)
        }
        await supabase.from('classes').delete().eq('id', id)
        showMsg('ok', 'Klasse "' + name + '" geloescht.')
      } else if (type === 'teacher') {
        await supabase.from('users').delete().eq('id', id)
        showMsg('ok', '"' + name + '" geloescht.')
      }
      await loadAll()
    } catch (err) { showMsg('err', 'Fehler: ' + err.message) }
  }

  function exportCSV() {
    const header = ['Name','Klasse','Jg','Beigetreten',
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Status)'),
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Punkte)'), 'Zertifikat']
    const rows = students.map(s => {
      const cls = s.classes
      return [s.display_name, cls?.name||'-', cls?.grade||'-',
        new Date(s.created_at).toLocaleDateString('de-DE'),
        ...moduleIds.map(mid => getProgress(s.id,mid)?.status||'not_started'),
        ...moduleIds.map(mid => getProgress(s.id,mid)?.score||0),
        moduleIds.every(mid => getProgress(s.id,mid)?.passed) ? 'Ja' : 'Nein']
    })
    const csv = [header,...rows].map(r => r.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'}))
    a.download = 'ki-fuehrerschein-'+new Date().toISOString().slice(0,10)+'.csv'
    a.click()
  }

  async function handleLogout() { await teacherLogout(); onLogout() }

  const darkBox = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', color: 'white', marginBottom: 'var(--sp-lg)' }

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>

      {msg && (
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 300,
          background: msg.type === 'ok' ? 'var(--c-success-bg)' : 'var(--c-error-bg)',
          border: '2px solid ' + (msg.type === 'ok' ? 'var(--c-success)' : 'var(--c-error)'),
          borderRadius: 'var(--r-lg)', padding: '0.75rem 1.25rem', fontWeight: 700,
          color: msg.type === 'ok' ? 'var(--c-success)' : 'var(--c-error)', boxShadow: 'var(--sh-lg)', maxWidth: '24rem' }}>
          {msg.type === 'ok' ? 'OK: ' : 'Fehler: '}{msg.text}
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '26rem', width: '100%' }}>
            <h2 style={{ color: 'var(--c-error)', marginTop: 0 }}>Wirklich loeschen?</h2>
            <p><strong>"{confirmDelete.name}"</strong> und alle Daten werden unwiderruflich geloescht.</p>
            <div className="actions">
              <button className="btn btn-danger" onClick={handleDelete}>Ja, endgueltig loeschen</button>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      <div className="wrap">
        <div className="mission-header" style={{ marginBottom: 'var(--sp-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>KI-Fuehrerschein - Admin-Bereich</div>
              <h1 style={{ margin: '0 0 0.25rem', color: 'white', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Schulverwaltung</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 'var(--fs-sm)' }}>
                {students.length} Schueler:innen - {classes.length} Klassen - {teachers.length} Lehrkraefte - {certCount} Zertifikate
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn" onClick={exportCSV} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 'var(--fs-sm)' }}>CSV</button>
              <button className="btn" onClick={() => navigate('/lehrer/dashboard')} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 'var(--fs-sm)' }}>Lehrkraft-Ansicht</button>
              <button className="btn" onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>Abmelden</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))', gap: '0.75rem', marginBottom: 'var(--sp-lg)' }}>
          {[
            { icon: 'LK', label: 'Lehrkraft anlegen', action: () => setShowNewTeacher(true) },
            { icon: 'KL', label: 'Klasse anlegen',    action: () => setShowNewClass(true)   },
            { icon: 'LF', label: 'Loeschfristen',     action: () => setShowDeadlines(true)  },
            { icon: 'EX', label: 'CSV exportieren',   action: exportCSV                     },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action}
              style={{ background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-md)', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', color: 'white', fontWeight: 800 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{btn.icon}</div>
              <div style={{ fontSize: 'var(--fs-sm)' }}>{btn.label}</div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
          {[
            { id: 'overview',  label: 'Uebersicht' },
            { id: 'classes',   label: 'Klassen (' + classes.length + ')' },
            { id: 'teachers',  label: 'Lehrkraefte (' + teachers.length + ')' },
            { id: 'students',  label: 'Schueler:innen (' + students.length + ')' },
          ].map(t => (
            <button key={t.id} className={'nav-btn ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)}
              style={{ fontSize: 'var(--fs-sm)', color: 'white', background: tab === t.id ? 'var(--c-xp)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? <p style={{ color: 'rgba(255,255,255,0.6)' }}>Wird geladen...</p> : (
          <React.Fragment>
            {tab === 'overview' && (
              <React.Fragment>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
                  {[
                    { label: 'Schueler:innen', value: students.length,  color: '#087f83' },
                    { label: 'Klassen',         value: classes.length,   color: '#2859d8' },
                    { label: 'Lehrkraefte',     value: teachers.length,  color: '#1a6b7a' },
                    { label: 'Zertifikate',     value: certCount,         color: '#b8860b' },
                  ].map(s => (
                    <div key={s.label} style={{ ...darkBox, textAlign: 'center', marginBottom: 0 }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={darkBox}>
                  <h2 style={{ marginTop: 0, color: '#7dd3fc' }}>Modul-Fortschritt (schulweit)</h2>
                  {moduleIds.map(mid => {
                    const passed = progress.filter(p => p.module_id === mid && p.passed).length
                    const pct    = students.length > 0 ? Math.round((passed / students.length) * 100) : 0
                    return (
                      <div key={mid} style={{ marginBottom: 'var(--sp-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-sm)' }}>
                          <span>{MODULE_LABELS[mid]}</span>
                          <span style={{ color: '#7dd3fc' }}>{passed}/{students.length} ({pct}%)</span>
                        </div>
                        <div className="progress-track"><div className="progress-fill green" style={{ width: pct + '%' }} /></div>
                      </div>
                    )
                  })}
                </div>
              </React.Fragment>
            )}

            {tab === 'classes' && (
              <div style={darkBox}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-md)' }}>
                  <h2 style={{ margin: 0, color: '#7dd3fc' }}>Alle Klassen</h2>
                  <button className="btn btn-primary" onClick={() => setShowNewClass(true)}>+ Neue Klasse</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ color: 'white', width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>{['Klasse','Jg.','Code','Lehrkraft','SuS','Zert.',''].map(h => <th key={h} style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'left', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {classes.map(cls => {
                        const clsStu = students.filter(s => s.class_id === cls.id)
                        const certs  = clsStu.filter(s => moduleIds.every(mid => getProgress(s.id, mid)?.passed)).length
                        return (
                          <tr key={cls.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ fontWeight: 700, padding: '0.75rem 0.5rem' }}>{cls.name}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{cls.grade}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}><code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>{cls.join_code}</code></td>
                            <td style={{ padding: '0.75rem 0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-sm)' }}>{cls.users?.display_name || '-'}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{clsStu.length}</td>
                            <td style={{ padding: '0.75rem 0.5rem', color: certs > 0 ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}>{certs > 0 ? certs + ' Zert.' : '-'}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <button className="btn" onClick={() => setConfirmDelete({ type: 'class', id: cls.id, name: cls.name })}
                                style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.4)', fontSize: 'var(--fs-xs)', padding: '4px 10px', minHeight: '2rem' }}>
                                Loeschen
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'teachers' && (
              <div style={darkBox}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-md)' }}>
                  <h2 style={{ margin: 0, color: '#7dd3fc' }}>Alle Lehrkraefte und Admins</h2>
                  <button className="btn btn-primary" onClick={() => setShowNewTeacher(true)}>+ Anlegen</button>
                </div>
                {teachers.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>Noch keine Lehrkraefte angelegt.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ color: 'white', width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>{['Name','Rolle','Klassen','Angelegt',''].map(h => <th key={h} style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'left', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {teachers.map(t => (
                          <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ fontWeight: 700, padding: '0.75rem 0.5rem' }}>{t.display_name}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <span style={{ background: t.role === 'superadmin' ? 'rgba(245,158,11,0.2)' : 'rgba(8,127,131,0.2)', color: t.role === 'superadmin' ? '#fbbf24' : '#5eead4', borderRadius: '99px', padding: '3px 10px', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>
                                {t.role === 'superadmin' ? 'Admin' : 'Lehrkraft'}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{classes.filter(c => c.teacher_id === t.id).length}</td>
                            <td style={{ padding: '0.75rem 0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-sm)' }}>{new Date(t.created_at).toLocaleDateString('de-DE')}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <button className="btn" onClick={() => setConfirmDelete({ type: 'teacher', id: t.id, name: t.display_name })}
                                style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.4)', fontSize: 'var(--fs-xs)', padding: '4px 10px', minHeight: '2rem' }}>
                                Loeschen
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {tab === 'students' && (
              <div style={darkBox}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'var(--sp-md)' }}>
                  <h2 style={{ margin: 0, color: '#7dd3fc' }}>Alle Schueler:innen ({students.length})</h2>
                  <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: 'var(--fs-sm)' }}>CSV</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ color: 'white', width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'left', fontSize: 'var(--fs-sm)' }}>Name</th>
                        <th style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'left', fontSize: 'var(--fs-sm)' }}>Klasse</th>
                        {moduleIds.map(mid => <th key={mid} style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'center', fontSize: '0.7rem', minWidth: '70px' }}>{MODULE_LABELS[mid].split(' ')[0]}</th>)}
                        <th style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem', textAlign: 'center', fontSize: 'var(--fs-sm)' }}>Zert.</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const cls       = s.classes
                        const allPassed = moduleIds.every(mid => getProgress(s.id, mid)?.passed)
                        return (
                          <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <td style={{ fontWeight: 700, padding: '0.625rem 0.5rem' }}>{s.display_name}</td>
                            <td style={{ padding: '0.625rem 0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-sm)' }}>{cls?.name||'-'}</td>
                            {moduleIds.map(mid => {
                              const p  = getProgress(s.id, mid)
                              const st = p?.status || 'not_started'
                              const si = STATUS_ICONS[st]
                              return (
                                <td key={mid} style={{ padding: '0.625rem 0.5rem', textAlign: 'center' }}>
                                  <span style={{ color: si.color, fontWeight: 900 }}>{si.icon}</span>
                                  {p?.score > 0 && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{p.score}P</div>}
                                </td>
                              )
                            })}
                            <td style={{ padding: '0.625rem 0.5rem', textAlign: 'center', color: allPassed ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}>
                              {allPassed ? 'OK' : '-'}
                            </td>
                            <td style={{ padding: '0.625rem 0.5rem' }}>
                              <button className="btn" onClick={() => setConfirmDelete({ type: 'student', id: s.id, name: s.display_name })}
                                style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.4)', fontSize: '0.7rem', padding: '3px 8px', minHeight: '1.75rem' }}>
                                X
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </React.Fragment>
        )}

        {showNewTeacher && (
          <NewTeacherForm
            onCreated={() => { setShowNewTeacher(false); loadAll(); showMsg('ok', 'Erfolgreich angelegt!') }}
            onCancel={() => setShowNewTeacher(false)}
            onError={err => showMsg('err', err)} />
        )}
        {showNewClass && (
          <NewClassForm teachers={teachers}
            onCreated={() => { setShowNewClass(false); loadAll(); showMsg('ok', 'Klasse angelegt!') }}
            onCancel={() => setShowNewClass(false)}
            onError={err => showMsg('err', err)} />
        )}
        {showDeadlines && (
          <DeadlineManager classes={classes} students={students}
            onClose={() => { setShowDeadlines(false); loadAll() }}
            onMsg={showMsg} />
        )}
      </div>
    </div>
  )
}

function NewTeacherForm({ onCreated, onCancel, onError }) {
  const [mode,     setMode]     = useState('username')
  const [name,     setName]     = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email,    setEmail]    = useState('')
  const [role,     setRole]     = useState('teacher')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState('')
  const [showPw,   setShowPw]   = useState(false)

  

  const inp = { width: '100%', padding: '10px', border: '2px solid var(--c-border)', borderRadius: 'var(--r-md)', fontSize: '1rem', fontFamily: 'inherit' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem', overflowY: 'auto' }}>
      <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '30rem', width: '100%', boxShadow: 'var(--sh-lg)', margin: 'auto' }}>
        <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Lehrkraft / Admin anlegen</h2>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>OK</div>
            <p style={{ fontWeight: 800, color: 'var(--c-success)' }}>{success}</p>
            <p style={{ color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>Fenster schliesst sich...</p>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: '0.25rem' }}>
              {[{ id: 'username', label: 'Benutzername + Passwort', sub: 'Keine E-Mail noetig' },
                { id: 'email',   label: 'E-Mail-Einladung',        sub: 'Link per Mail' }].map(m => (
                <button key={m.id} type="button" onClick={() => setMode(m.id)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: mode === m.id ? 800 : 600, background: mode === m.id ? 'white' : 'transparent', fontSize: 'var(--fs-xs)' }}>
                  <div>{m.label}</div>
                  <div style={{ color: 'var(--c-muted)', fontWeight: 400 }}>{m.sub}</div>
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="z. B. Frau Musterfrau" style={inp} />
              </div>
              {mode === 'username' && (
                <React.Fragment>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Benutzername</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g,''))} placeholder="z. B. musterfrau" autoComplete="off" style={inp} />
                    <p style={{ margin: '3px 0 0', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>Login: {username || 'benutzername'}</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Passwort</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mindestens 8 Zeichen" autoComplete="new-password" style={{ ...inp, paddingRight: '3rem' }} />
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{showPw ? 'hide' : 'show'}</button>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 'var(--fs-xs)', color: password.length >= 8 ? 'var(--c-success)' : 'var(--c-muted)' }}>{password.length}/8 {password.length >= 8 ? 'OK' : ''}</p>
                  </div>
                </React.Fragment>
              )}
              {mode === 'email' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>E-Mail-Adresse</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="lehrkraft@schule.de" style={inp} />
                </div>
              )}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Rolle</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={inp}>
                  <option value="teacher">Lehrkraft</option>
                  <option value="superadmin">Admin (Superadmin)</option>
                </select>
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-primary" disabled={loading || !name.trim() || (mode==='username' && (!username.trim()||password.length<8)) || (mode==='email' && !email.trim())}>
                  {loading ? 'Wird angelegt...' : mode === 'username' ? 'Account anlegen' : 'Einladung senden'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>
              </div>
            </form>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

function NewClassForm({ teachers, onCreated, onCancel, onError }) {
  const [name,      setName]      = useState('')
  const [grade,     setGrade]     = useState(7)
  const [teacherId, setTeacherId] = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) { onError('Bitte einen Klassennamen eingeben.'); return }
    setLoading(true)
    const joinCode = Math.random().toString(36).slice(2,8).toUpperCase()
    const { error } = await supabase.from('classes').insert({
      name: name.trim(), grade, teacher_id: teacherId||null, school_id: SCHOOL_ID, join_code: joinCode
    })
    setLoading(false)
    if (error) { onError('Fehler: ' + error.message); return }
    onCreated()
  }

  const inp = { width: '100%', padding: '10px', border: '2px solid var(--c-border)', borderRadius: 'var(--r-md)', fontSize: '1rem', fontFamily: 'inherit' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '28rem', width: '100%' }}>
        <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Neue Klasse anlegen</h2>
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
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Lehrkraft zuweisen (optional)</label>
            <select value={teacherId} onChange={e => setTeacherId(e.target.value)} style={inp}>
              <option value="">Keine Lehrkraft</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.display_name}</option>)}
            </select>
          </div>
          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Wird angelegt...' : 'Klasse anlegen'}</button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeadlineManager({ classes, students, onClose, onMsg }) {
  const [selectedClass, setSelectedClass] = useState('')
  const [deadline,      setDeadline]      = useState('')
  const [loading,       setLoading]       = useState(false)
  const expiredCount = students.filter(s => s.delete_after && s.delete_after <= new Date().toISOString().slice(0,10)).length

  async function applyDeadline() {
    if (!selectedClass || !deadline) { onMsg('err', 'Bitte Klasse und Datum auswaehlen.'); return }
    setLoading(true)
    const studs = students.filter(s => s.class_id === selectedClass).map(s => s.id)
    if (!studs.length) { onMsg('err', 'Keine Schueler:innen in dieser Klasse.'); setLoading(false); return }
    const { error } = await supabase.from('students').update({ delete_after: deadline }).in('id', studs)
    setLoading(false)
    if (error) { onMsg('err', 'Fehler: ' + error.message); return }
    onMsg('ok', 'Loeschfrist fuer ' + studs.length + ' Schueler:innen gesetzt.')
    onClose()
  }

  async function deleteExpired() {
    setLoading(true)
    const today   = new Date().toISOString().slice(0,10)
    const expired = students.filter(s => s.delete_after && s.delete_after <= today).map(s => s.id)
    if (!expired.length) { onMsg('ok', 'Keine abgelaufenen Datensaetze.'); setLoading(false); return }
    await supabase.from('student_task_progress').delete().in('student_id', expired)
    await supabase.from('student_module_progress').delete().in('student_id', expired)
    await supabase.from('students').delete().in('id', expired)
    setLoading(false)
    onMsg('ok', expired.length + ' abgelaufene Datensaetze geloescht.')
    onClose()
  }

  const inp = { width: '100%', padding: '10px', border: '2px solid var(--c-border)', borderRadius: 'var(--r-md)', fontSize: '1rem', fontFamily: 'inherit' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', maxWidth: '30rem', width: '100%' }}>
        <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Loeschfristen verwalten</h2>
        {expiredCount > 0 && (
          <div className="box-warning" style={{ marginBottom: '1rem' }}>
            <strong>{expiredCount} Datensaetze</strong> haben ihre Loeschfrist ueberschritten.
            <div className="actions" style={{ marginTop: '0.5rem' }}>
              <button className="btn btn-danger" onClick={deleteExpired} disabled={loading}>Abgelaufene jetzt loeschen</button>
            </div>
          </div>
        )}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Klasse auswaehlen</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={inp}>
            <option value="">Klasse auswaehlen...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} (Jg. {c.grade})</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '5px' }}>Loeschfrist setzen</label>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} min={new Date().toISOString().slice(0,10)} style={inp} />
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={applyDeadline} disabled={loading || !selectedClass || !deadline}>
            {loading ? 'Wird gesetzt...' : 'Loeschfrist anwenden'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Schliessen</button>
        </div>
      </div>
    </div>
  )
}
