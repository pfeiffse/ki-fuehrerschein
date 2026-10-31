// progress.js - Fortschritt (localStorage sofort, Supabase async)

import { supabase } from './supabase.js'
import { getStudentLocal } from './auth.js'

const key  = mid => 'ki_prog_' + mid
const read = k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

// Supabase async senden (fire & forget)
function sendToSupabase(table, data, conflict) {
  const student = getStudentLocal()
  if (!student?.id || !navigator.onLine) return
  supabase.from(table).upsert({ student_id: student.id, ...data }, { onConflict: conflict }).catch(() => {})
}

// Modul starten
export function startModuleLocal(moduleId) {
  const cached = read(key(moduleId))
  if (cached?.started_at) return cached
  const data = { module_id: moduleId, status: 'in_progress', score: 0, max_score: 100, passed: false, started_at: new Date().toISOString() }
  save(key(moduleId), data)
  sendToSupabase('student_module_progress', data, 'student_id,module_id')
  return data
}

// Fortschritt aktualisieren
export function updateProgress(moduleId, score, maxScore, passed) {
  const status = passed ? 'passed' : score > 0 ? 'in_progress' : 'not_started'
  const data = { module_id: moduleId, status, score, max_score: maxScore, passed: !!passed }
  if (passed) data.completed_at = new Date().toISOString()
  const cached = read(key(moduleId)) || {}
  save(key(moduleId), { ...cached, ...data })
  sendToSupabase('student_module_progress', data, 'student_id,module_id')
}

// Modul bestanden
export function passModule(moduleId, score = 100, maxScore = 100) {
  updateProgress(moduleId, score, maxScore, true)
}

// Lokalen Fortschritt lesen
export function getLocalProgress(moduleId) {
  return read(key(moduleId))
}

// Alle Module aus Supabase laden (für Dashboard)
export async function loadAllProgress() {
  const student = getStudentLocal()
  if (!student?.id) {
    // Aus localStorage zusammenbauen
    return ['modul-01','modul-02','modul-03','modul-04']
      .map(mid => read(key(mid))).filter(Boolean)
  }
  if (!navigator.onLine) {
    return ['modul-01','modul-02','modul-03','modul-04']
      .map(mid => read(key(mid))).filter(Boolean)
  }
  try {
    const { data } = await supabase.from('student_module_progress')
      .select('*').eq('student_id', student.id)
    // Auch lokal cachen
    if (data) data.forEach(p => save(key(p.module_id), p))
    return data || []
  } catch {
    return ['modul-01','modul-02','modul-03','modul-04']
      .map(mid => read(key(mid))).filter(Boolean)
  }
}

// Offline-Queue für spätere Synchronisation
const QUEUE_KEY = 'ki_sync_queue'

export function queueSync(moduleId, data) {
  try {
    const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
    const idx = q.findIndex(e => e.moduleId === moduleId)
    const entry = { moduleId, data, ts: Date.now() }
    if (idx >= 0) q[idx] = entry; else q.push(entry)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
  } catch {}
}

export async function flushQueue() {
  const student = getStudentLocal()
  if (!student?.id || !navigator.onLine) return 0
  try {
    const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
    if (!q.length) return 0
    for (const e of q) {
      await supabase.from('student_module_progress')
        .upsert({ student_id: student.id, ...e.data }, { onConflict: 'student_id,module_id' })
    }
    localStorage.removeItem(QUEUE_KEY)
    return q.length
  } catch { return 0 }
}

export function getPendingCount() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]').length } catch { return 0 }
}