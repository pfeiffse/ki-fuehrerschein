// auth.js - Authentifizierung

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

// ── Schüler ──────────────────────────────────────────────────────────────────

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

  // 1. Versuch: per session_token wiederfinden (schnellster Weg)
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

  // 2. Versuch: per Name + Klasse wiederfinden (Token verloren, z.B. Cache geleert)
  const { data: byName } = await supabase
    .from('students').select('*')
    .eq('class_id', cls.id)
    .ilike('display_name', displayName.trim())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (byName) {
    // Bestehenden Account wiederherstellen – neuen Token setzen
    const newToken = crypto.randomUUID()
    await Promise.resolve(
      supabase.from('students').update({ session_token: newToken }).eq('id', byName.id)
    )
    const restored = { ...byName, session_token: newToken }
    localStorage.setItem(TOKEN_KEY,   newToken)
    localStorage.setItem(STUDENT_KEY, JSON.stringify(restored))
    localStorage.setItem(CLASS_KEY,   JSON.stringify(cls))
    return { student: restored, class: cls, restored: true }
  }

  // 3. Neuen Account anlegen
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

// ── Lehrkraft (eigene teachers-Tabelle, kein Supabase Auth) ──────────────────

export async function teacherLogin(username, password) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('id, display_name, role, school_id, pw_hash')
      .eq('username', username.trim().toLowerCase())
      .single()

    if (error || !data) return { error: 'Benutzername nicht gefunden.' }

    const hash = await sha256(password)

    // Erster Login: noch kein Passwort gesetzt → Hash speichern
    if (!data.pw_hash) {
      await Promise.resolve(
        supabase.from('teachers').update({ pw_hash: hash }).eq('id', data.id)
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
    const { data } = await supabase.from('teachers').select('*').eq('id', teacher.id).single()
    return data || teacher
  } catch { return teacher }
}

// Lehrkraft/Admin anlegen (direkt in teachers-Tabelle, kein Supabase Auth, kein FK)
export async function createTeacherAccount({ name, username, password, role }) {
  try {
    const hash = await sha256(password)
    const { data, error } = await supabase.from('teachers').insert({
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
