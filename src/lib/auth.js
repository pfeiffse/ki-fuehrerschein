// KI-Fuehrerschein - Authentifizierung
// Offline-First: Session aus localStorage wenn Supabase nicht erreichbar

import { supabase } from './supabase.js'

const TOKEN_KEY   = 'ki_student_token'
const STUDENT_KEY = 'ki_student_data'
const CLASS_KEY   = 'ki_student_class'

// Alle KI-Fuehrerschein-Daten aus localStorage loeschen
export function clearLocalData() {
  var keysToDelete = []
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i)
    if (key && key.startsWith('ki_')) keysToDelete.push(key)
  }
  keysToDelete.forEach(function(k) { localStorage.removeItem(k) })
}

// Supabase erreichbar?
async function isOnline() {
  if (!navigator.onLine) return false
  try {
    var { error } = await supabase.from('modules').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

// Schueler:in anmelden (Klassencode + Anzeigename)
export async function studentJoin(joinCode, displayName) {
  var online = await isOnline()

  // OFFLINE: Bestehende Session aus localStorage pruefen
  if (!online) {
    var cachedToken   = localStorage.getItem(TOKEN_KEY)
    var cachedStudent = getStudentLocal()
    var cachedClass   = getCachedClass()

    if (cachedStudent && cachedToken) {
      // Pruefen ob Klassencode passt (lokal gecacht)
      if (cachedClass && cachedClass.join_code === joinCode.toUpperCase().trim()) {
        return { student: cachedStudent, class: cachedClass, offline: true }
      }
      // Anderer Code -> kein Offline-Login moeglich
      return { error: 'Offline: Bitte zuerst mit Internetverbindung anmelden.' }
    }
    return { error: 'Keine Internetverbindung. Bitte zuerst online anmelden.' }
  }

  // ONLINE: Normale Anmeldung
  // 1. Klasse suchen
  var { data: cls, error: clsErr } = await supabase
    .from('classes')
    .select('id, name, grade, join_code')
    .eq('join_code', joinCode.toUpperCase().trim())
    .single()

  if (clsErr || !cls) {
    return { error: 'Ungültiger Klassencode. Bitte prüfe die Eingabe.' }
  }

  // 2. Bestehenden Token pruefen
  var existingToken = localStorage.getItem(TOKEN_KEY)
  if (existingToken) {
    var { data: existing } = await supabase
      .from('students')
      .select('*')
      .eq('session_token', existingToken)
      .eq('class_id', cls.id)
      .single()

    if (existing) {
      // Gleicher Schueler, gleiche Klasse -> Session wiederherstellen
      localStorage.setItem(STUDENT_KEY, JSON.stringify(existing))
      localStorage.setItem(CLASS_KEY,   JSON.stringify(cls))
      return { student: existing, class: cls }
    } else {
      // Anderer Schueler -> alle lokalen Daten loeschen
      clearLocalData()
    }
  }

  // 3. Neuen Schueler-Datensatz anlegen
  var sessionToken = crypto.randomUUID()
  var { data: student, error: stuErr } = await supabase
    .from('students')
    .insert({
      class_id:      cls.id,
      display_name:  displayName.trim(),
      session_token: sessionToken,
    })
    .select()
    .single()

  if (stuErr) {
    return { error: 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.' }
  }

  localStorage.setItem(TOKEN_KEY,   sessionToken)
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student))
  localStorage.setItem(CLASS_KEY,   JSON.stringify(cls))

  return { student: student, class: cls }
}

// Bestehende Session wiederherstellen (Offline-First)
export async function studentRestore() {
  var token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  var online = await isOnline()

  // OFFLINE: Lokalen Cache verwenden
  if (!online) {
    var cached = getStudentLocal()
    if (cached) return cached
    return null
  }

  // ONLINE: Supabase pruefen
  var { data: student } = await supabase
    .from('students')
    .select('*, classes(id, name, grade, join_code)')
    .eq('session_token', token)
    .single()

  if (!student) {
    clearLocalData()
    return null
  }

  localStorage.setItem(STUDENT_KEY, JSON.stringify(student))
  if (student.classes) {
    localStorage.setItem(CLASS_KEY, JSON.stringify(student.classes))
  }
  return student
}

// Schueler:in abmelden
export function studentLogout() {
  clearLocalData()
}

// Aktuellen Schueler aus localStorage lesen
export function getStudentLocal() {
  try {
    var raw = localStorage.getItem(STUDENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Gecachte Klasse lesen
export function getCachedClass() {
  try {
    var raw = localStorage.getItem(CLASS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Lehrkraft anmelden
export async function teacherLogin(email, password) {
  var { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })
  if (error) return { error: error.message }
  return { session: data.session, user: data.user }
}

// Lehrkraft abmelden
export async function teacherLogout() {
  await supabase.auth.signOut()
}

// Aktuelle Lehrkraft-Session abrufen
export async function getTeacherSession() {
  var { data } = await supabase.auth.getSession()
  return data.session
}

// Profil der Lehrkraft laden
export async function getTeacherProfile() {
  var { data: authData } = await supabase.auth.getUser()
  if (!authData || !authData.user) return null

  var { data: profile } = await supabase
    .from('users')
    .select('*, schools(name)')
    .eq('id', authData.user.id)
    .single()

  return profile
}