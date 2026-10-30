// KI-Fuehrerschein - Authentifizierung
// Schueler:innen: Klassencode + Anzeigename
// Lehrkraefte: E-Mail + Passwort (Supabase Auth)

import { supabase } from './supabase.js'

const TOKEN_KEY   = 'ki_student_token'
const STUDENT_KEY = 'ki_student_data'

// Alle KI-Fuehrerschein-Daten aus localStorage loeschen
// Wird beim Abmelden UND beim Anmelden eines neuen Schuelers aufgerufen
export function clearLocalData() {
  var keysToDelete = []
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i)
    if (key && key.startsWith('ki_')) keysToDelete.push(key)
  }
  keysToDelete.forEach(function(k) { localStorage.removeItem(k) })
}

// Schueler:in anmelden (Klassencode + Anzeigename)
export async function studentJoin(joinCode, displayName) {
  // 1. Klasse suchen
  var { data: cls, error: clsErr } = await supabase
    .from('classes')
    .select('id, name, grade')
    .eq('join_code', joinCode.toUpperCase().trim())
    .single()

  if (clsErr || !cls) {
    return { error: 'Ungültiger Klassencode. Bitte prüfe die Eingabe.' }
  }

  // 2. Bestehenden Token prüfen
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
      return { student: existing, class: cls }
    } else {
      // Anderer Schueler oder andere Klasse -> alle lokalen Daten loeschen
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

  return { student: student, class: cls }
}

// Bestehende Schueler-Session wiederherstellen
export async function studentRestore() {
  var token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  var { data: student } = await supabase
    .from('students')
    .select('*, classes(id, name, grade)')
    .eq('session_token', token)
    .single()

  if (!student) {
    clearLocalData()
    return null
  }

  localStorage.setItem(STUDENT_KEY, JSON.stringify(student))
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
  var { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  var { data: profile } = await supabase
    .from('users')
    .select('*, schools(name)')
    .eq('id', user.id)
    .single()

  return profile
}