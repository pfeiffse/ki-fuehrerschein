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
    available:   true,
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
    title:       'Kennzeichnung & Datenschutz',
    subtitle:    'Wann KI-Inhalte gekennzeichnet werden müssen und welche Daten geschützt sind',
    icon:        '🏷️',
    color:       '#1a6b7a',
    colorLight:  '#e0f4f6',
    path:        '/modul/03',
    optional:    false,
    available:   true,
    achievement: {
      id:          'ki-verantwortlich',
      title:       'KI-Verantwortliche:r',
      description: 'Du kennst die Regeln zur Kennzeichnung und zum Datenschutz bei KI.',
      icon:        '🛡️',
    },
  },
  {
    id:          'modul-04',
    title:       'KI & Nachhaltigkeit',
    subtitle:    'Ressourcen, Energiebedarf und bewusster Umgang mit KI',
    icon:        '🌍',
    color:       '#087f83',
    colorLight:  '#dff5f1',
    path:        '/modul/04',
    optional:    false,
    available:   true,
    achievement: {
      id:          'ki-nachhaltig',
      title:       'KI-Nachhaltigkeits-Profi',
      description: 'Du kennst die Ressourcen hinter KI und kannst bewusst entscheiden.',
      icon:        '🌱',
    },
  },
]

// Pflichtmodule für Zertifikat (alle 4)
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

export function getAchievementsLocal() {
  try {
    return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function hasAchievement(moduleId) {
  return !!getAchievementsLocal()[moduleId]
}

export function allRequiredPassed() {
  const achievements = getAchievementsLocal()
  return REQUIRED_MODULE_IDS.every(id => !!achievements[id])
}

// ── Merksatz ──────────────────────────────────────────────────

export function saveMerksatz(text) {
  localStorage.setItem(MERKSATZ_KEY, text)
}

export function getMerksatz() {
  return localStorage.getItem(MERKSATZ_KEY) ?? ''
}

// ── Schülername ───────────────────────────────────────────────

export function getStudentName() {
  try {
    const data = JSON.parse(localStorage.getItem(STUDENT_NAME_KEY) ?? '{}')
    return data.display_name ?? ''
  } catch {
    return ''
  }
}