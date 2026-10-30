// KI-Fuehrerschein - Fortschrittsverwaltung
// Offline-First: localStorage sofort, Supabase-Sync wenn online
// Sync-Queue: Offline-Aenderungen werden beim naechsten Online-Gang gesendet

import { supabase } from './supabase.js'
import { getStudentLocal } from './auth.js'

const cacheKey     = function(mid) { return 'ki_progress_' + mid }
const taskCacheKey = function(mid) { return 'ki_tasks_' + mid }
const QUEUE_KEY    = 'ki_sync_queue'

function readCache(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

// Sync-Queue: Offline-Aenderungen speichern
function addToQueue(type, moduleId, data) {
  try {
    var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
    // Bestehenden Eintrag fuer gleiche module_id ersetzen
    var idx = queue.findIndex(function(e) { return e.type === type && e.moduleId === moduleId })
    var entry = { type: type, moduleId: moduleId, data: data, ts: Date.now() }
    if (idx >= 0) queue[idx] = entry
    else queue.push(entry)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch {}
}

function getQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] }
}

function clearQueue() {
  localStorage.removeItem(QUEUE_KEY)
}

// Supabase erreichbar?
async function isOnline() {
  if (!navigator.onLine) return false
  try {
    var { error } = await supabase.from('modules').select('id').limit(1)
    return !error
  } catch { return false }
}

// Sync-Queue leeren (beim naechsten Online-Gang)
export async function flushSyncQueue() {
  var student = getStudentLocal()
  if (!student || !student.id) return { synced: 0, failed: 0 }

  var online = await isOnline()
  if (!online) return { synced: 0, failed: 0 }

  var queue   = getQueue()
  if (queue.length === 0) return { synced: 0, failed: 0 }

  var synced = 0
  var failed = 0
  var remaining = []

  for (var i = 0; i < queue.length; i++) {
    var entry = queue[i]
    try {
      if (entry.type === 'module') {
        await supabase
          .from('student_module_progress')
          .upsert(Object.assign({ student_id: student.id, module_id: entry.moduleId }, entry.data),
            { onConflict: 'student_id,module_id' })
        synced++
      } else if (entry.type === 'task') {
        await supabase
          .from('student_task_progress')
          .upsert(Object.assign({ student_id: student.id, module_id: entry.moduleId }, entry.data),
            { onConflict: 'student_id,module_id,task_id' })
        synced++
      }
    } catch {
      failed++
      remaining.push(entry)
    }
  }

  if (remaining.length > 0) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining))
  } else {
    clearQueue()
  }

  return { synced: synced, failed: failed }
}



// Modul-Fortschritt speichern (lokal sofort + Supabase wenn online)
export async function syncModuleProgress(moduleId, updates) {
  var student = getStudentLocal()

  // 1. Immer sofort lokal speichern
  var cached = readCache(cacheKey(moduleId)) || {}
  var next   = Object.assign({}, cached, { module_id: moduleId }, updates, { updated_at: new Date().toISOString() })
  writeCache(cacheKey(moduleId), next)

  if (!student || !student.id) return

  // 2. In Queue speichern (Offline-Fallback)
  addToQueue('module', moduleId, Object.assign({ updated_at: new Date().toISOString() }, updates))

  // 3. Direkt senden wenn online
  if (navigator.onLine) {
    try {
      await supabase
        .from('student_module_progress')
        .upsert(Object.assign({ student_id: student.id, module_id: moduleId, updated_at: new Date().toISOString() }, updates),
          { onConflict: 'student_id,module_id' })
      // Erfolgreich gesendet -> aus Queue entfernen
      var queue = getQueue().filter(function(e) {
        return !(e.type === 'module' && e.moduleId === moduleId)
      })
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
    } catch {
      // Bleibt in Queue fuer spaeter
    }
  }
}

// Modul als gestartet markieren
export async function startModule(moduleId) {
  var cached = readCache(cacheKey(moduleId))
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
  var score    = opts.score
  var maxScore = opts.maxScore
  var passed   = opts.passed
  var status   = passed ? 'passed' : score > 0 ? 'in_progress' : 'not_started'
  var updates  = { status: status, score: score, max_score: maxScore, passed: !!passed }
  if (passed) updates.completed_at = new Date().toISOString()
  await syncModuleProgress(moduleId, updates)
}

// Modul als bestanden markieren
export async function passModule(moduleId, score, maxScore) {
  await updateModuleProgress(moduleId, { score: score, maxScore: maxScore, passed: true })
}

// Aufgabe speichern
export async function syncTaskProgress(moduleId, taskId, updates) {
  var student = getStudentLocal()

  // Lokal speichern
  var cached = readCache(taskCacheKey(moduleId)) || {}
  cached[taskId] = Object.assign({}, cached[taskId], { task_id: taskId, module_id: moduleId }, updates, { updated_at: new Date().toISOString() })
  writeCache(taskCacheKey(moduleId), cached)

  if (!student || !student.id) return

  var taskData = Object.assign({ task_id: taskId, updated_at: new Date().toISOString() }, updates)
  addToQueue('task', moduleId, taskData)

  if (navigator.onLine) {
    try {
      await supabase
        .from('student_task_progress')
        .upsert(Object.assign({ student_id: student.id, module_id: moduleId, task_id: taskId, updated_at: new Date().toISOString() }, updates),
          { onConflict: 'student_id,module_id,task_id' })
    } catch {}
  }
}

// Aufgaben-Fortschritt laden
export async function loadTaskProgress(moduleId) {
  var student = getStudentLocal()
  if (!student || !student.id) return readCache(taskCacheKey(moduleId)) || {}

  if (!navigator.onLine) return readCache(taskCacheKey(moduleId)) || {}

  try {
    var result = await supabase
      .from('student_task_progress')
      .select('*')
      .eq('student_id', student.id)
      .eq('module_id', moduleId)
    if (result.data) {
      var map = {}
      result.data.forEach(function(r) { map[r.task_id] = r })
      writeCache(taskCacheKey(moduleId), map)
      return map
    }
  } catch {}

  return readCache(taskCacheKey(moduleId)) || {}
}

// Modul-Fortschritt laden
export async function loadModuleProgress(moduleId) {
  var student = getStudentLocal()
  if (!student || !student.id) return readCache(cacheKey(moduleId))

  if (!navigator.onLine) return readCache(cacheKey(moduleId))

  try {
    var result = await supabase
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
  var student = getStudentLocal()
  if (!student || !student.id) return []

  if (!navigator.onLine) {
    // Offline: aus lokalem Cache zusammenbauen
    var cached = []
    var moduleIds = ['modul-01', 'modul-02', 'modul-03', 'modul-04']
    moduleIds.forEach(function(mid) {
      var p = readCache(cacheKey(mid))
      if (p) cached.push(p)
    })
    return cached
  }

  try {
    var result = await supabase
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
  var all = await loadAllProgress()
  return requiredModuleIds.every(function(mid) {
    return all.find(function(p) { return p.module_id === mid && p.passed })
  })
}

// Anzahl ausstehender Sync-Eintraege
export function getPendingSyncCount() {
  return getQueue().length
}

// localStorage-Groesse pruefen
export function checkLocalStorageSize() {
  try {
    var total = 0
    for (var key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2
      }
    }
    var mb = Math.round((total / 1024 / 1024) * 100) / 100
    return { usedMB: mb, isWarning: mb > 3, isCritical: mb > 4.5 }
  } catch {
    return { usedMB: 0, isWarning: false, isCritical: false }
  }
}
