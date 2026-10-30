// ============================================================
// KI-Fuehrerschein - Admin-Dashboard
// Vollstaendige Verwaltung: Lehrkraefte, Klassen, Schueler, Loeschfristen
// ============================================================

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { teacherLogout } from '../../lib/auth.js'

const MOD_COLOR = '#103d54'
const SCHOOL_ID = '00000000-0000-0000-0000-000000000001'

const MODULE_LABELS = {
  'modul-01': 'Was ist KI?',
  'modul-02': 'KI sinnvoll nutzen',
  'modul-03': 'Kennzeichnung & DS',
  'modul-04': 'KI & Nachhaltigkeit',
}

const STATUS_DISPLAY = {
  not_started: { label: '-',           color: '#8899aa' },
  in_progress: { label: 'In Bearb.',   color: '#e7a32a' },
  completed:   { label: 'Abgeschl.',   color: '#2484bb' },
  passed:      { label: 'Bestanden',   color: '#21875d' },
}

export default function AdminDashboard({ teacher, onLogout }) {
  const navigate = useNavigate()
  const [tab,       setTab]       = useState('overview')
  const [classes,   setClasses]   = useState([])
  const [teachers,  setTeachers]  = useState([])
  const [students,  setStudents]  = useState([])
  const [progress,  setProgress]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [msg,       setMsg]       = useState(null)  // { type: 'ok'|'err', text }

  // Modals
  const [showNewTeacher, setShowNewTeacher] = useState(false)
  const [showNewClass,   setShowNewClass]   = useState(false)
  const [showDeadlines,  setShowDeadlines]  = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(null)  // { type, id, name }

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [cl, te, st, pr] = await Promise.all([
      supabase.from('classes').select('*, users(display_name)').order('grade').order('name'),
      supabase.from('users').select('*, schools(name)').order('display_name'),
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
    setTimeout(() => setMsg(null), 4000)
  }

  function getProgress(studentId, moduleId) {
    return progress.find(p => p.student_id === studentId && p.module_id === moduleId)
  }

  // Statistiken
  const moduleIds   = Object.keys(MODULE_LABELS)
  const certCount   = students.filter(s => moduleIds.every(mid => getProgress(s.id, mid)?.passed)).length
  const activeCount = students.filter(s => progress.some(p => p.student_id === s.id)).length

  // CSV Export
  function exportCSV() {
    const header = ['Name', 'Klasse', 'Jahrgang', 'Beigetreten',
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Status)'),
      ...moduleIds.map(id => MODULE_LABELS[id] + ' (Punkte)'),
      'Zertifikat']
    const rows = students.map(s => {
      const cls      = s.classes
      const statuses = moduleIds.map(mid => getProgress(s.id, mid)?.status || 'not_started')
      const scores   = moduleIds.map(mid => getProgress(s.id, mid)?.score || 0)
      const cert     = moduleIds.every(mid => getProgress(s.id, mid)?.passed) ? 'Ja' : 'Nein'
      return [s.display_name, cls?.name || '-', cls?.grade || '-',
        new Date(s.created_at).toLocaleDateString('de-DE'), ...statuses, ...scores, cert]
    })
    const csv  = [header, ...rows].map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'ki-fuehrerschein-gesamt-' + new Date().toISOString().slice(0,10) + '.csv'
    a.click(); URL.revokeObjectURL(url)
  }

  // Loeschen
  async function handleDelete() {
    if (!confirmDelete) return
    const { type, id, name } = confirmDelete
    setConfirmDelete(null)

    try {
      if (type === 'student') {
        await supabase.from('student_task_progress').delete().eq('student_id', id)
        await supabase.from('student_module_progress').delete().eq('student_id', id)
        await supabase.from('certificates').delete().eq('student_id', id)
        await supabase.from('students').delete().eq('id', id)
        showMsg('ok', 'Schueler:in "' + name + '" geloescht.')
      } else if (type === 'class') {
        const studs = students.filter(s => s.class_id === id).map(s => s.id)
        if (studs.length > 0) {
          await supabase.from('student_task_progress').delete().in('student_id', studs)
          await supabase.from('student_module_progress').delete().in('student_id', studs)
          await supabase.from('students').delete().in('id', studs)
        }
        await supabase.from('classes').delete().eq('id', id)
        showMsg('ok', 'Klasse "' + name + '" und alle Schueler:innen geloescht.')
      } else if (type === 'teacher') {
        await supabase.from('users').delete().eq('id', id)
        showMsg('ok', 'Lehrkraft "' + name + '" geloescht.')
      }
      await loadAll()
    } catch (err) {
      showMsg('err', 'Fehler: ' + err.message)
    }
  }

  async function handleLogout() { await teacherLogout(); onLogout() }

  const cardStyle = {
    background: 'white', borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-lg)', boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--color-border)', marginBottom: 'var(--space-lg)',
  }

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Meldung */}
        {msg && (
          <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 200,
            background: msg.type === 'ok' ? 'var(--color-success-light)' : 'var(--color-error-light)',
            border: '2px solid ' + (msg.type === 'ok' ? 'var(--color-success)' : 'var(--color-error)'),
            borderRadius: 'var(--radius-lg)', padding: '12px 20px', fontWeight: 700,
            color: msg.type === 'ok' ? 'var(--color-success)' : 'var(--color-error)',
            boxShadow: 'var(--shadow-lg)', maxWidth: '400px' }}>
            {msg.type === 'ok' ? '✅ ' : '❌ '}{msg.text}
          </div>
        )}

        {/* Loeschbestaetigung */}
        {confirmDelete && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 'var(--space-lg)' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)', maxWidth: '420px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
              <h2 style={{ color: 'var(--color-error)', marginTop: 0 }}>Wirklich loeschen?</h2>
              <p>
                {confirmDelete.type === 'student' && 'Schueler:in '}
                {confirmDelete.type === 'class'   && 'Klasse '}
                {confirmDelete.type === 'teacher' && 'Lehrkraft '}
                <strong>"{confirmDelete.name}"</strong> und alle zugehoerigen Daten werden unwiderruflich geloescht.
              </p>
              <div className="actions">
                <button className="btn" onClick={handleDelete}
                  style={{ background: 'var(--color-error)', color: 'white' }}>
                  Ja, endgueltig loeschen
                </button>
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Abbrechen</button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '6px' }}>KI-Fuehrerschein - Admin-Bereich</div>
            <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Schulverwaltung</h1>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>
              {students.length} Schueler:innen | {classes.length} Klassen | {teachers.length} Lehrkraefte
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn" onClick={exportCSV}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontSize: '0.85rem' }}>
              CSV Export
            </button>
            <button className="btn" onClick={() => navigate('/lehrer/dashboard')}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontSize: '0.85rem' }}>
              Lehrkraft-Ansicht
            </button>
            <button className="btn" onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>
              Abmelden
            </button>
          </div>
        </div>

        {/* Schnellaktionen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          {[
            { icon: '👩‍🏫', label: 'Lehrkraft anlegen', action: () => setShowNewTeacher(true), color: '#1a6b7a' },
            { icon: '🏫', label: 'Klasse anlegen',    action: () => setShowNewClass(true),   color: '#2859d8' },
            { icon: '⏰', label: 'Loeschfristen',     action: () => setShowDeadlines(true),  color: '#087f83' },
            { icon: '📥', label: 'CSV exportieren',   action: exportCSV,                     color: '#095c6b' },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action}
              style={{ background: 'white', border: '2px solid ' + btn.color, borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = btn.color + '15'}
              onMouseOut={e  => e.currentTarget.style.background = 'white'}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{btn.icon}</div>
              <div style={{ fontWeight: 800, color: btn.color, fontSize: '0.9rem' }}>{btn.label}</div>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="station-tabs no-print">
          {[
            { id: 'overview',  label: 'Uebersicht' },
            { id: 'classes',   label: 'Klassen (' + classes.length + ')' },
            { id: 'teachers',  label: 'Lehrkraefte (' + teachers.length + ')' },
            { id: 'students',  label: 'Schueler:innen (' + students.length + ')' },
          ].map(t => (
            <button key={t.id} className={'nav-btn ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? <p style={{ color: 'var(--color-text-muted)' }}>Wird geladen ...</p> : (
          <>
            {/* Uebersicht */}
            {tab === 'overview' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  {[
                    { label: 'Schueler:innen', value: students.length,  icon: '👤', color: '#087f83' },
                    { label: 'Aktiv',          value: activeCount,       icon: '✏️', color: '#2859d8' },
                    { label: 'Zertifikate',    value: certCount,         icon: '🏆', color: '#b8860b' },
                    { label: 'Klassen',        value: classes.length,   icon: '🏫', color: '#1a6b7a' },
                    { label: 'Lehrkraefte',    value: teachers.length,  icon: '👩‍🏫', color: '#095c6b' },
                  ].map(s => (
                    <div key={s.label} style={{ ...cardStyle, textAlign: 'center', marginBottom: 0 }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{s.icon}</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={cardStyle}>
                  <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Modul-Fortschritt (schulweit)</h2>
                  {moduleIds.map(mid => {
                    const passed = progress.filter(p => p.module_id === mid && p.passed).length
                    const pct    = students.length > 0 ? Math.round((passed / students.length) * 100) : 0
                    return (
                      <div key={mid} style={{ marginBottom: 'var(--space-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                          <span>{MODULE_LABELS[mid]}</span>
                          <span style={{ color: MOD_COLOR }}>{passed} / {students.length} ({pct} %)</span>
                        </div>
                        <div className="progress-shell dark">
                          <div className="progress-bar green" style={{ width: pct + '%' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* Klassen */}
            {tab === 'classes' && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <h2 style={{ color: MOD_COLOR, margin: 0 }}>Alle Klassen</h2>
                  <button className="btn btn-primary" onClick={() => setShowNewClass(true)}>+ Neue Klasse</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Klasse</th><th>Jg.</th><th>Code</th><th>Lehrkraft</th>
                        <th>Schueler:innen</th><th>Zertifikate</th><th>Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map(cls => {
                        const clsStudents = students.filter(s => s.class_id === cls.id)
                        const certs       = clsStudents.filter(s => moduleIds.every(mid => getProgress(s.id, mid)?.passed)).length
                        return (
                          <tr key={cls.id}>
                            <td style={{ fontWeight: 700 }}>{cls.name}</td>
                            <td>{cls.grade}</td>
                            <td><code style={{ background: '#f0fafb', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>{cls.join_code}</code></td>
                            <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{cls.users?.display_name || '-'}</td>
                            <td>{clsStudents.length}</td>
                            <td style={{ color: certs > 0 ? '#b8860b' : 'var(--color-text-muted)', fontWeight: certs > 0 ? 800 : 400 }}>
                              {certs > 0 ? '🏆 ' + certs : '-'}
                            </td>
                            <td>
                              <button className="btn" onClick={() => setConfirmDelete({ type: 'class', id: cls.id, name: cls.name })}
                                style={{ background: 'var(--color-error-light)', color: 'var(--color-error)', border: '1px solid var(--color-error)', fontSize: '0.78rem', padding: '4px 10px', minHeight: '30px' }}>
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

            {/* Lehrkraefte */}
            {tab === 'teachers' && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <h2 style={{ color: MOD_COLOR, margin: 0 }}>Alle Lehrkraefte</h2>
                  <button className="btn btn-primary" onClick={() => setShowNewTeacher(true)}>+ Lehrkraft anlegen</button>
                </div>
                {teachers.length === 0 ? (
                  <div className="box-info">Noch keine Lehrkraefte angelegt.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr><th>Name</th><th>Rolle</th><th>Klassen</th><th>Angelegt</th><th>Aktionen</th></tr>
                      </thead>
                      <tbody>
                        {teachers.map(t => (
                          <tr key={t.id}>
                            <td style={{ fontWeight: 700 }}>{t.display_name}</td>
                            <td>
                              <span style={{ background: t.role === 'superadmin' ? '#fff8db' : 'var(--color-platform-pale)', color: t.role === 'superadmin' ? '#825300' : 'var(--color-platform)', borderRadius: '99px', padding: '3px 10px', fontSize: 'var(--font-size-xs)', fontWeight: 800 }}>
                                {t.role === 'superadmin' ? 'Admin' : 'Lehrkraft'}
                              </span>
                            </td>
                            <td>{classes.filter(c => c.teacher_id === t.id).length}</td>
                            <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{new Date(t.created_at).toLocaleDateString('de-DE')}</td>
                            <td>
                              <button className="btn" onClick={() => setConfirmDelete({ type: 'teacher', id: t.id, name: t.display_name })}
                                style={{ background: 'var(--color-error-light)', color: 'var(--color-error)', border: '1px solid var(--color-error)', fontSize: '0.78rem', padding: '4px 10px', minHeight: '30px' }}>
                                Loeschen
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: '#f0fafb', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)' }}>
                  <strong>Neue Lehrkraft anlegen:</strong>
                  <ol style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: 2 }}>
                    <li><a href="https://supabase.com/dashboard/project/tkmdyvlzespnkdzdzuwu/auth/users" target="_blank" rel="noopener">Authentication - Users - Invite user</a></li>
                    <li>E-Mail eingeben, Einladungsmail kommt, Passwort setzen</li>
                    <li>UUID kopieren und hier eintragen (Button oben)</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Schueler:innen */}
            {tab === 'students' && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                  <h2 style={{ color: MOD_COLOR, margin: 0 }}>Alle Schueler:innen ({students.length})</h2>
                  <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: '0.85rem' }}>CSV exportieren</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th><th>Klasse</th>
                        {moduleIds.map(mid => <th key={mid} style={{ minWidth: '90px', fontSize: '0.75rem' }}>{MODULE_LABELS[mid]}</th>)}
                        <th>Zertifikat</th><th>Loeschfrist</th><th>Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const cls       = s.classes
                        const allPassed = moduleIds.every(mid => getProgress(s.id, mid)?.passed)
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 700 }}>{s.display_name}</td>
                            <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                              {cls?.name || '-'} (Jg. {cls?.grade || '?'})
                            </td>
                            {moduleIds.map(mid => {
                              const p  = getProgress(s.id, mid)
                              const st = p?.status || 'not_started'
                              const sd = STATUS_DISPLAY[st]
                              return (
                                <td key={mid} style={{ textAlign: 'center' }}>
                                  <span style={{ color: sd.color, fontWeight: 700, fontSize: '0.78rem' }}>{sd.label}</span>
                                  {p?.score > 0 && <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{p.score}P</div>}
                                </td>
                              )
                            })}
                            <td style={{ textAlign: 'center', fontWeight: 800, color: allPassed ? '#b8860b' : 'var(--color-text-muted)' }}>
                              {allPassed ? '🏆' : '-'}
                            </td>
                            <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                              {s.delete_after ? new Date(s.delete_after).toLocaleDateString('de-DE') : '-'}
                            </td>
                            <td>
                              <button className="btn" onClick={() => setConfirmDelete({ type: 'student', id: s.id, name: s.display_name })}
                                style={{ background: 'var(--color-error-light)', color: 'var(--color-error)', border: '1px solid var(--color-error)', fontSize: '0.75rem', padding: '4px 8px', minHeight: '28px' }}>
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
          </>
        )}

        {/* Modal: Neue Lehrkraft */}
        {showNewTeacher && (
          <NewTeacherForm
            onCreated={() => { setShowNewTeacher(false); loadAll(); showMsg('ok', 'Lehrkraft angelegt.') }}
            onCancel={() => setShowNewTeacher(false)}
            onError={err => showMsg('err', err)} />
        )}

        {/* Modal: Neue Klasse */}
        {showNewClass && (
          <NewClassForm
            teachers={teachers}
            onCreated={() => { setShowNewClass(false); loadAll(); showMsg('ok', 'Klasse angelegt.') }}
            onCancel={() => setShowNewClass(false)}
            onError={err => showMsg('err', err)} />
        )}

        {/* Modal: Loeschfristen */}
        {showDeadlines && (
          <DeadlineManager
            classes={classes}
            students={students}
            onClose={() => { setShowDeadlines(false); loadAll() }}
            onMsg={showMsg} />
        )}
      </div>
    </div>
  )
}

// Neue Lehrkraft anlegen
function NewTeacherForm({ onCreated, onCancel, onError }) {
  const [uuid,    setUuid]    = useState('')
  const [name,    setName]    = useState('')
  const [role,    setRole]    = useState('teacher')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!uuid.trim() || !name.trim()) { onError('Bitte alle Felder ausfullen.'); return }
    setLoading(true)
    const { error } = await supabase.from('users').insert({
      id: uuid.trim(), school_id: SCHOOL_ID, role, display_name: name.trim()
    })
    setLoading(false)
    if (error) { onError('Fehler: ' + error.message); return }
    onCreated()
  }

  const inputStyle = { width: '100%', padding: '10px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 'var(--space-lg)' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Lehrkraft anlegen</h2>
        <div className="box-info" style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
          Zuerst die Person uber <a href="https://supabase.com/dashboard/project/tkmdyvlzespnkdzdzuwu/auth/users" target="_blank" rel="noopener">Authentication - Invite user</a> einladen, dann die UUID hier eintragen.
        </div>
        <form onSubmit={handleCreate} noValidate>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>UUID (aus Supabase Auth)</label>
            <input type="text" value={uuid} onChange={e => setUuid(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Anzeigename</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="z. B. Frau Musterfrau" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Rolle</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
              <option value="teacher">Lehrkraft</option>
              <option value="superadmin">Admin (Superadmin)</option>
            </select>
          </div>
          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Wird angelegt ...' : 'Lehrkraft anlegen'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Neue Klasse anlegen (Admin kann Lehrkraft zuweisen)
function NewClassForm({ teachers, onCreated, onCancel, onError }) {
  const [name,      setName]      = useState('')
  const [grade,     setGrade]     = useState(7)
  const [teacherId, setTeacherId] = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) { onError('Bitte einen Klassennamen eingeben.'); return }
    setLoading(true)
    const joinCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    const { error } = await supabase.from('classes').insert({
      name: name.trim(), grade,
      teacher_id: teacherId || null,
      school_id:  SCHOOL_ID,
      join_code:  joinCode,
    })
    setLoading(false)
    if (error) { onError('Fehler: ' + error.message); return }
    onCreated()
  }

  const inputStyle = { width: '100%', padding: '10px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 'var(--space-lg)' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Neue Klasse anlegen</h2>
        <form onSubmit={handleCreate} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Klassenname</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="z. B. 7a" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Jahrgang</label>
              <select value={grade} onChange={e => setGrade(Number(e.target.value))} style={inputStyle}>
                {[7,8,9,10,11,12,13].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Lehrkraft zuweisen (optional)</label>
            <select value={teacherId} onChange={e => setTeacherId(e.target.value)} style={inputStyle}>
              <option value="">Keine Lehrkraft</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.display_name} ({t.role})</option>)}
            </select>
          </div>
          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Wird angelegt ...' : 'Klasse anlegen'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Loeschfristen verwalten
function DeadlineManager({ classes, students, onClose, onMsg }) {
  const [selectedClass, setSelectedClass] = useState('')
  const [deadline,      setDeadline]      = useState('')
  const [loading,       setLoading]       = useState(false)

  async function applyDeadline() {
    if (!selectedClass || !deadline) { onMsg('err', 'Bitte Klasse und Datum auswaehlen.'); return }
    setLoading(true)
    const studs = students.filter(s => s.class_id === selectedClass).map(s => s.id)
    if (studs.length === 0) { onMsg('err', 'Keine Schueler:innen in dieser Klasse.'); setLoading(false); return }

    const { error } = await supabase
      .from('students')
      .update({ delete_after: deadline })
      .in('id', studs)

    setLoading(false)
    if (error) { onMsg('err', 'Fehler: ' + error.message); return }
    onMsg('ok', 'Loeschfrist fuer ' + studs.length + ' Schueler:innen gesetzt.')
    onClose()
  }

  async function deleteExpired() {
    setLoading(true)
    const today    = new Date().toISOString().slice(0, 10)
    const expired  = students.filter(s => s.delete_after && s.delete_after <= today)
    const expIds   = expired.map(s => s.id)

    if (expIds.length === 0) { onMsg('ok', 'Keine abgelaufenen Datensaetze gefunden.'); setLoading(false); return }

    await supabase.from('student_task_progress').delete().in('student_id', expIds)
    await supabase.from('student_module_progress').delete().in('student_id', expIds)
    await supabase.from('students').delete().in('id', expIds)

    setLoading(false)
    onMsg('ok', expIds.length + ' abgelaufene Datensaetze geloescht.')
    onClose()
  }

  const inputStyle = { width: '100%', padding: '10px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit' }
  const expiredCount = students.filter(s => s.delete_after && s.delete_after <= new Date().toISOString().slice(0,10)).length

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 'var(--space-lg)' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)', maxWidth: '520px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>Loeschfristen verwalten</h2>

        <div className="box-info" style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)' }}>
          Loeschfristen bestimmen, wann Schueler-Daten automatisch geloescht werden koennen (Art. 17 DSGVO).
          Standard: 2 Jahre nach Anmeldung.
        </div>

        {expiredCount > 0 && (
          <div className="box-warning" style={{ marginBottom: 'var(--space-lg)' }}>
            <strong>{expiredCount} Datensaetze</strong> haben ihre Loeschfrist ueberschritten.
            <div className="actions" style={{ marginTop: '8px' }}>
              <button className="btn" onClick={deleteExpired} disabled={loading}
                style={{ background: 'var(--color-error)', color: 'white', fontSize: '0.85rem' }}>
                Abgelaufene Daten jetzt loeschen
              </button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 'var(--space-md)' }}>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Klasse auswaehlen</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={inputStyle}>
            <option value="">Klasse auswaehlen ...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} (Jg. {c.grade})</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Loeschfrist setzen</label>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
            min={new Date().toISOString().slice(0,10)} style={inputStyle} />
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={applyDeadline} disabled={loading || !selectedClass || !deadline}>
            {loading ? 'Wird gesetzt ...' : 'Loeschfrist anwenden'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Schliessen</button>
        </div>
      </div>
    </div>
  )
}