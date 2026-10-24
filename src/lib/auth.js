// ============================================================
// KI-Führerschein · Authentifizierung
// Schüler:innen: Klassencode + Anzeigename (kein echtes Konto)
// Lehrkräfte:    E-Mail + Passwort (Supabase Auth)
// ============================================================

import { supabase } from './supabase.js'

const TOKEN_KEY   = 'ki_student_token'
const STUDENT_KEY = 'ki_student_data'

// ── Schüler:innen ────────────────────────────────────────────

/**
 * Schüler:in mit Klassencode + Anzeigename anmelden.
 * Legt neuen Datensatz an oder stellt bestehende Session wieder her.
 */
export async function studentJoin(joinCode, displayName) {
  // 1. Klasse anhand des Codes suchen
  const { data: cls, error: clsErr } = await supabase
    .from('classes')
    .select('id, name, grade')
    .eq('join_code', joinCode.toUpperCase().trim())
    .single()

  if (clsErr || !cls) {
    return { error: 'Ungültiger Klassencode. Bitte prüfe die Eingabe.' }
  }

  // 2. Bestehenden Token aus localStorage prüfen
  const existingToken = localStorage.getItem(TOKEN_KEY)
  if (existingToken) {
    const { data: existing } = await supabase
      .from('students')
      .select('*')
      .eq('session_token', existingToken)
      .eq('class_id', cls.id)
      .single()

    if (existing) {
      localStorage.setItem(STUDENT_KEY, JSON.stringify(existing))
      return { student: existing, class: cls }
    }
  }

  // 3. Neuen Schüler-Datensatz anlegen
  const sessionToken = crypto.randomUUID()
  const { data: student, error: stuErr } = await supabase
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

  return { student, class: cls }
}

/**
 * Bestehende Schüler-Session aus localStorage wiederherstellen.
 */
export async function studentRestore() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  const { data: student } = await supabase
    .from('students')
    .select('*, classes(id, name, grade)')
    .eq('session_token', token)
    .single()

  if (!student) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(STUDENT_KEY)
    return null
  }

  localStorage.setItem(STUDENT_KEY, JSON.stringify(student))
  return student
}

/**
 * Schüler:in abmelden (Token löschen).
 */
export function studentLogout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(STUDENT_KEY)
}

/**
 * Aktuellen Schüler aus localStorage lesen (ohne Netzwerk).
 */
export function getStudentLocal() {
  const raw = localStorage.getItem(STUDENT_KEY)
  return raw ? JSON.parse(raw) : null
}

// ── Lehrkräfte ───────────────────────────────────────────────

/**
 * Lehrkraft mit E-Mail + Passwort anmelden.
 */
export async function teacherLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { session: data.session, user: data.user }
}

/**
 * Lehrkraft abmelden.
 */
export async function teacherLogout() {
  await supabase.auth.signOut()
}

/**
 * Aktuelle Lehrkraft-Session abrufen.
 */
export async function getTeacherSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Profil der Lehrkraft aus der users-Tabelle laden.
 */
export async function getTeacherProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*, schools(name)')
    .eq('id', user.id)
    .single()

  return profile
}