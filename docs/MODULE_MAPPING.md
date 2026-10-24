# MODULE_MAPPING.md

Mapping der Legacy-Dateien auf die neue Plattformstruktur.

**Version:** 1.0  
**Stand:** 2026-10-24

---

## Übersicht

| Legacy-Datei | Plattform-Modul | Ziel-Pfad (neu) | Status |
|---|---|---|---|
| `ki_Fortbildung_klasse7_Borrmann.html` | Modul 1 – Was ist KI? | `src/modules/modul-01-ki-verstehen/` | ⏳ Ausstehend |
| `ki_Fortbildung_klasse7_Borrmann.html_TECHNISCHE_DOKUMENTATION.md` | Technische Referenz Modul 1 | `docs/legacy-analysis/modul-01-technisch.md` | ⏳ Ausstehend |
| `Modul2.html` | Modul 2 – Grundsätze der KI-Nutzung (inkl. Module 3 & 4) | `src/modules/modul-02-ki-nutzen/` | ⏳ Ausstehend |
| `KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html` | Modul 5 – KI & Nachhaltigkeit (optional) | `src/modules/modul-05-nachhaltigkeit/` | ⏳ Ausstehend |
| `KI_Fuehrerschein_Zertifikat.html` | Abschluss – KI-Führerschein-Zertifikat | `src/modules/abschluss-zertifikat/` | ⏳ Ausstehend |
| `KI_Fuehrerschein_Uebergabedokument.docx` | Projektspezifikation (kein Modul) | `legacy/` (READ ONLY) | ✅ Gesichert |

---

## Detailmapping

### Modul 1 · Was ist KI?

**Legacy:** `legacy/ki_Fortbildung_klasse7_Borrmann.html`  
**Neu:** `src/modules/modul-01-ki-verstehen/`

| Legacy-Bestandteil | Neue Komponente | Anmerkung |
|---|---|---|
| Interaktive Bilderkennung (Pferde) | `src/components/simulation/ImageTraining.jsx` o. ä. | Inhalt und Logik übernehmen, technisch neu umsetzen |
| Wasserzeichen-Rätsel | `src/components/simulation/WatermarkPuzzle.jsx` o. ä. | Inhalt und Logik übernehmen |
| Sprach-KI-Simulation | `src/components/simulation/LanguageAI.jsx` o. ä. | Inhalt und Logik übernehmen |
| Satzwerkstatt | `src/components/simulation/SentenceBuilder.jsx` o. ä. | Inhalt und Logik übernehmen |
| Merksätze | `src/components/ui/Merksatz.jsx` o. ä. | Wiederverwendbare Komponente |
| Fortschrittslogik | `src/lib/progress.js` | Zentrale Fortschrittsverwaltung |

> ⚠️ Konkrete Komponentennamen werden nach Analyse der HTML-Datei und Architekturentscheidung festgelegt.

---

### Modul 2 · Grundsätze der KI-Nutzung (inkl. Module 3 & 4)

**Legacy:** `legacy/Modul2.html`  
**Neu:** `src/modules/modul-02-ki-nutzen/`

| Legacy-Bestandteil | Neue Komponente | Anmerkung |
|---|---|---|
| Einstiegsreflexion | `src/components/tasks/Reflection.jsx` o. ä. | Inhalt übernehmen |
| Fehlerexperiment | `src/components/tasks/ErrorExperiment.jsx` o. ä. | Hinweis: keine persönlichen Daten |
| Quiz (KI-Antworten prüfen) | `src/components/quiz/Quiz.jsx` o. ä. | Wiederverwendbare Quiz-Komponente |
| Fünf Grundsätze | `src/components/ui/Principles.jsx` o. ä. | Merksatz-Komponente |
| Prompt-Challenge | `src/components/tasks/PromptChallenge.jsx` o. ä. | Inhalt übernehmen |
| Alltagssituationen | `src/components/tasks/ScenarioJudgement.jsx` o. ä. | Inhalt übernehmen |
| Abschlusstest | `src/components/quiz/FinalTest.jsx` o. ä. | Leistung ≠ Fortschritt beachten |
| Persönliche KI-Regeln | `src/components/tasks/PersonalRules.jsx` o. ä. | Inhalt übernehmen |
| Kennzeichnungspflicht (M3) | Abschnitt in Modul 2 oder eigenes Modul | Entscheidung nach Analyse |
| Datenschutz (M4) | Abschnitt in Modul 2 oder eigenes Modul | Entscheidung nach Analyse |

---

### Modul 5 · KI & Nachhaltigkeit (optional)

**Legacy:** `legacy/KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html`  
**Neu:** `src/modules/modul-05-nachhaltigkeit/`

| Legacy-Bestandteil | Neue Komponente | Anmerkung |
|---|---|---|
| Station 1 · Ressourcen | `src/components/simulation/ResourceCards.jsx` o. ä. | Quellen transparent kennzeichnen |
| Station 2 · Filmcheck | `src/components/media/VideoCheck.jsx` o. ä. | Ausweichmöglichkeit bei gesperrten Medien |
| Station 3 · Wasser | `src/components/simulation/WaterCalculator.jsx` o. ä. | Modellwerte kennzeichnen |
| Station 4 · Handy-Akku | `src/components/simulation/EnergyCalculator.jsx` o. ä. | Modellwerte kennzeichnen |
| Station 5 · KI im Alltag | `src/components/tasks/EverydayTransfer.jsx` o. ä. | Transfer-Aufgabe |

---

### Abschluss · KI-Führerschein-Zertifikat

**Legacy:** `legacy/KI_Fuehrerschein_Zertifikat.html`  
**Neu:** `src/modules/abschluss-zertifikat/`

| Legacy-Bestandteil | Neue Komponente | Anmerkung |
|---|---|---|
| Zertifikatsgestaltung | `src/modules/abschluss-zertifikat/Certificate.jsx` o. ä. | Gestalterisch als Ausgangspunkt geeignet |
| Freischaltlogik | `src/lib/progress.js` | Erst nach Abschluss aller Pflichtmodule |
| Druckansicht | CSS Print-Stylesheet | Druckbar / als PDF speicherbar |

> ⚠️ Das Legacy-Zertifikat bescheinigt bisher die Nachhaltigkeitsstationen. Die neue Version muss alle vier Kompetenzbereiche abbilden.

---

## Gemeinsame Plattform-Komponenten (neu, kein Legacy-Äquivalent)

| Komponente | Pfad | Beschreibung |
|---|---|---|
| Dashboard | `src/app/Dashboard.jsx` o. ä. | Alle Module mit Status auf einen Blick |
| Plattformkopf | `src/components/layout/Header.jsx` o. ä. | Einheitlicher Kopf für alle Seiten |
| Modulheader | `src/components/layout/ModuleHeader.jsx` o. ä. | Modulspezifischer Header |
| Fortschrittsanzeige | `src/components/ui/ProgressBar.jsx` o. ä. | Einheitliche Fortschrittsanzeige |
| Navigation | `src/components/layout/Navigation.jsx` o. ä. | Zurück · Weiter · Modulübersicht |
| Fortschrittsverwaltung | `src/lib/progress.js` | Zentrale Logik, isolierte Speicherbereiche |
| Designsystem / Tokens | `src/styles/tokens.css` o. ä. | Farben, Typografie, Abstände |

---

## Offene Fragen (zu klären nach Analyse der HTML-Dateien)

- [ ] Sind Kennzeichnungspflicht und Datenschutz in Modul 2 integriert oder als eigenständige Module umzusetzen?
- [ ] Welche Interaktionen aus den Legacy-Dateien erfordern besondere technische Lösungen?
- [ ] Welche externen Medien werden in den Legacy-Dateien verwendet und wie werden Ausweichmöglichkeiten implementiert?
- [ ] Welche Fakten und Quellen müssen zentral verwaltet werden?
- [ ] Wie wird die Vorlesefunktion technisch umgesetzt?

---

> ⚠️ Alle Komponentennamen und Pfade sind vorläufig und werden nach Architekturentscheidung (Phase 2) finalisiert.  
> Dieses Dokument wird nach Analyse der Legacy-HTML-Dateien (Phase 1) aktualisiert.