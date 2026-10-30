// KI-Fuehrerschein - Authentifizierung
// Offline-First: Session aus localStorage wenn Supabase nicht erreichbar

import { supabase } from './supabase.js'

const TOKEN_KEY   = 'ki_student_token'
const STUDENT_KEY = 'ki_student_data'
const CLASS_KEY   = 'ki_student_class'

export function clearLocalData() {
  var keysToDelete = []
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i)
    if (key && key.startsWith('ki_')) keysToDelete.push(key)
  }
  keysToDelete.forEach(function(k) { localStorage.removeItem(k) })
}

export async function studentJoin(joinCode, displayName) {
  // OFFLINE: Nur navigator.onLine pruefen (kein Supabase-Ping)
  if (!navigator.onLine) {
    var cachedToken   = localStorage.getItem(TOKEN_KEY)
    var cachedStudent = getStudentLocal()
    var cachedClass   = getCachedClass()
    if (cachedStudent && cachedToken) {
      if (cachedClass && cachedClass.join_code === joinCode.toUpperCase().trim()) {
        return { student: cachedStudent, class: cachedClass, offline: true }
      }
      return { error: 'Kein Internet: Du kannst dich nur mit dem Klassencode anmelden, mit dem du zuletzt online warst.' }
    }
    return { error: 'Kein Internet. Bitte stelle eine Verbindung her und versuche es erneut.' }
  }

  // ONLINE: Normale Anmeldung
  var clsResult = await supabase
    .from('classes')
    .select('id, name, grade, join_code')
    .eq('join_code', joinCode.toUpperCase().trim())
    .single()

  if (clsResult.error || !clsResult.data) {
    return { error: 'Dieser Klassencode ist nicht bekannt. Bitte prüfe die Eingabe oder frage deine Lehrkraft.' }
  }

  var cls = clsResult.data

  var existingToken = localStorage.getItem(TOKEN_KEY)
  if (existingToken) {
    var existResult = await supabase
      .from('students')
      .select('*')
      .eq('session_token', existingToken)
      .eq('class_id', cls.id)
      .single()

    if (existResult.data) {
      localStorage.setItem(STUDENT_KEY, JSON.stringify(existResult.data))
      localStorage.setItem(CLASS_KEY,   JSON.stringify(cls))
      return { student: existResult.data, class: cls }
    } else {
      clearLocalData()
    }
  }

  var sessionToken = crypto.randomUUID()
  var stuResult = await supabase
    .from('students')
    .insert({
      class_id:      cls.id,
      display_name:  displayName.trim(),
      session_token: sessionToken,
    })
    .select()
    .single()

  if (stuResult.error) {
    return { error: 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.' }
  }

  localStorage.setItem(TOKEN_KEY,   sessionToken)
  localStorage.setItem(STUDENT_KEY, JSON.stringify(stuResult.data))
  localStorage.setItem(CLASS_KEY,   JSON.stringify(cls))

  return { student: stuResult.data, class: cls }
}

export async function studentRestore() {
  var token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  // OFFLINE: Lokalen Cache sofort zurueckgeben (kein Supabase-Ping)
  if (!navigator.onLine) {
    return getStudentLocal()
  }

  // ONLINE: Supabase pruefen (mit Timeout)
  try {
    var result = await Promise.race([
      supabase.from('students').select('*, classes(id, name, grade, join_code)').eq('session_token', token).single(),
      new Promise(function(_, reject) { setTimeout(function() { reject(new Error('timeout')) }, 5000) })
    ])

    if (!result.data) {
      // Token ungueltig -> lokalen Cache trotzdem verwenden
      return getStudentLocal()
    }

    localStorage.setItem(STUDENT_KEY, JSON.stringify(result.data))
    if (result.data.classes) {
      localStorage.setItem(CLASS_KEY, JSON.stringify(result.data.classes))
    }
    return result.data
  } catch {
    // Timeout oder Fehler -> lokalen Cache verwenden
    return getStudentLocal()
  }
}

export function studentLogout() {
  clearLocalData()
}

export function getStudentLocal() {
  try {
    var raw = localStorage.getItem(STUDENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getCachedClass() {
  try {
    var raw = localStorage.getItem(CLASS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function teacherLogin(email, password) {
  var result = await supabase.auth.signInWithPassword({ email: email, password: password })
  if (result.error) return { error: result.error.message }
  return { session: result.data.session, user: result.data.user }
}

export async function teacherLogout() {
  await supabase.auth.signOut()
}

export async function getTeacherSession() {
  try {
    var result = await Promise.race([
      supabase.auth.getSession(),
      new Promise(function(_, reject) { setTimeout(function() { reject(new Error('timeout')) }, 3000) })
    ])
    return result.data.session
  } catch {
    return null
  }
}

export async function getTeacherProfile() {
  try {
    var authResult = await supabase.auth.getUser()
    if (!authResult.data || !authResult.data.user) return null

    var profileResult = await supabase
      .from('users')
      .select('*, schools(name)')
      .eq('id', authResult.data.user.id)
      .single()

    return profileResult.data
  } catch {
    return null
  }
}