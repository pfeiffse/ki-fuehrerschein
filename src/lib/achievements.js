// ============================================================
// KI-Führerschein · Achievement-System
// Zentrale Definition aller Module, Achievements und Zertifikat
// ============================================================

// ── Modul-Definitionen ────────────────────────────────────────

export const MODULES = [
  {
    id:          'modul-01',
    title:       'Was ist KI?',
    subtitle:    'Trainingsdaten, Mustererkennung, Sprach-KI',
    icon:        '🤖',
    color:       '#2859d8',
    colorLight:  '#e6f4ff',
    path:        '/modul/01',
    optional:    false,
    available:   true,   // Platzhalter vorhanden
    achievement: {
      id:          'ki-verstehen',
      title:       'KI-Versteher:in',
      description: 'Du weißt, wie KI aus Daten lernt und Muster erkennt.',
      icon:        '🔍',
    },
  },
  {
    id:          'modul-02',
    title:       'KI sinnvoll nutzen',
    subtitle:    'Fehler erkennen, Prompts formulieren, Verantwortung',
    icon:        '🧠',
    color:       '#087f83',
    colorLight:  '#dff5f1',
    path:        '/modul/02',
    optional:    false,
    available:   true,
    achievement: {
      id:          'ki-nutzerin',
      title:       'KI-Nutzer:in',
      description: 'Du kannst KI sinnvoll einsetzen und Ergebnisse kritisch prüfen.',
      icon:        '✅',
    },
  },
  {
    id:          'modul-03',
    title:       'Kennzeichnungspflicht',
    subtitle:    'Wann und wie KI-Inhalte gekennzeichnet werden',
    icon:        '🏷️',
    color:       '#1a6b7a',
    colorLight:  '#e0f4f6',
    path:        '/modul/03',
    optional:    false,
    available:   true,   // Platzhalter vorhanden
    achievement: {
      id:          'ki-kennzeichnerin',
      title:       'KI-Kennzeichner:in',
      description: 'Du kennst die Regeln zur Kennzeichnung von KI-generierten Inhalten.',
      icon:        '🏷️',
    },
  },
  {
    id:          'modul-04',
    title:       'Datenschutz',
    subtitle:    'Welche Daten du bei der KI-Nutzung schützen musst',
    icon:        '🔒',
    color:       '#095c6b',
    colorLight:  '#dff4ec',
    path:        '/modul/04',
    optional:    false,
    available:   true,   // Platzhalter vorhanden
    achievement: {
      id:          'ki-datenschuetzerin',
      title:       'KI-Datenschützer:in',
      description: 'Du weißt, welche Daten du bei der KI-Nutzung schützen musst.',
      icon:        '🔒',
    },
  },
  {
    id:          'modul-05',
    title:       'KI & Nachhaltigkeit',
    subtitle:    'Ressourcen, Energiebedarf, bewusster Umgang',
    icon:        '🌍',
    color:       '#087f83',
    colorLight:  '#dff5f1',
    path:        '/modul/05',
    optional:    true,
    available:   false,
    achievement: {
      id:          'ki-nachhaltig',
      title:       'KI-Nachhaltigkeits-Profi',
      description: 'Du kennst die Ressourcen hinter KI und kannst bewusst entscheiden.',
      icon:        '🌍',
    },
  },
]

// Pflichtmodule für Zertifikat
export const REQUIRED_MODULE_IDS = MODULES
  .filter(m => !m.optional)
  .map(m => m.id)

// Modul per ID finden
export function getModule(id) {
  return MODULES.find(m => m.id === id)
}

// ── localStorage-Schlüssel ────────────────────────────────────

const ACHIEVEMENTS_KEY = 'ki_achievements'
const MERKSATZ_KEY     = 'ki_merksatz'
const STUDENT_NAME_KEY = 'ki_student_data'

// ── Achievement lokal speichern ───────────────────────────────

/**
 * Achievement für ein Modul als erworben markieren.
 * Wird lokal gespeichert – keine externen Dienste.
 */
export function saveAchievementLocal(moduleId) {
  const existing = getAchievementsLocal()
  if (!existing[moduleId]) {
    existing[moduleId] = {
      moduleId,
      earnedAt: new Date().toISOString(),
    }
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(existing))
  }
}

/**
 * Alle lokal gespeicherten Achievements laden.
 */
export function getAchievementsLocal() {
  try {
    return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

/**
 * Prüfen ob ein Achievement erworben wurde.
 */
export function hasAchievement(moduleId) {
  return !!getAchievementsLocal()[moduleId]
}

/**
 * Prüfen ob alle Pflichtmodule bestanden sind.
 */
export function allRequiredPassed() {
  const achievements = getAchievementsLocal()
  return REQUIRED_MODULE_IDS.every(id => !!achievements[id])
}

// ── Merksatz ──────────────────────────────────────────────────

/**
 * Persönlichen Merksatz speichern.
 * Wird nur lokal gespeichert – nicht an externe Dienste übertragen.
 */
export function saveMerksatz(text) {
  localStorage.setItem(MERKSATZ_KEY, text)
}

/**
 * Persönlichen Merksatz laden.
 */
export function getMerksatz() {
  return localStorage.getItem(MERKSATZ_KEY) ?? ''
}

// ── Schülername ───────────────────────────────────────────────

/**
 * Anzeigenamen des Schülers / der Schülerin aus localStorage laden.
 * Wird nur lokal verwendet – nicht an externe Dienste übertragen.
 */
export function getStudentName() {
  try {
    const data = JSON.parse(localStorage.getItem(STUDENT_NAME_KEY) ?? '{}')
    return data.display_name ?? ''
  } catch {
    return ''
  }
}