// achievements.js - Module, Achievements, Gamification

export const MODULES = [
  {
    id: 'modul-01', title: 'Was ist KI?',
    subtitle: 'Trainingsdaten · Mustererkennung · Sprach-KI',
    icon: '🤖', color: '#2859d8', colorLight: '#e6f4ff',
    path: '/modul/01', optional: false,
    xp: 250,
    achievement: { id: 'ki-verstehen', title: 'KI-Versteher:in', icon: '🔍',
      description: 'Du weißt, wie KI aus Daten lernt.' },
  },
  {
    id: 'modul-02', title: 'Mission KI-Check',
    subtitle: 'Fehler erkennen · Prompts · Verantwortung',
    icon: '🕵️', color: '#087f83', colorLight: '#dff5f1',
    path: '/modul/02', optional: false,
    xp: 250,
    achievement: { id: 'ki-checker', title: 'KI-Checker:in', icon: '✅',
      description: 'Du kannst KI-Antworten kritisch prüfen.' },
  },
  {
    id: 'modul-03', title: 'Kennzeichnung & Datenschutz',
    subtitle: 'Wann kennzeichnen · Daten schützen',
    icon: '🛡️', color: '#1a6b7a', colorLight: '#e0f4f6',
    path: '/modul/03', optional: false,
    xp: 250,
    achievement: { id: 'ki-verantwortlich', title: 'KI-Verantwortliche:r', icon: '🏷️',
      description: 'Du kennst die Regeln zur Kennzeichnung.' },
  },
  {
    id: 'modul-04', title: 'KI & Nachhaltigkeit',
    subtitle: 'Ressourcen · Energie · Bewusster Einsatz',
    icon: '🌍', color: '#087f83', colorLight: '#dff5f1',
    path: '/modul/04', optional: false,
    xp: 250,
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

// Bonus-XP für Zwischenerfolge (verhindert Doppelvergabe per bonusId)
const BONUS_KEY = 'ki_bonus_xp'
export function addBonusXP(amount, bonusId) {
  try {
    const existing = JSON.parse(localStorage.getItem(BONUS_KEY) || '{}')
    if (existing[bonusId]) return false
    existing[bonusId] = true
    localStorage.setItem(BONUS_KEY, JSON.stringify(existing))
    addXP(amount)
    return true
  } catch { return false }
}

export function getLevel(xp) {
  // Klasse 7: 4 Module × 250 XP = 1000 XP → Level 2
  // Klasse 8+: weitere Module schalten Level 3-5 frei
  if (xp >= 7000) return { level: 5, title: 'KI-Expert:in',      icon: '🏆', next: null, class: 10, desc: 'Klasse 10 abgeschlossen' }
  if (xp >= 4500) return { level: 4, title: 'KI-Gestalter:in',   icon: '💡', next: 7000, class: 9,  desc: 'Klasse 9 abgeschlossen' }
  if (xp >= 2500) return { level: 3, title: 'KI-Anwender:in',    icon: '⭐', next: 4500, class: 8,  desc: 'Klasse 8 abgeschlossen' }
  if (xp >= 1000) return { level: 2, title: 'KI-Grundlagen ✓',   icon: '🎓', next: 2500, class: 7,  desc: 'Klasse 7 abgeschlossen' }
  return                  { level: 1, title: 'KI-Einsteiger:in',  icon: '🌱', next: 1000, class: 7,  desc: 'Klasse 7 in Bearbeitung' }
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