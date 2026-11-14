// AdminCertificates - Zertifikate aller Schüler für Admin-Druck

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { getTeacherLocal } from '../../lib/auth.js'
import { MODULES, REQUIRED_MODULE_IDS } from '../../lib/achievements.js'
import { generateCode } from '../../lib/levelCode.js'

const BASE = import.meta.env.BASE_URL

export default function AdminCertificates() {
  const navigate   = useNavigate()
  const [notes,    setNotes]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all') // all | ready | inprogress
  const [selected, setSelected] = useState(new Set())
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    const teacher = getTeacherLocal()
    if (!teacher || (teacher.role !== 'superadmin' && teacher.role !== 'teacher')) {
      navigate('/lehrer')
      return
    }
    loadNotes()
  }, [])

  async function loadNotes() {
    setLoading(true)
    const { data } = await supabase
      .from('student_notes')
      .select('*, students(display_name, classes(name))')
      .order('student_name')
    setNotes(data || [])
    setLoading(false)
  }

  function isEligible(note) {
    const ach = note.achievements || {}
    return REQUIRED_MODULE_IDS.every(id => !!ach[id])
  }

  const filtered = notes.filter(n => {
    if (filter === 'ready')      return isEligible(n)
    if (filter === 'inprogress') return !isEligible(n)
    return true
  })

  const readyCount = notes.filter(isEligible).length

  function toggleSelect(id) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function selectAll() {
    const eligible = filtered.filter(isEligible).map(n => n.student_id)
    setSelected(new Set(eligible))
  }

  function printSelected() {
    const toPrint = notes.filter(n => selected.has(n.student_id))
    if (toPrint.length === 0) return
    setPrinting(true)
    setTimeout(() => {
      window.print()
      setPrinting(false)
    }, 300)
  }

  const darkBox = { background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem' }
  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div style={{ background: 'linear-gradient(145deg, var(--slzb-navy), var(--slzb-blue))', minHeight: '100vh' }}>

      {/* Print-Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .cert-print-page {
            page-break-after: always;
            width: 210mm;
            height: 297mm;
            padding: 12mm;
            box-sizing: border-box;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body { background: white !important; }
          @page { size: A4 portrait; margin: 0; }
        }
        @media screen {
          .cert-print-page { display: none; }
        }
      `}</style>

      {/* Steuerbereich (nur am Bildschirm) */}
      <div className="no-print wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/lehrer/dashboard')}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '99px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'var(--fs-sm)' }}>
            ← Zurück
          </button>
          <h1 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>🏆 Zertifikate drucken</h1>
          <div style={{ marginLeft: 'auto', background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: '99px', padding: '4px 12px', color: '#4ade80', fontWeight: 800, fontSize: 'var(--fs-sm)' }}>
            {readyCount} bereit
          </div>
        </div>

        {/* Filter + Aktionen */}
        <div style={darkBox}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[['all','Alle'], ['ready','✓ Bereit'], ['inprogress','In Bearbeitung']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{ padding: '6px 14px', borderRadius: '99px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 'var(--fs-sm)',
                  background: filter === val ? '#4ade80' : 'rgba(255,255,255,0.1)',
                  color: filter === val ? '#0f2a3d' : 'white' }}>
                {label}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button onClick={selectAll}
                style={{ padding: '6px 14px', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.3)', background: 'none', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'var(--fs-sm)' }}>
                Alle auswählen
              </button>
              <button onClick={printSelected} disabled={selected.size === 0}
                style={{ padding: '6px 18px', borderRadius: '99px', border: 'none', background: selected.size > 0 ? '#4ade80' : 'rgba(255,255,255,0.1)', color: selected.size > 0 ? '#0f2a3d' : 'rgba(255,255,255,0.3)', cursor: selected.size > 0 ? 'pointer' : 'default', fontFamily: 'inherit', fontWeight: 800, fontSize: 'var(--fs-sm)' }}>
                🖨️ {selected.size > 0 ? `${selected.size} drucken` : 'Drucken'}
              </button>
            </div>
          </div>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Wird geladen…</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: 'var(--fs-sm)' }}>
                <thead>
                  <tr>{['☐','Name','Klasse','Module','XP','Merksatz',''].map(h => (
                    <th key={h} style={{ padding: '0.5rem', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 'var(--fs-xs)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(note => {
                    const ach = note.achievements || {}
                    const passedCount = REQUIRED_MODULE_IDS.filter(id => !!ach[id]).length
                    const eligible = isEligible(note)
                    const isSel = selected.has(note.student_id)
                    return (
                      <tr key={note.student_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: isSel ? 'rgba(74,222,128,0.08)' : 'transparent' }}>
                        <td style={{ padding: '0.625rem 0.5rem' }}>
                          {eligible && (
                            <input type="checkbox" checked={isSel} onChange={() => toggleSelect(note.student_id)}
                              style={{ width: '16px', height: '16px', accentColor: '#4ade80', cursor: 'pointer' }} />
                          )}
                        </td>
                        <td style={{ padding: '0.625rem 0.5rem', fontWeight: 700 }}>{note.student_name || '–'}</td>
                        <td style={{ padding: '0.625rem 0.5rem', color: 'rgba(255,255,255,0.6)' }}>{note.klasse || note.students?.classes?.name || '–'}</td>
                        <td style={{ padding: '0.625rem 0.5rem' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {REQUIRED_MODULE_IDS.map(id => (
                              <span key={id} style={{ width: '20px', height: '20px', borderRadius: '4px', background: ach[id] ? '#4ade80' : 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', fontSize: '0.6rem', fontWeight: 900, color: ach[id] ? '#0f2a3d' : 'rgba(255,255,255,0.3)' }}>
                                {ach[id] ? '✓' : '○'}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '0.625rem 0.5rem', color: '#fbbf24', fontWeight: 700 }}>{note.xp || 0}</td>
                        <td style={{ padding: '0.625rem 0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-xs)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {note.merksatz || '–'}
                        </td>
                        <td style={{ padding: '0.625rem 0.5rem' }}>
                          {eligible ? (
                            <span style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80', borderRadius: '99px', padding: '2px 8px', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>✓ Bereit</span>
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--fs-xs)' }}>{passedCount}/4</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>Keine Einträge gefunden.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Druckbereich: Zertifikate der ausgewählten Schüler */}
      {notes.filter(n => selected.has(n.student_id)).map(note => {
        const ach = note.achievements || {}
        const levelCode = generateCode(7, REQUIRED_MODULE_IDS.filter(id => !!ach[id]))
        return (
          <React.Fragment key={note.student_id}>
            {/* Vorderseite */}
            <div className="cert-print-page" style={{ display: 'flex', flexDirection: 'column', background: 'white', fontFamily: 'inherit' }}>
              <div style={{ border: '6px solid #087f83', outline: '2px solid #ffda76', outlineOffset: '-12px', padding: '8mm 10mm', flex: 1, display: 'flex', flexDirection: 'column', background: 'radial-gradient(ellipse at 50% 0%, #e8f7f4 0%, white 60%)', position: 'relative' }}>
                {/* Logo */}
                <div style={{ position: 'absolute', top: '8mm', right: '8mm' }}>
                  <img src={BASE + 'slzb-ki-logo.png'} alt="SLZB" style={{ width: '28mm', height: 'auto' }} onError={e => e.target.style.display='none'} />
                </div>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '6mm' }}>
                  <div style={{ fontWeight: 800, letterSpacing: '2px', color: '#087f83', fontSize: '9pt', textTransform: 'uppercase' }}>
                    KI-Führerschein · Klasse {note.klasse || '7'} · {note.schule || 'SLZB'}
                  </div>
                  <div style={{ fontSize: '28pt', margin: '2mm 0' }}>🤖 🏅 🌍</div>
                  <h1 style={{ fontSize: '26pt', color: '#095c6b', margin: '2mm 0 3mm', fontFamily: 'inherit' }}>KI-FÜHRERSCHEIN</h1>
                  <p style={{ fontSize: '10pt', color: '#536f7c', margin: '0 0 4mm' }}>Zertifikat für einen kompetenten und verantwortungsvollen Umgang mit KI</p>
                  {/* Name */}
                  <div style={{ fontSize: '22pt', fontWeight: 900, color: '#16495b', borderBottom: '2px solid #ffda76', maxWidth: '140mm', margin: '0 auto 5mm', paddingBottom: '3mm' }}>
                    {note.student_name || '–'}
                  </div>
                  <p style={{ fontSize: '10pt', color: '#536f7c', margin: '0 0 5mm' }}>
                    hat alle vier Pflichtmodule des KI-Führerscheins erfolgreich abgeschlossen
                  </p>
                  {/* Achievements */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3mm', margin: '0 0 5mm' }}>
                    {MODULES.filter(m => !m.optional).map(mod => (
                      <div key={mod.id} style={{ background: '#dff5f1', border: '1px solid #b6e1da', borderRadius: '99px', padding: '2mm 5mm', fontSize: '9pt', fontWeight: 800, color: '#095c6b' }}>
                        {mod.achievement.icon} {mod.achievement.title}
                      </div>
                    ))}
                  </div>
                  {/* Merksatz */}
                  {note.merksatz && (
                    <div style={{ margin: '0 auto 5mm', padding: '4mm 6mm', background: '#f0fafb', borderLeft: '4px solid #ffda76', maxWidth: '140mm', fontWeight: 700, fontSize: '10pt', textAlign: 'left', color: '#163348' }}>
                      „{note.merksatz}"
                    </div>
                  )}
                  {/* Vorleistungs-Code */}
                  {levelCode && (
                    <div style={{ display: 'inline-block', padding: '2mm 5mm', background: '#fff8db', border: '1px solid #ffda76', borderRadius: '4px', marginBottom: '4mm' }}>
                      <span style={{ fontSize: '8pt', color: '#825300', fontWeight: 700, marginRight: '3mm' }}>🏅 Vorleistungs-Code Klasse 8:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '11pt', color: '#825300' }}>{levelCode}</span>
                    </div>
                  )}
                </div>
                {/* Unterschrift */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '15mm', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ borderTop: '1.5px solid #7196a7', paddingTop: '2mm' }}>
                      <div style={{ fontWeight: 700, fontSize: '10pt' }}>{today}</div>
                      <div style={{ fontSize: '8pt', color: '#536f7c' }}>Datum</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ borderTop: '1.5px solid #7196a7', paddingTop: '2mm' }}>
                      <div style={{ fontSize: '8pt', color: '#536f7c' }}>Unterschrift Lehrkraft</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ borderTop: '1.5px solid #7196a7', paddingTop: '2mm' }}>
                      <div style={{ fontSize: '8pt', color: '#536f7c' }}>Stempel</div>
                    </div>
                  </div>
                  <div style={{ minWidth: '20mm', textAlign: 'right' }}>
                    <img src={BASE + 'slzb-ki-logo.png'} alt="SLZB" style={{ width: '18mm', opacity: 0.7 }} onError={e => e.target.style.display='none'} />
                  </div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '7pt', color: '#547080', marginTop: '4mm' }}>
                  KI-Führerschein · Klasse 7 · Alle vier Pflichtmodule bestanden · SLZB
                </div>
              </div>
            </div>

            {/* Rückseite */}
            <div className="cert-print-page" style={{ display: 'flex', flexDirection: 'column', background: 'white', fontFamily: 'inherit' }}>
              <div style={{ border: '4px solid #087f83', outline: '2px solid #ffda76', outlineOffset: '-10px', padding: '8mm 10mm', flex: 1, display: 'flex', flexDirection: 'column', gap: '5mm', background: 'radial-gradient(ellipse at 50% 0%, #e8f7f4 0%, white 60%)' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #087f83', paddingBottom: '4mm' }}>
                  <div style={{ fontWeight: 800, letterSpacing: '2px', color: '#087f83', fontSize: '9pt', textTransform: 'uppercase' }}>KI-Führerschein · Rückseite</div>
                  <div style={{ fontWeight: 900, fontSize: '16pt', color: '#095c6b', marginTop: '2mm' }}>Meine Erkenntnisse</div>
                  <div style={{ fontSize: '10pt', color: '#536f7c' }}>{note.student_name}</div>
                </div>
                {[
                  { label: '💬 Mein persönlicher Merksatz', value: note.merksatz },
                  { label: '🌐 Digitaler Fußabdruck', value: note.fussabdruck },
                  { label: '🧭 Mein KI-Kompass', value: note.ki_kompass },
                ].map((field, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '9pt', color: '#087f83', marginBottom: '2mm', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</div>
                    <div style={{ borderLeft: '4px solid #ffda76', paddingLeft: '4mm', minHeight: '14mm', background: '#f0fafb', borderRadius: '0 6px 6px 0', padding: '3mm 4mm', fontSize: '10pt', color: field.value ? '#163348' : '#aaa', fontStyle: field.value ? 'normal' : 'italic' }}>
                      {field.value || '(noch nicht ausgefüllt)'}
                    </div>
                  </div>
                ))}
                <div style={{ flex: 2 }}>
                  <div style={{ fontWeight: 800, fontSize: '9pt', color: '#087f83', marginBottom: '3mm', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📝 Reflexion</div>
                  {['Was war meine überraschendste Erkenntnis?', 'Wie werde ich KI in Zukunft anders nutzen?'].map((q, i) => (
                    <div key={i} style={{ marginBottom: '4mm' }}>
                      <div style={{ fontSize: '8pt', fontWeight: 700, color: '#536f7c', marginBottom: '1mm' }}>{q}</div>
                      <div style={{ borderBottom: '1px solid #7196a7', height: '8mm' }} />
                      <div style={{ borderBottom: '1px solid #7196a7', height: '8mm' }} />
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', fontSize: '7pt', color: '#547080', borderTop: '1px solid #7196a7', paddingTop: '3mm' }}>
                  KI-Führerschein · Klasse 7 · SLZB
                </div>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
