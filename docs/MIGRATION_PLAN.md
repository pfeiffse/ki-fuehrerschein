# MIGRATION_PLAN.md

Migrationsplan für die Überführung der Legacy-Einzelanwendungen in die gemeinsame KI-Führerschein-Plattform.

**Version:** 1.0  
**Stand:** 2026-10-24

---

## Grundprinzip

> Die Legacy-Dateien sind **Referenzimplementierungen**, keine Rohmaterialien.  
> Sie werden **nicht** technisch kopiert, sondern inhaltlich, didaktisch und funktional als Referenz genutzt.  
> Die technische Umsetzung erfolgt neu – der didaktische Inhalt bleibt erhalten.

---

## Phasenübersicht

| Phase | Titel | Voraussetzung | Status |
|---|---|---|---|
| 0 | Baseline / Legacy Snapshot | – | ✅ Abgeschlossen |
| 1 | Analyse | Phase 0 abgeschlossen, alle HTML-Dateien in `/legacy` | ⏳ Ausstehend |
| 2 | Architektur | Phase 1 abgeschlossen | ⏳ Ausstehend |
| 3 | Designsystem & Komponenten | Phase 2 abgeschlossen | ⏳ Ausstehend |
| 4 | Modulentwicklung | Phase 3 abgeschlossen | ⏳ Ausstehend |
| 5 | Integration & Plattform-Shell | Phase 4 (Pflichtmodule) abgeschlossen | ⏳ Ausstehend |
| 6 | Abnahme & Qualitätssicherung | Phase 5 abgeschlossen | ⏳ Ausstehend |

---

## Phase 0 · Baseline / Legacy Snapshot ✅

**Ziel:** Unveränderten Ausgangsbestand sichern und Projektstruktur aufbauen.

### Abgeschlossene Aufgaben

- [x] Übergabedokument in `/legacy` gesichert
- [x] SHA-256-Prüfsumme berechnet und in `FILE_MANIFEST.json` eingetragen
- [x] Verzeichnisstruktur angelegt
- [x] `README.md` erstellt
- [x] `AGENT_INSTRUCTIONS.md` erstellt
- [x] `PROJECT_BRIEF.md` erstellt
- [x] `ACCEPTANCE_CRITERIA.md` erstellt
- [x] `CHANGELOG.md` erstellt
- [x] `docs/ARCHITECTURE.md` erstellt (Platzhalter)
- [x] `docs/CURRICULUM.md` erstellt
- [x] `docs/MODULE_MAPPING.md` erstellt
- [x] `docs/MIGRATION_PLAN.md` erstellt (diese Datei)
- [x] `supabase/DATA_MODEL.md` erstellt (Platzhalter)
- [x] Git-Repository initialisiert, Baseline-Commit erstellt

### Noch ausstehend (Voraussetzung für Phase 1)

- [ ] HTML-Legacy-Dateien hochladen und in `/legacy` sichern
- [ ] SHA-256-Prüfsummen für alle HTML-Dateien berechnen
- [ ] `FILE_MANIFEST.json` vervollständigen

---

## Phase 1 · Analyse

**Ziel:** Vollständige Analyse aller Legacy-Dateien. Grundlage für alle weiteren Phasen.

**Voraussetzung:** Alle 5 HTML-Dateien sind in `/legacy` gesichert und im Manifest eingetragen.

### Aufgaben

- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren (vor Analysebeginn)
- [ ] `ki_Fortbildung_klasse7_Borrmann.html` vollständig analysieren
  - Zweck, Zielgruppe, Lernziele dokumentieren
  - Alle Interaktionstypen und Zustandslogik dokumentieren
  - Externe Abhängigkeiten (Bilder, Skripte, Fonts) identifizieren
  - Barrierefreiheits-Ist-Zustand dokumentieren
  - Ergebnis: `docs/legacy-analysis/modul-01-analyse.md`
- [ ] `ki_Fortbildung_klasse7_Borrmann.html_TECHNISCHE_DOKUMENTATION.md` auswerten
  - Ergebnis: in `docs/legacy-analysis/modul-01-analyse.md` integrieren
- [ ] `Modul2.html` vollständig analysieren
  - Zweck, Zielgruppe, Lernziele dokumentieren
  - Alle Interaktionstypen und Zustandslogik dokumentieren
  - Abgrenzung Modul 2 / Kennzeichnungspflicht / Datenschutz klären
  - Externe Abhängigkeiten identifizieren
  - Ergebnis: `docs/legacy-analysis/modul-02-analyse.md`
- [ ] `KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html` vollständig analysieren
  - Alle 5 Stationen dokumentieren
  - Externe Medien und Ausweichmöglichkeiten identifizieren
  - Fakten und Quellen inventarisieren
  - Ergebnis: `docs/legacy-analysis/modul-05-analyse.md`
- [ ] `KI_Fuehrerschein_Zertifikat.html` vollständig analysieren
  - Gestaltung und Logik dokumentieren
  - Druckfunktion analysieren
  - Ergebnis: `docs/legacy-analysis/zertifikat-analyse.md`
- [ ] `docs/MODULE_MAPPING.md` auf Basis der Analyse aktualisieren
- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren (nach Analyse)

### Ergebnis

Vollständige Analysedokumentation in `docs/legacy-analysis/` als Grundlage für Phase 2.

---

## Phase 2 · Architektur

**Ziel:** Technische Architekturentscheidungen treffen und dokumentieren.

**Voraussetzung:** Phase 1 abgeschlossen.

### Aufgaben

- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren
- [ ] Frontend-Framework auswählen und begründen
- [ ] Styling-Ansatz festlegen
- [ ] Fortschrittsspeicherung entscheiden (localStorage / Supabase / IndexedDB)
- [ ] Build-Tool festlegen
- [ ] Deployment-Strategie festlegen
- [ ] Vorlesefunktion technisch klären
- [ ] PDF-Generierung für Zertifikat klären
- [ ] Ausweichmöglichkeiten für externe Medien konzipieren
- [ ] `docs/ARCHITECTURE.md` vollständig ausarbeiten
- [ ] `supabase/DATA_MODEL.md` ausarbeiten (falls Supabase gewählt)
- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren

---

## Phase 3 · Designsystem & Komponenten

**Ziel:** Gemeinsames Designsystem und wiederverwendbare UI-Komponenten entwickeln.

**Voraussetzung:** Phase 2 abgeschlossen.

### Aufgaben

- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren
- [ ] Design-Tokens definieren (Farben, Typografie, Abstände, Breakpoints)
- [ ] Plattformkopf und Modulheader implementieren
- [ ] Fortschrittsanzeige implementieren
- [ ] Navigation (Zurück · Weiter · Modulübersicht) implementieren
- [ ] Aufgabenbox implementieren
- [ ] Informationsbox implementieren
- [ ] Warnhinweis-Komponente implementieren
- [ ] Merksatzbox implementieren
- [ ] Quiz- und Feedbackdarstellung implementieren
- [ ] Touchfreundliche Schaltflächen sicherstellen
- [ ] Responsive Layout (Notebook, Tablet, Smartphone) sicherstellen
- [ ] Barrierefreiheit aller Komponenten prüfen (Tastatur, ARIA, Kontrast)
- [ ] `prefers-reduced-motion` implementieren
- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren

---

## Phase 4 · Modulentwicklung

**Ziel:** Alle Pflichtmodule und das optionale Modul als neue Implementierung entwickeln.

**Voraussetzung:** Phase 3 abgeschlossen.

### Reihenfolge

1. Modul 1 – Was ist KI? (Pflicht)
2. Modul 2 – Grundsätze der KI-Nutzung inkl. Kennzeichnungspflicht & Datenschutz (Pflicht)
3. Abschluss-Zertifikat (Pflicht)
4. Modul 5 – KI & Nachhaltigkeit (Optional)

### Aufgaben je Modul

- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren (vor Modulentwicklung)
- [ ] Inhalte aus Legacy-Analyse übernehmen (nicht aus Legacy-Datei kopieren)
- [ ] Interaktionen neu implementieren
- [ ] Didaktische Hinweise (Simulationen, Näherungswerte) kennzeichnen
- [ ] Fortschrittslogik integrieren
- [ ] Barrierefreiheit prüfen
- [ ] Modul gegen Abnahmekriterien testen
- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren (nach Modulentwicklung)

---

## Phase 5 · Integration & Plattform-Shell

**Ziel:** Alle Module in die gemeinsame Plattform integrieren.

**Voraussetzung:** Alle Pflichtmodule aus Phase 4 abgeschlossen.

### Aufgaben

- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren
- [ ] Dashboard implementieren (alle Module mit Status)
- [ ] Gemeinsame Fortschrittsverwaltung integrieren
- [ ] Zertifikatsfreischaltung implementieren
- [ ] Druckansicht für Zertifikat implementieren
- [ ] End-to-End-Test des gesamten Lernpfads
- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren

---

## Phase 6 · Abnahme & Qualitätssicherung

**Ziel:** Vollständige Prüfung gegen alle Abnahmekriterien.

**Voraussetzung:** Phase 5 abgeschlossen.

### Aufgaben

- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren
- [ ] Alle Kriterien aus `ACCEPTANCE_CRITERIA.md` systematisch prüfen
- [ ] Browsertest: aktuelle Desktop- und Tablet-Browser
- [ ] Responsivitätstest: Notebook, Tablet, Smartphone
- [ ] Barrierefreiheitstest: Tastatur, Screenreader, Kontrast
- [ ] Fortschrittstest: Neuladen, Modulisolation
- [ ] Zertifikatstest: Sperrung vor Abschluss, Freischaltung, Druck
- [ ] Didaktiktest: Simulationshinweise, Näherungswerte, Ausweichmöglichkeiten
- [ ] Abnahme-Checkliste aus `ACCEPTANCE_CRITERIA.md` vollständig abhaken
- [ ] `CHANGELOG.md` aktualisieren
- [ ] Prüfsummen gegen `FILE_MANIFEST.json` verifizieren

---

## Prüfsummen-Protokoll

Bei jeder Phasengrenze ist folgendes Protokoll auszuführen:

```bash
# Prüfsummen berechnen
sha256sum legacy/* | sort

# Ergebnis mit FILE_MANIFEST.json vergleichen
# Bei Abweichung: STOPP
```

Bei Abweichung:
```
STOPP.
Prüfsummenabweichung festgestellt.
Betroffene Datei: [Dateiname]
Erwartete SHA-256: [aus FILE_MANIFEST.json]
Tatsächliche SHA-256: [berechnet]
Keine weiteren Änderungen werden durchgeführt.
```