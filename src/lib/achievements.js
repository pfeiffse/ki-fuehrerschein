// achievements.js - Module, Achievements, Gamification

export const MODULES = [
  {
    id: 'modul-01', title: 'Was ist KI?',
    subtitle: 'Trainingsdaten · Mustererkennung · Sprach-KI',
    icon: '🤖', color: '#2859d8', colorLight: '#e6f4ff',
    path: '/modul/01', optional: false,
    xp: 400,
    achievement: { id: 'ki-verstehen', title: 'KI-Versteher:in', icon: '🔍',
      description: 'Du weißt, wie KI aus Daten lernt.' },
  },
  {
    id: 'modul-02', title: 'Mission KI-Check',
    subtitle: 'Fehler erkennen · Prompts · Verantwortung',
    icon: '🕵️', color: '#087f83', colorLight: '#dff5f1',
    path: '/modul/02', optional: false,
    xp: 500,
    achievement: { id: 'ki-checker', title: 'KI-Checker:in', icon: '✅',
      description: 'Du kannst KI-Antworten kritisch prüfen.' },
  },
  {
    id: 'modul-03', title: 'Kennzeichnung & Datenschutz',
    subtitle: 'Wann kennzeichnen · Daten schützen',
    icon: '🛡️', color: '#1a6b7a', colorLight: '#e0f4f6',
    path: '/modul/03', optional: false,
    xp: 300,
    achievement: { id: 'ki-verantwortlich', title: 'KI-Verantwortliche:r', icon: '🏷️',
      description: 'Du kennst die Regeln zur Kennzeichnung.' },
  },
  {
    id: 'modul-04', title: 'KI & Nachhaltigkeit',
    subtitle: 'Ressourcen · Energie · Bewusster Einsatz',
    icon: '🌍', color: '#087f83', colorLight: '#dff5f1',
    path: '/modul/04', optional: false,
    xp: 400,
    achievement: { id: 'ki-nachhaltig', title: 'KI-Nachhaltigkeits-Profi', icon: '🌱',
      description: 'Du kennst die Ressourcen hinter KI.' },
  },
]

export const REQUIRED_MODULE_IDS = MODULES.filter(m => !m.optional).map(m => m.id)

export function getModule(id) { return MODULES.find(m => m.id === id) }

// XP-System
const XP_KEY  = 'ki_xp'
const ACH_KEY = 'ki_achievements'

export function getXP() {
  try { return parseInt(localStorage.getItem(XP_KEY) || '0') } catch { return 0 }
}

export function addXP(amount) {
  const current = getXP()
  try { localStorage.setItem(XP_KEY, String(current + amount)) } catch {}
  return current + amount
}

export function getLevel(xp) {
  if (xp >= 1600) return { level: 4, title: 'KI-Experte',    icon: '🏆', next: null }
  if (xp >= 900)  return { level: 3, title: 'KI-Profi',      icon: '⭐', next: 1600 }
  if (xp >= 400)  return { level: 2, title: 'KI-Lernende:r', icon: '🌿', next: 900  }
  return                  { level: 1, title: 'KI-Einsteiger:in', icon: '🌱', next: 400 }
}

// Achievements
export function getAchievementsLocal() {
  try { return JSON.parse(localStorage.getItem(ACH_KEY) || '{}') } catch { return {} }
}

export function saveAchievementLocal(moduleId) {
  const existing = getAchievementsLocal()
  if (!existing[moduleId]) {
    existing[moduleId] = { moduleId, earnedAt: new Date().toISOString() }
    try { localStorage.setItem(ACH_KEY, JSON.stringify(existing)) } catch {}
    // XP vergeben
    const mod = getModule(moduleId)
    if (mod) addXP(mod.xp)
    return true // neu erworben
  }
  return false
}

export function hasAchievement(moduleId) { return !!getAchievementsLocal()[moduleId] }

export function allRequiredPassed() {
  const ach = getAchievementsLocal()
  return REQUIRED_MODULE_IDS.every(id => !!ach[id])
}

// Merksatz & Zertifikatsname
export const saveMerksatz   = t => { try { localStorage.setItem('ki_merksatz', t) } catch {} }
export const getMerksatz    = ()  => localStorage.getItem('ki_merksatz') || ''
export const getStudentName = ()  => {
  try { return JSON.parse(localStorage.getItem('ki_student') || '{}').display_name || '' } catch { return '' }
}