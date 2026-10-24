// ============================================================
// KI-Führerschein · Fortschrittsverwaltung
// Supabase (primär) + localStorage (Fallback/Cache)
// ============================================================

import { supabase } from './supabase.js'
import { getStudentLocal } from './auth.js'

// ── Lokaler Cache ─────────────────────────────────────────────

function cacheKey(moduleId)     { return `ki_progress_${moduleId}` }
function taskCacheKey(moduleId) { return `ki_tasks_${moduleId}` }

function readCache(key)        { try { return JSON.parse(localStorage.getItem(key)) } catch { return null } }
function writeCache(key, data) { try { localStorage.setItem(key, JSON.stringify(data)) } catch {} }

// ── Modul-Fortschritt ─────────────────────────────────────────

/**
 * Modul-Fortschritt laden (Supabase → localStorage-Fallback).
 */
export async function loadModuleProgress(moduleId) {
  const student = getStudentLocal()
  if (!student) return null

  const { data, error } = await supabase
    .from('student_module_progress')
    .select('*')
    .eq('student_id', student.id)
    .eq('module_id', moduleId)
    .single()

  if (error || !data) {
    // Fallback: lokaler Cache
    return readCache(cacheKey(moduleId))
  }

  writeCache(cacheKey(moduleId), data)
  return data
}

/**
 * Modul-Fortschritt speichern (Supabase + localStorage).
 */
export async function saveModuleProgress(moduleId, updates) {
  const student = getStudentLocal()
  if (!student) return

  const payload = {
    student_id:  student.id,
    module_id:   moduleId,
    updated_at:  new Date().toISOString(),
    ...updates,
  }

  // Lokaler Cache sofort aktualisieren
  const cached = readCache(cacheKey(moduleId)) ?? {}
  writeCache(cacheKey(moduleId), { ...cached, ...payload })

  // Supabase upsert
  const { error } = await supabase
    .from('student_module_progress')
    .upsert(payload, { onConflict: 'student_id,module_id' })

  if (error) {
    console.warn('[progress] Supabase-Fehler, nur lokal gespeichert:', error.message)
  }
}

/**
 * Modul als gestartet markieren.
 */
export async function startModule(moduleId) {
  await saveModuleProgress(moduleId, {
    status:     'in_progress',
    started_at: new Date().toISOString(),
  })
}

/**
 * Modul als abgeschlossen markieren.
 */
export async function completeModule(moduleId, score, maxScore) {
  const passed = score >= maxScore * 0.8   // 80% = bestanden
  await saveModuleProgress(moduleId, {
    status:       passed ? 'passed' : 'completed',
    score,
    max_score:    maxScore,
    passed,
    completed_at: new Date().toISOString(),
  })
  return passed
}

// ── Aufgaben-Fortschritt ──────────────────────────────────────

/**
 * Alle Aufgaben eines Moduls laden.
 */
export async function loadTaskProgress(moduleId) {
  const student = getStudentLocal()
  if (!student) return {}

  const { data, error } = await supabase
    .from('student_task_progress')
    .select('*')
    .eq('student_id', student.id)
    .eq('module_id', moduleId)

  if (error || !data) {
    return readCache(taskCacheKey(moduleId)) ?? {}
  }

  // Array → Map { taskId: row }
  const map = Object.fromEntries(data.map(r => [r.task_id, r]))
  writeCache(taskCacheKey(moduleId), map)
  return map
}

/**
 * Einzelne Aufgabe speichern.
 */
export async function saveTaskProgress(moduleId, taskId, updates) {
  const student = getStudentLocal()
  if (!student) return

  const payload = {
    student_id: student.id,
    module_id:  moduleId,
    task_id:    taskId,
    updated_at: new Date().toISOString(),
    ...updates,
  }

  // Lokaler Cache
  const cached = readCache(taskCacheKey(moduleId)) ?? {}
  cached[taskId] = { ...cached[taskId], ...payload }
  writeCache(taskCacheKey(moduleId), cached)

  // Supabase upsert
  const { error } = await supabase
    .from('student_task_progress')
    .upsert(payload, { onConflict: 'student_id,module_id,task_id' })

  if (error) {
    console.warn('[progress] Task-Fehler, nur lokal gespeichert:', error.message)
  }
}

/**
 * Aufgabe als erledigt markieren (mit Punkten).
 */
export async function completeTask(moduleId, taskId, score = 0) {
  await saveTaskProgress(moduleId, taskId, {
    status:   'completed',
    score,
    attempts: 1,
  })
}

/**
 * Quiz-Antwort speichern (mit Versuchszähler).
 */
export async function saveQuizAnswer(moduleId, taskId, correct, score, attempts) {
  await saveTaskProgress(moduleId, taskId, {
    status:   correct ? 'passed' : 'failed',
    score:    correct ? score : 0,
    attempts,
  })
}

// ── Gesamtfortschritt ─────────────────────────────────────────

/**
 * Fortschritt aller Module eines Schülers laden.
 */
export async function loadAllProgress() {
  const student = getStudentLocal()
  if (!student) return []

  const { data } = await supabase
    .from('student_module_progress')
    .select('*')
    .eq('student_id', student.id)

  return data ?? []
}

/**
 * Prüfen ob alle Pflichtmodule bestanden sind (für Zertifikat).
 */
export async function checkCertificateEligibility(requiredModuleIds) {
  const allProgress = await loadAllProgress()
  return requiredModuleIds.every(moduleId => {
    const p = allProgress.find(r => r.module_id === moduleId)
    return p?.passed === true
  })
}

// ── Offline-Sync ──────────────────────────────────────────────

/**
 * Lokale Daten mit Supabase synchronisieren (nach Reconnect).
 */
export async function syncOfflineData(moduleIds) {
  for (const moduleId of moduleIds) {
    const cached = readCache(cacheKey(moduleId))
    if (cached?.student_id) {
      await supabase
        .from('student_module_progress')
        .upsert(cached, { onConflict: 'student_id,module_id' })
    }

    const tasks = readCache(taskCacheKey(moduleId))
    if (tasks) {
      const rows = Object.values(tasks).filter(r => r.student_id)
      if (rows.length > 0) {
        await supabase
          .from('student_task_progress')
          .upsert(rows, { onConflict: 'student_id,module_id,task_id' })
      }
    }
  }
}