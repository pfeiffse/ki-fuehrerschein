// auth.js - Authentifizierung (kein Blocking beim Start)

import { supabase } from './supabase.js'

const TOKEN_KEY   = 'ki_token'
const STUDENT_KEY = 'ki_student'
const CLASS_KEY   = 'ki_class'

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

// Lehrkraft
export async function teacherLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { session: data.session }
}

export async function teacherLogout() { await supabase.auth.signOut() }

export async function getTeacherSession() {
  try {
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch { return null }
}

export async function getTeacherProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase.from('users').select('*, schools(name)').eq('id', user.id).single()
    return data
  } catch { return null }
}