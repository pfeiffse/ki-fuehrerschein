// KI-Fuehrerschein - Fortschrittsverwaltung
// Offline-First: localStorage sofort, Supabase async im Hintergrund

import { supabase } from './supabase.js'
import { getStudentLocal } from './auth.js'

var cacheKey     = function(mid) { return 'ki_progress_' + mid }
var taskCacheKey = function(mid) { return 'ki_tasks_' + mid }
var QUEUE_KEY    = 'ki_sync_queue'

function readCache(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

function getQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] }
}

function addToQueue(type, moduleId, data) {
  try {
    var queue = getQueue()
    var idx = queue.findIndex(function(e) { return e.type === type && e.moduleId === moduleId })
    var entry = { type: type, moduleId: moduleId, data: data, ts: Date.now() }
    if (idx >= 0) queue[idx] = entry
    else queue.push(entry)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch {}
}

// Sync-Queue leeren
export async function flushSyncQueue() {
  var student = getStudentLocal()
  if (!student || !student.id) return { synced: 0, failed: 0 }
  if (!navigator.onLine) return { synced: 0, failed: 0 }

  var queue = getQueue()
  if (queue.length === 0) return { synced: 0, failed: 0 }

  var synced = 0
  var failed = 0
  var remaining = []

  for (var i = 0; i < queue.length; i++) {
    var entry = queue[i]
    try {
      if (entry.type === 'module') {
        await supabase.from('student_module_progress')
          .upsert(Object.assign({ student_id: student.id, module_id: entry.moduleId }, entry.data),
            { onConflict: 'student_id,module_id' })
        synced++
      } else if (entry.type === 'task') {
        await supabase.from('student_task_progress')
          .upsert(Object.assign({ student_id: student.id, module_id: entry.moduleId }, entry.data),
            { onConflict: 'student_id,module_id,task_id' })
        synced++
      }
    } catch {
      failed++
      remaining.push(entry)
    }
  }

  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining))
  return { synced: synced, failed: failed }
}

export function getPendingSyncCount() {
  return getQueue().length
}

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

// Modul-Fortschritt speichern: SOFORT lokal, ASYNC Supabase im Hintergrund
export async function syncModuleProgress(moduleId, updates) {
  var student = getStudentLocal()

  // 1. Sofort lokal speichern
  var cached = readCache(cacheKey(moduleId)) || {}
  var next   = Object.assign({}, cached, { module_id: moduleId }, updates, { updated_at: new Date().toISOString() })
  writeCache(cacheKey(moduleId), next)

  if (!student || !student.id) return

  // 2. In Queue speichern
  addToQueue('module', moduleId, Object.assign({ updated_at: new Date().toISOString() }, updates))

  // 3. Async im Hintergrund senden (nicht awaiten - blockiert nicht)
  if (navigator.onLine) {
    supabase.from('student_module_progress')
      .upsert(Object.assign({ student_id: student.id, module_id: moduleId, updated_at: new Date().toISOString() }, updates),
        { onConflict: 'student_id,module_id' })
      .then(function() {
        // Erfolgreich -> aus Queue entfernen
        var q = getQueue().filter(function(e) { return !(e.type === 'module' && e.moduleId === moduleId) })
        localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
      })
      .catch(function() {}) // Bleibt in Queue
  }
}

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

export async function updateModuleProgress(moduleId, opts) {
  var status  = opts.passed ? 'passed' : opts.score > 0 ? 'in_progress' : 'not_started'
  var updates = { status: status, score: opts.score, max_score: opts.maxScore, passed: !!opts.passed }
  if (opts.passed) updates.completed_at = new Date().toISOString()
  await syncModuleProgress(moduleId, updates)
}

export async function passModule(moduleId, score, maxScore) {
  await updateModuleProgress(moduleId, { score: score, maxScore: maxScore, passed: true })
}

export async function syncTaskProgress(moduleId, taskId, updates) {
  var student = getStudentLocal()

  // Lokal speichern
  var cached = readCache(taskCacheKey(moduleId)) || {}
  cached[taskId] = Object.assign({}, cached[taskId], { task_id: taskId, module_id: moduleId }, updates, { updated_at: new Date().toISOString() })
  writeCache(taskCacheKey(moduleId), cached)

  if (!student || !student.id) return

  addToQueue('task', moduleId, Object.assign({ task_id: taskId, updated_at: new Date().toISOString() }, updates))

  if (navigator.onLine) {
    supabase.from('student_task_progress')
      .upsert(Object.assign({ student_id: student.id, module_id: moduleId, task_id: taskId, updated_at: new Date().toISOString() }, updates),
        { onConflict: 'student_id,module_id,task_id' })
      .catch(function() {})
  }
}

export async function loadTaskProgress(moduleId) {
  var student = getStudentLocal()
  if (!student || !student.id || !navigator.onLine) return readCache(taskCacheKey(moduleId)) || {}

  try {
    var result = await supabase.from('student_task_progress').select('*')
      .eq('student_id', student.id).eq('module_id', moduleId)
    if (result.data) {
      var map = {}
      result.data.forEach(function(r) { map[r.task_id] = r })
      writeCache(taskCacheKey(moduleId), map)
      return map
    }
  } catch {}
  return readCache(taskCacheKey(moduleId)) || {}
}

export async function loadModuleProgress(moduleId) {
  var student = getStudentLocal()
  if (!student || !student.id || !navigator.onLine) return readCache(cacheKey(moduleId))

  try {
    var result = await supabase.from('student_module_progress').select('*')
      .eq('student_id', student.id).eq('module_id', moduleId).single()
    if (result.data) {
      writeCache(cacheKey(moduleId), result.data)
      return result.data
    }
  } catch {}
  return readCache(cacheKey(moduleId))
}

export async function loadAllProgress() {
  var student = getStudentLocal()
  if (!student || !student.id) return []

  if (!navigator.onLine) {
    var cached = []
    var moduleIds = ['modul-01', 'modul-02', 'modul-03', 'modul-04']
    moduleIds.forEach(function(mid) {
      var p = readCache(cacheKey(mid))
      if (p) cached.push(p)
    })
    return cached
  }

  try {
    var result = await supabase.from('student_module_progress').select('*').eq('student_id', student.id)
    return result.data || []
  } catch {
    return []
  }
}

export async function checkCertificateEligibility(requiredModuleIds) {
  var all = await loadAllProgress()
  return requiredModuleIds.every(function(mid) {
    return all.find(function(p) { return p.module_id === mid && p.passed })
  })
}