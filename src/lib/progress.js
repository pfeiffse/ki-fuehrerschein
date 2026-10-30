// KI-Fuehrerschein - Fortschrittsverwaltung
// localStorage (primaer, sofort) + Supabase (sync, fuer Lehrkraft)

import { supabase } from './supabase.js'
import { getStudentLocal } from './auth.js'

const cacheKey     = mid => 'ki_progress_' + mid
const taskCacheKey = mid => 'ki_tasks_' + mid

function readCache(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

// Modul-Fortschritt speichern (lokal + Supabase)
export async function syncModuleProgress(moduleId, updates) {
  const student = getStudentLocal()
  const cached  = readCache(cacheKey(moduleId)) || {}
  const next    = Object.assign({}, cached, { module_id: moduleId }, updates, { updated_at: new Date().toISOString() })
  writeCache(cacheKey(moduleId), next)

  if (!student || !student.id) return

  try {
    await supabase
      .from('student_module_progress')
      .upsert(Object.assign({ student_id: student.id, module_id: moduleId, updated_at: new Date().toISOString() }, updates),
        { onConflict: 'student_id,module_id' })
  } catch (err) {
    console.warn('[progress] Supabase-Sync fehlgeschlagen:', err.message)
  }
}

// Modul als gestartet markieren
export async function startModule(moduleId) {
  const cached = readCache(cacheKey(moduleId))
  if (cached && cached.started_at) return
  await syncModuleProgress(moduleId, {
    status:     'in_progress',
    score:      0,
    max_score:  100,
    passed:     false,
    started_at: new Date().toISOString(),
  })
}

// Modul-Fortschritt aktualisieren
export async function updateModuleProgress(moduleId, opts) {
  const score    = opts.score
  const maxScore = opts.maxScore
  const passed   = opts.passed
  const status   = passed ? 'passed' : score > 0 ? 'in_progress' : 'not_started'
  const updates  = { status: status, score: score, max_score: maxScore, passed: !!passed }
  if (passed) updates.completed_at = new Date().toISOString()
  await syncModuleProgress(moduleId, updates)
}

// Modul als bestanden markieren
export async function passModule(moduleId, score, maxScore) {
  await updateModuleProgress(moduleId, { score: score, maxScore: maxScore, passed: true })
}

// Aufgabe speichern (lokal + Supabase)
export async function syncTaskProgress(moduleId, taskId, updates) {
  const student = getStudentLocal()
  const cached  = readCache(taskCacheKey(moduleId)) || {}
  cached[taskId] = Object.assign({}, cached[taskId], { task_id: taskId, module_id: moduleId }, updates, { updated_at: new Date().toISOString() })
  writeCache(taskCacheKey(moduleId), cached)

  if (!student || !student.id) return
  try {
    await supabase
      .from('student_task_progress')
      .upsert(Object.assign({ student_id: student.id, module_id: moduleId, task_id: taskId, updated_at: new Date().toISOString() }, updates),
        { onConflict: 'student_id,module_id,task_id' })
  } catch (err) {
    console.warn('[progress] Task-Sync fehlgeschlagen:', err.message)
  }
}

// Aufgaben-Fortschritt laden
export async function loadTaskProgress(moduleId) {
  const student = getStudentLocal()
  if (!student || !student.id) return readCache(taskCacheKey(moduleId)) || {}

  try {
    const result = await supabase
      .from('student_task_progress')
      .select('*')
      .eq('student_id', student.id)
      .eq('module_id', moduleId)
    if (result.data) {
      const map = {}
      result.data.forEach(function(r) { map[r.task_id] = r })
      writeCache(taskCacheKey(moduleId), map)
      return map
    }
  } catch {}

  return readCache(taskCacheKey(moduleId)) || {}
}

// Modul-Fortschritt laden
export async function loadModuleProgress(moduleId) {
  const student = getStudentLocal()
  if (!student || !student.id) return readCache(cacheKey(moduleId))

  try {
    const result = await supabase
      .from('student_module_progress')
      .select('*')
      .eq('student_id', student.id)
      .eq('module_id', moduleId)
      .single()
    if (result.data) {
      writeCache(cacheKey(moduleId), result.data)
      return result.data
    }
  } catch {}

  return readCache(cacheKey(moduleId))
}

// Alle Module laden
export async function loadAllProgress() {
  const student = getStudentLocal()
  if (!student || !student.id) return []

  try {
    const result = await supabase
      .from('student_module_progress')
      .select('*')
      .eq('student_id', student.id)
    return result.data || []
  } catch {
    return []
  }
}

// Zertifikat-Berechtigung pruefen
export async function checkCertificateEligibility(requiredModuleIds) {
  const all = await loadAllProgress()
  return requiredModuleIds.every(function(mid) {
    return all.find(function(p) { return p.module_id === mid && p.passed })
  })
}

// Offline-Sync
export async function syncOfflineData(moduleIds) {
  const student = getStudentLocal()
  if (!student || !student.id) return

  for (var i = 0; i < moduleIds.length; i++) {
    var moduleId = moduleIds[i]
    var cached   = readCache(cacheKey(moduleId))
    if (cached && !cached.student_id) {
      cached.student_id = student.id
      try {
        await supabase
          .from('student_module_progress')
          .upsert(cached, { onConflict: 'student_id,module_id' })
      } catch {}
    }
  }
}