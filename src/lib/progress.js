// progress.js - Fortschritt (localStorage sofort, Supabase async)

import { supabase } from './supabase.js'
import { getStudentLocal } from './auth.js'

var cacheKey = function(mid) { return 'ki_prog_' + mid }
var QUEUE_KEY = 'ki_sync_queue'

function read(k) { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

function getQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] } }

function addToQueue(moduleId, data) {
  try {
    var q = getQueue()
    var idx = q.findIndex(function(e) { return e.moduleId === moduleId })
    var entry = { moduleId: moduleId, data: data, ts: Date.now() }
    if (idx >= 0) q[idx] = entry; else q.push(entry)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
  } catch {}
}

// Supabase upsert als echtes Promise ausfuehren
function supabaseUpsert(table, data, conflict) {
  var student = getStudentLocal()
  if (!student || !student.id || !navigator.onLine) return
  // Supabase gibt PostgrestFilterBuilder zurueck - in Promise wrappen
  new Promise(function(resolve, reject) {
    supabase.from(table)
      .upsert(Object.assign({ student_id: student.id }, data), { onConflict: conflict })
      .then(resolve)
      .catch(reject)
  }).catch(function() {})
}

// Modul starten
export function startModuleLocal(moduleId) {
  var cached = read(cacheKey(moduleId))
  if (cached && cached.started_at) return cached
  var data = { module_id: moduleId, status: 'in_progress', score: 0, max_score: 100, passed: false, started_at: new Date().toISOString() }
  save(cacheKey(moduleId), data)
  supabaseUpsert('student_module_progress', data, 'student_id,module_id')
  return data
}

// Fortschritt aktualisieren
export function updateProgress(moduleId, score, maxScore, passed) {
  var status = passed ? 'passed' : score > 0 ? 'in_progress' : 'not_started'
  var data = { module_id: moduleId, status: status, score: score, max_score: maxScore, passed: !!passed }
  if (passed) data.completed_at = new Date().toISOString()
  var cached = read(cacheKey(moduleId)) || {}
  save(cacheKey(moduleId), Object.assign({}, cached, data))
  addToQueue(moduleId, data)
  supabaseUpsert('student_module_progress', data, 'student_id,module_id')
}

// Modul bestanden
export function passModule(moduleId, score, maxScore) {
  updateProgress(moduleId, score || 100, maxScore || 100, true)
}

// Lokalen Fortschritt lesen
export function getLocalProgress(moduleId) {
  return read(cacheKey(moduleId))
}

// Alle Module laden
export async function loadAllProgress() {
  var student = getStudentLocal()
  var fallback = ['modul-01','modul-02','modul-03','modul-04'].map(function(mid) { return read(cacheKey(mid)) }).filter(Boolean)

  if (!student || !student.id || !navigator.onLine) return fallback

  try {
    var result = await supabase.from('student_module_progress').select('*').eq('student_id', student.id)
    if (result.data && result.data.length > 0) {
      result.data.forEach(function(p) { save(cacheKey(p.module_id), p) })
      return result.data
    }
  } catch {}
  return fallback
}

// Sync-Queue leeren
export async function flushQueue() {
  var student = getStudentLocal()
  if (!student || !student.id || !navigator.onLine) return 0
  try {
    var q = getQueue()
    if (!q.length) return 0
    for (var i = 0; i < q.length; i++) {
      await supabase.from('student_module_progress')
        .upsert(Object.assign({ student_id: student.id }, q[i].data), { onConflict: 'student_id,module_id' })
    }
    localStorage.removeItem(QUEUE_KEY)
    return q.length
  } catch { return 0 }
}

export function getPendingCount() {
  return getQueue().length
}