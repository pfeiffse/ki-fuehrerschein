// auth.js - Authentifizierung (kein Blocking beim Start)

import { supabase } from './supabase.js'

const TOKEN_KEY   = 'ki_token'
const STUDENT_KEY = 'ki_student'
const CLASS_KEY   = 'ki_class'
const TEACHER_KEY = 'ki_teacher'

// SHA-256 Hash im Browser
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
}

// Lokalen Student sofort lesen (synchron, 0ms)
export function getStudentLocal() {
  try { return JSON.parse(localStorage.getItem(STUDENT_KEY)) } catch { return null }
}

export function getCachedClass() {
  try { return JSON.parse(localStorage.getItem(CLASS_KEY)) } catch { return null }
}

export function clearLocalData() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('ki_'))
    .forEach(k => localStorage.removeItem(k))
}

// Anmelden (nur aufgerufen wenn Nutzer aktiv anmeldet)
export async function studentJoin(joinCode, displayName) {
  if (!navigator.onLine) {
    const cached = getStudentLocal()
    const cls    = getCachedClass()
    if (cached && cls && cls.join_code === joinCode.toUpperCase().trim()) {
      return { student: cached, class: cls, offline: true }
    }
    return { error: 'Kein Internet. Bitte zuerst online anmelden.' }
  }

  const { data: cls, error: clsErr } = await supabase
    .from('classes')
    .select('id, name, grade, join_code')
    .eq('join_code', joinCode.toUpperCase().trim())
    .single()

  if (clsErr || !cls) {
    return { error: 'Klassencode nicht gefunden. Bitte bei der Lehrkraft nachfragen.' }
  }

  const existingToken = localStorage.getItem(TOKEN_KEY)
  if (existingToken) {
    const { data: existing } = await supabase
      .from('students').select('*')
      .eq('session_token', existingToken).eq('class_id', cls.id).single()
    if (existing) {
      localStorage.setItem(STUDENT_KEY, JSON.stringify(existing))
      localStorage.setItem(CLASS_KEY,   JSON.stringify(cls))
      return { student: existing, class: cls }
    }
    clearLocalData()
  }

  const token = crypto.randomUUID()
  const { data: student, error: stuErr } = await supabase
    .from('students')
    .insert({ class_id: cls.id, display_name: displayName.trim(), session_token: token })
    .select().single()

  if (stuErr) return { error: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.' }

  localStorage.setItem(TOKEN_KEY,   token)
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student))
  localStorage.setItem(CLASS_KEY,   JSON.stringify(cls))
  return { student, class: cls }
}

// Session im Hintergrund aktualisieren (nicht blockierend)
export function refreshStudentAsync() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token || !navigator.onLine) return
  supabase.from('students').select('*, classes(id,name,grade,join_code)')
    .eq('session_token', token).single()
    .then(({ data }) => {
      if (data) {
        localStorage.setItem(STUDENT_KEY, JSON.stringify(data))
        if (data.classes) localStorage.setItem(CLASS_KEY, JSON.stringify(data.classes))
      }
    }).catch(() => {})
}

export function studentLogout() { clearLocalData() }

// ============================================================
// LEHRKRAFT-LOGIN (ohne Supabase Auth, direkt via users-Tabelle)
// ============================================================

export async function teacherLogin(username, password) {
  try {
    const hash = await sha256(password)
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, role, school_id, pw_hash')
      .eq('username', username.trim().toLowerCase())
      .single()

    if (error || !data) return { error: 'Benutzername nicht gefunden.' }

    // Erster Login: Passwort noch nicht gesetzt → Hash speichern
    if (!data.pw_hash) {
      await Promise.resolve(
        supabase.from('users').update({ pw_hash: hash }).eq('id', data.id)
      )
      const teacher = { id: data.id, display_name: data.display_name, role: data.role, school_id: data.school_id }
      localStorage.setItem(TEACHER_KEY, JSON.stringify(teacher))
      return { teacher }
    }

    if (data.pw_hash !== hash) return { error: 'Falsches Passwort.' }

    const teacher = { id: data.id, display_name: data.display_name, role: data.role, school_id: data.school_id }
    localStorage.setItem(TEACHER_KEY, JSON.stringify(teacher))
    return { teacher }
  } catch (err) {
    return { error: 'Verbindungsfehler: ' + err.message }
  }
}

export function teacherLogout() {
  localStorage.removeItem(TEACHER_KEY)
}

export function getTeacherLocal() {
  try { return JSON.parse(localStorage.getItem(TEACHER_KEY)) } catch { return null }
}

export async function getTeacherSession() {
  return getTeacherLocal()
}

export async function getTeacherProfile() {
  const teacher = getTeacherLocal()
  if (!teacher) return null
  try {
    const { data } = await supabase.from('users').select('*, schools(name)').eq('id', teacher.id).single()
    return data
  } catch { return teacher }
}

// Lehrkraft/Admin anlegen (direkt in users-Tabelle, kein Supabase Auth)
export async function createTeacherAccount({ name, username, password, role }) {
  try {
    const hash = await sha256(password)
    const id = crypto.randomUUID()
    const { data, error } = await supabase.from('users').insert({
      id,
      display_name: name.trim(),
      username: username.trim().toLowerCase(),
      pw_hash: hash,
      role,
      school_id: '00000000-0000-0000-0000-000000000001'
    }).select().single()

    if (error) {
      if (error.code === '23505') return { error: 'Benutzername bereits vergeben.' }
      return { error: 'Fehler: ' + error.message }
    }
    return { teacher: data }
  } catch (err) {
    return { error: 'Verbindungsfehler: ' + err.message }
  }
}
