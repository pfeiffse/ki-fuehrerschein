// ============================================================
// KI-Führerschein · Vorleistungs-Code-System
// ============================================================

const MODULE_CODES = {
  'modul-01': 'A',
  'modul-02': 'B',
  'modul-03': 'C',
  'modul-04': 'D',
}

const CODE_MODULES = Object.fromEntries(
  Object.entries(MODULE_CODES).map(([k, v]) => [v, k])
)

function checksum(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(16).toUpperCase().padStart(4, '0').slice(0, 2)
}

export function generateCode(grade, moduleIds) {
  const letters = moduleIds
    .filter(id => MODULE_CODES[id])
    .map(id => MODULE_CODES[id])
    .sort()
    .join('')
  const base = `${grade}-${letters}`
  return `KI-${base}-${checksum(base)}`
}

export function parseCode(code) {
  const cleaned = code.trim().toUpperCase().replace(/\s/g, '')
  const match   = cleaned.match(/^KI-(\d+)-([A-E]*)-([0-9A-F]{2})$/)
  if (!match) return { valid: false, error: 'Ungültiges Code-Format. Erwartet: KI-7-ABCD-XX' }
  const [, gradeStr, letters, cs] = match
  const grade = parseInt(gradeStr)
  if (grade < 7 || grade > 13) return { valid: false, error: 'Ungültiger Jahrgang im Code.' }
  const base = `${grade}-${letters}`
  if (cs !== checksum(base)) return { valid: false, error: 'Code-Prüfsumme ungültig. Bitte Code genau von der Urkunde abtippen.' }
  const moduleIds = letters.split('').map(l => CODE_MODULES[l]).filter(Boolean)
  return { valid: true, grade, moduleIds, letters }
}

export function applyCode(code) {
  const result = parseCode(code)
  if (!result.valid) return { success: false, error: result.error }
  const existing = JSON.parse(localStorage.getItem('ki_achievements') ?? '{}')
  result.moduleIds.forEach(moduleId => {
    if (!existing[moduleId]) {
      existing[moduleId] = { moduleId, earnedAt: new Date().toISOString(), fromCode: code, fromGrade: result.grade }
    }
  })
  localStorage.setItem('ki_achievements', JSON.stringify(existing))
  const usedCodes = JSON.parse(localStorage.getItem('ki_used_codes') ?? '[]')
  if (!usedCodes.includes(code)) {
    usedCodes.push(code)
    localStorage.setItem('ki_used_codes', JSON.stringify(usedCodes))
  }
  return { success: true, moduleIds: result.moduleIds, grade: result.grade }
}

export function getUsedCodes() {
  return JSON.parse(localStorage.getItem('ki_used_codes') ?? '[]')
}

// ── Stufen-Konfiguration ──────────────────────────────────────

export const STUFEN = [
  {
    stufe:      1,
    grade:      7,
    title:      'Grundlagen',
    subtitle:   'KI verstehen und verantwortungsvoll nutzen',
    color:      '#087f83',
    colorLight: '#dff5f1',
    icon:       '🌱',
    modules:    ['modul-01', 'modul-02', 'modul-03', 'modul-04'],
    available:  true,
    description: 'Du lernst, wie KI funktioniert, wie du sie sinnvoll einsetzt, welche Regeln gelten und welche Ressourcen KI verbraucht.',
  },
  {
    stufe:      2,
    grade:      8,
    title:      'Vertiefung',
    subtitle:   'KI kritisch einordnen und gestalten',
    color:      '#2859d8',
    colorLight: '#e6f4ff',
    icon:       '🌿',
    modules:    [],
    available:  false,
    description: 'Du vertiefst dein Wissen über KI-Systeme, ihre gesellschaftlichen Auswirkungen und erste eigene Projekte.',
  },
  {
    stufe:      3,
    grade:      9,
    title:      'Anwendung',
    subtitle:   'KI-Projekte entwickeln und reflektieren',
    color:      '#6d3fc0',
    colorLight: '#f0ebff',
    icon:       '🌳',
    modules:    [],
    available:  false,
    description: 'Du entwickelst eigene KI-Anwendungen und reflektierst deren ethische und gesellschaftliche Dimension.',
  },
  {
    stufe:      4,
    grade:      10,
    title:      'Reflexion',
    subtitle:   'KI und Gesellschaft – Zukunft mitgestalten',
    color:      '#095c6b',
    colorLight: '#dff4ec',
    icon:       '🌲',
    modules:    [],
    available:  false,
    description: 'Du analysierst KI-Systeme auf höchstem Niveau und gestaltest aktiv die digitale Zukunft mit.',
  },
  {
    stufe:      5,
    grade:      11,
    title:      'Oberstufe',
    subtitle:   'KI in Wissenschaft und Beruf',
    color:      '#b8860b',
    colorLight: '#fff8db',
    icon:       '⭐',
    modules:    [],
    available:  false,
    description: 'Vertiefung für die Oberstufe – KI in Wissenschaft, Forschung und Berufswelt.',
  },
]