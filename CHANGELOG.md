# CHANGELOG.md

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

---

## [0.3.0] – 2026-10-24 · Plattform-Grundstruktur

### Hinzugefügt

**Designsystem**
- `src/styles/tokens.css` – Design Tokens (Farben, Typografie, Abstände, Radien)
- `src/styles/global.css` – Globale Styles, Komponenten-Klassen (orientiert an Modul 2)

**Supabase / Datenbank**
- `supabase/DATA_MODEL.md` – Vollständiges Datenbankschema (9 Tabellen, RLS, Skalierbarkeit)
- `supabase/setup.sql` – Einmaliges Setup-Script für Supabase SQL-Editor

**Bibliotheken**
- `src/lib/supabase.js` – Supabase-Client
- `src/lib/auth.js` – Authentifizierung (Schüler: Klassencode+Name, Lehrkraft: E-Mail+Passwort)
- `src/lib/progress.js` – Fortschrittsverwaltung (Supabase + localStorage-Fallback)

**UI-Komponenten**
- `src/components/layout/PlatformHeader.jsx` – Sticky Plattformkopf
- `src/components/layout/ModuleNav.jsx` – Modul-Navigation (Zurück/Weiter/Übersicht)
- `src/components/ui/InfoBox.jsx` – TaskBox, InfoBox, WarningBox, MemoryBox
- `src/components/ui/Merksatz.jsx` – Merksatz-Komponente
- `src/components/ui/Badge.jsx` – Badge (gesperrt/freigeschaltet)
- `src/components/quiz/Quiz.jsx` – Single-Choice-Quiz mit Wiederholungsversuch
- `src/components/quiz/TextTask.jsx` – Freitext-Aufgabe (Fortschritt ≠ Leistung)

**Seiten**
- `src/app/pages/JoinPage.jsx` – Schüler-Anmeldung (Klassencode + Anzeigename)
- `src/app/pages/Dashboard.jsx` – Modulübersicht mit Fortschritt und Zertifikatsstatus
- `src/app/pages/Modul02Page.jsx` – Modul 2 vollständig migriert (10 Abschnitte, 100 Punkte)
- `src/app/pages/TeacherLogin.jsx` – Lehrkraft-Anmeldung
- `src/app/pages/TeacherDashboard.jsx` – Klassenübersicht, Fortschrittstabelle, CSV-Export
- `src/app/pages/NotFound.jsx` – 404-Seite

**App-Infrastruktur**
- `src/app/App.jsx` – React Router mit Schüler- und Lehrkraft-Routen
- `src/app/main.jsx` – React-Einstiegspunkt
- `src/index.html` – HTML-Shell
- `src/package.json` – Abhängigkeiten (React 18, Vite 5, Supabase JS, React Router)
- `src/vite.config.js` – Vite-Konfiguration
- `src/.env.example` – Vorlage für Umgebungsvariablen

**Projektdateien**
- `.gitignore` – node_modules, .env.local, dist
- `SETUP.md` – Schritt-für-Schritt-Einrichtungsanleitung

---

## [0.2.0] – 2026-10-24 · Legacy-Sicherung und Analyse

### Hinzugefügt

- `legacy/ki_Fortbildung_klasse7_Borrmann.html` (518 KB) – Modul 01 gesichert
- `legacy/Modul2.html` (20 KB) – Modul 02 gesichert
- `legacy/KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html` (76 KB) – Modul 05 gesichert
- `legacy/KI_Fuehrerschein_Zertifikat.html` (5 KB) – Zertifikat gesichert
- `FILE_MANIFEST.json` – SHA-256-Prüfsummen für alle 4 HTML-Dateien eingetragen
- `docs/legacy-analysis/modul-01-analyse.md` – Vollständige Analyse Modul 01
- `docs/legacy-analysis/modul-02-analyse.md` – Vollständige Analyse Modul 02
- `docs/legacy-analysis/modul-05-analyse.md` – Vollständige Analyse Modul 05
- `docs/legacy-analysis/zertifikat-analyse.md` – Vollständige Analyse Zertifikat

---

## [0.1.0] – 2026-10-24 · BASELINE / LEGACY SNAPSHOT

### Hinzugefügt

- `legacy/KI_Fuehrerschein_Uebergabedokument.docx` – Übergabedokument gesichert
- `FILE_MANIFEST.json` – Initiales Manifest mit SHA-256
- `README.md`, `AGENT_INSTRUCTIONS.md`, `PROJECT_BRIEF.md`
- `ACCEPTANCE_CRITERIA.md`, `CHANGELOG.md`
- `docs/ARCHITECTURE.md`, `docs/CURRICULUM.md`
- `docs/MODULE_MAPPING.md`, `docs/MIGRATION_PLAN.md`
- `supabase/DATA_MODEL.md` (Platzhalter)
- Verzeichnisstruktur, Git-Repository initialisiert

---

## Geplante Versionen

| Version | Inhalt |
|---|---|
| 0.4.0 | Modul 01 migriert |
| 0.5.0 | Modul 05 migriert |
| 0.6.0 | Zertifikat implementiert |
| 1.0.0 | Alle Pflichtmodule, Zertifikat, Lehreransicht – produktionsreif |