// ============================================================
// KI-Führerschein · Vorleistungs-Code-System
// Ermöglicht das Übertragen von Achievements zwischen Jahrgängen
// Codes werden auf Urkunden gedruckt und beim nächsten Login eingegeben
// ============================================================

// ── Code-Format ───────────────────────────────────────────────
//
// Format: KI-[STUFE]-[ACHIEVEMENTS]-[CHECKSUM]
// Beispiel: KI-7-ABCD-X4
//
// STUFE:       Jahrgang (7, 8, 9, 10, 11, 12, 13)
// ACHIEVEMENTS: 4 Buchstaben für die 4 Pflichtmodule
//   A = modul-01 bestanden
//   B = modul-02 bestanden
//   C = modul-03 bestanden
//   D = modul-04 bestanden
//   E = modul-05 bestanden (optional)
// CHECKSUM:    2-stellige Prüfsumme (verhindert Tippfehler)
//
// Datenschutz: Kein Name, keine personenbezogenen Daten im Code
// ──────────────────────────────────────────────────────────────

const MODULE_CODES = {
  'modul-01': 'A',
  'modul-02': 'B',
  'modul-03': 'C',
  'modul-04': 'D',
  'modul-05': 'E',
}

const CODE_MODULES = Object.fromEntries(
  Object.entries(MODULE_CODES).map(([k, v]) => [v, k])
)

/**
 * Einfache Prüfsumme (XOR-basiert, 2 Zeichen)
 */
function checksum(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  const hex = Math.abs(h).toString(16).toUpperCase().padStart(4, '0')
  return hex.slice(0, 2)
}

/**
 * Code aus Achievements generieren.
 * @param {number} grade - Jahrgang (7-13)
 * @param {string[]} moduleIds - Array der bestandenen Modul-IDs
 * @returns {string} Code, z.B. "KI-7-ABCD-X4"
 */
export function generateCode(grade, moduleIds) {
  const letters = moduleIds
    .filter(id => MODULE_CODES[id])
    .map(id => MODULE_CODES[id])
    .sort()
    .join('')

  const base = `${grade}-${letters}`
  const cs   = checksum(base)
  return `KI-${base}-${cs}`
}

/**
 * Code parsen und validieren.
 * @param {string} code - Eingegebener Code
 * @returns {{ valid: boolean, grade?: number, moduleIds?: string[], error?: string }}
 */
export function parseCode(code) {
  const cleaned = code.trim().toUpperCase().replace(/\s/g, '')

  // Format prüfen: KI-[GRADE]-[LETTERS]-[CS]
  const match = cleaned.match(/^KI-(\d+)-([A-E]*)-([0-9A-F]{2})$/)
  if (!match) {
    return { valid: false, error: 'Ungültiges Code-Format. Erwartet: KI-7-ABCD-XX' }
  }

  const [, gradeStr, letters, cs] = match
  const grade = parseInt(gradeStr)

  if (grade < 7 || grade > 13) {
    return { valid: false, error: 'Ungültiger Jahrgang im Code.' }
  }

  // Prüfsumme verifizieren
  const base     = `${grade}-${letters}`
  const expected = checksum(base)
  if (cs !== expected) {
    return { valid: false, error: 'Code-Prüfsumme ungültig. Bitte Code genau von der Urkunde abtippen.' }
  }

  // Module dekodieren
  const moduleIds = letters.split('').map(l => CODE_MODULES[l]).filter(Boolean)

  return { valid: true, grade, moduleIds, letters }
}

/**
 * Achievements aus Code in localStorage übernehmen.
 * @param {string} code
 * @returns {{ success: boolean, moduleIds?: string[], error?: string }}
 */
export function applyCode(code) {
  const result = parseCode(code)
  if (!result.valid) return { success: false, error: result.error }

  // Achievements lokal speichern
  const existing = JSON.parse(localStorage.getItem('ki_achievements') ?? '{}')
  result.moduleIds.forEach(moduleId => {
    if (!existing[moduleId]) {
      existing[moduleId] = {
        moduleId,
        earnedAt:  new Date().toISOString(),
        fromCode:  code,
        fromGrade: result.grade,
      }
    }
  })
  localStorage.setItem('ki_achievements', JSON.stringify(existing))

  // Code als verwendet markieren
  const usedCodes = JSON.parse(localStorage.getItem('ki_used_codes') ?? '[]')
  if (!usedCodes.includes(code)) {
    usedCodes.push(code)
    localStorage.setItem('ki_used_codes', JSON.stringify(usedCodes))
  }

  return { success: true, moduleIds: result.moduleIds, grade: result.grade }
}

/**
 * Alle verwendeten Codes laden.
 */
export function getUsedCodes() {
  return JSON.parse(localStorage.getItem('ki_used_codes') ?? '[]')
}

/**
 * Beispiel-Codes für Tests generieren.
 */
export function generateExampleCodes() {
  return {
    klasse7_alle:    generateCode(7, ['modul-01','modul-02','modul-03','modul-04']),
    klasse7_modul1:  generateCode(7, ['modul-01']),
    klasse7_modul12: generateCode(7, ['modul-01','modul-02']),
    klasse8_alle:    generateCode(8, ['modul-01','modul-02','modul-03','modul-04']),
  }
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
    description: 'Du lernst, wie KI funktioniert, wie du sie sinnvoll einsetzt und welche Regeln dabei gelten.',
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