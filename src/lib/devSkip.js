// devSkip.js - Modul-Überspringen für Entwickler/Lehrkräfte
// Nur mit korrektem Code aktivierbar

const SKIP_CODE = 'SLZB2026'  // Ändern nach Bedarf

export function checkSkipCode(input) {
  return input.trim().toUpperCase() === SKIP_CODE
}
