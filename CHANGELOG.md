# CHANGELOG.md

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.  
Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

---

## [0.1.0] – 2026-10-24 · BASELINE / LEGACY SNAPSHOT

### Hinzugefügt

- `legacy/KI_Fuehrerschein_Uebergabedokument.docx` – Übergabedokument als erste Legacy-Datei gesichert
- `FILE_MANIFEST.json` – SHA-256-Prüfsumme der vorhandenen Legacy-Datei; Einträge für 5 erwartete, noch nicht hochgeladene HTML-Dateien als `EXPECTED – NOCH NICHT HOCHGELADEN` vorgemerkt
- `README.md` – Projektübersicht, Struktur, Schnellstart
- `AGENT_INSTRUCTIONS.md` – Verbindliche Regeln für KI-Agenten (READ ONLY für /legacy, Prüfsummen-Pflicht, Entwicklungsregeln)
- `PROJECT_BRIEF.md` – Vollständige Projektzusammenfassung mit Kompetenzrahmen, Modulübersicht, Designsystem, Phasenplan
- `ACCEPTANCE_CRITERIA.md` – Verbindliche Abnahmekriterien (Navigation, Fortschritt, Quiz, Zertifikat, Technik, Didaktik, Barrierefreiheit, Legacy-Integrität)
- `CHANGELOG.md` – diese Datei
- `docs/ARCHITECTURE.md` – Systemarchitektur-Dokumentation (Platzhalter für Phase 1)
- `docs/CURRICULUM.md` – Lehrplan und Lernziele aller Module
- `docs/MODULE_MAPPING.md` – Mapping Legacy-Dateien → neue Plattformstruktur
- `docs/MIGRATION_PLAN.md` – Migrationsplan mit Phasen und Abhängigkeiten
- `supabase/DATA_MODEL.md` – Logisches Datenmodell (Platzhalter)
- Verzeichnisstruktur angelegt: `legacy/`, `docs/`, `src/app/`, `src/modules/`, `src/components/`, `src/styles/`, `src/lib/`, `public/`, `supabase/`
- Git-Repository initialisiert, Baseline-Commit erstellt

### Noch ausstehend (vor Entwicklungsbeginn)

- Hochladen der 5 HTML-Legacy-Dateien in `/legacy`
- SHA-256-Prüfsummen in `FILE_MANIFEST.json` vervollständigen
- Vollständige Analyse der HTML-Dateien (Phase 1)

---

## Geplante Versionen

| Version | Inhalt |
|---|---|
| 0.2.0 | Legacy-HTML-Dateien gesichert, Manifest vollständig, Analyse abgeschlossen |
| 0.3.0 | Architekturentscheidungen dokumentiert |
| 0.4.0 | Designsystem und UI-Komponenten |
| 1.0.0 | Erste vollständige Plattform, alle Pflichtmodule, Zertifikat |