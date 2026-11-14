// devSkip.js - Modul-Überspringen für Entwickler/Lehrkräfte
import { supabase } from './supabase.js'

const SKIP_CODE   = 'SLZB2026'   // Modul-Skip
const MASTER_CODE = 'SLZB-MASTER-2026'  // Alle Module auf einmal

export function checkSkipCode(input) {
  return input.trim().toUpperCase() === SKIP_CODE.toUpperCase()
}

export function checkMasterCode(input) {
  return input.trim().toUpperCase() === MASTER_CODE.toUpperCase()
}

// Skip-Nutzung in Supabase loggen
export async function logSkip(moduleId, studentName, code) {
  try {
    await supabase.from('skip_log').insert({
      module_id:    moduleId,
      student_name: studentName || 'unbekannt',
      code_used:    code.length > 3 ? code.slice(0,3) + '***' : '***',
      used_at:      new Date().toISOString(),
    })
  } catch(e) { console.warn('[skip] Log fehlgeschlagen:', e) }
}
