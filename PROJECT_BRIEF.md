# PROJECT_BRIEF.md

## KI-Führerschein Klasse 7 – Projektzusammenfassung

**Version:** 1.0  
**Stand:** 2026-10-24  
**Phase:** BASELINE / LEGACY SNAPSHOT

---

## 1. Ausgangssituation

Es existieren mehrere eigenständige HTML-Anwendungen, die KI-Kompetenzen für Schülerinnen und Schüler der Klasse 7 vermitteln. Diese Einzelanwendungen funktionieren bereits und enthalten umfangreiche, didaktisch ausgearbeitete Lerninhalte.

Die Anwendungen sind bisher nicht miteinander verbunden: Es gibt keine gemeinsame Navigation, keine einheitliche Fortschrittsanzeige, kein übergreifendes Zertifikat und keine konsistente Gestaltung.

### Vorhandene Ausgangsdateien

| Datei | Inhalt |
|---|---|
| `ki_Fortbildung_klasse7_Borrmann.html` | Modul 01 – KI verstehen |
| `ki_Fortbildung_klasse7_Borrmann.html_TECHNISCHE_DOKUMENTATION.md` | Technische Doku zu Modul 01 |
| `Modul2.html` | Modul 02 – KI sinnvoll nutzen |
| `KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html` | Modul 03 – KI & Nachhaltigkeit |
| `KI_Fuehrerschein_Zertifikat.html` | Abschluss-Zertifikat (Ausgangspunkt) |
| `KI_Fuehrerschein_Uebergabedokument.docx` | Inhaltlich-technische Spezifikation |

---

## 2. Projektziel

Aus den Einzelanwendungen entsteht eine **gemeinsame, schülergerechte Plattform „KI-Führerschein Klasse 7"**.

Die Plattform:
- vereinheitlicht Navigation, Gestaltung, Fortschritt, Speicherung und Abschluss
- übernimmt alle Inhalte und wesentlichen Interaktionen der Referenzimplementierungen
- ist modular erweiterbar auf Jahrgänge 7–10 und Oberstufe
- funktioniert ohne Benutzerkonto (lokaler Betrieb)
- ist barrierefrei und für Klasse 7 geeignet

---

## 3. Kompetenzrahmen

Die Plattform orientiert sich an vier Kompetenzbereichen:

| Bereich | Beschreibung |
|---|---|
| **Verstehen** | Grundprinzipien von KI nachvollziehen (Trainingsdaten, Mustererkennung, Sprachmodelle) |
| **Anwenden** | KI sinnvoll und verantwortungsvoll als Lernwerkzeug einsetzen |
| **Reflektieren** | Auswirkungen, Grenzen und Ressourcenverbrauch von KI einschätzen |
| **Mitgestalten** | Bewusste, kritische Entscheidungen über KI-Nutzung treffen |

---

## 4. Stufe 1 – Klasse 7

### Pflichtmodule

| Nr. | Titel | Kompetenzbereich | Referenzdatei |
|---|---|---|---|
| 1 | Was ist KI? | Verstehen | `ki_Fortbildung_klasse7_Borrmann.html` |
| 2 | Grundsätze der KI-Nutzung | Anwenden | `Modul2.html` |
| 3 | Kennzeichnungspflicht | Reflektieren | (in Modul 2) |
| 4 | Datenschutz | Reflektieren | (in Modul 2) |

### Optionales Modul

| Nr. | Titel | Kompetenzbereich | Referenzdatei |
|---|---|---|---|
| 5 | KI und Nachhaltigkeit | Reflektieren / Mitgestalten | `KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html` |

### Abschluss

- KI-Führerschein Grundlagen
- Achievements für einzelne Kompetenzen
- Zertifikat nach erfolgreichem Abschluss aller Pflichtmodule

---

## 5. Plattformlogik (Ziel)

- **Dashboard:** Alle Module mit Status auf einen Blick
- **Statuswerte:** noch nicht begonnen · in Bearbeitung · abgeschlossen · bestanden
- **Navigation:** Zurück · Weiter · Modulübersicht (einheitlich)
- **Fortschritt:** bleibt beim Neuladen erhalten (localStorage oder Supabase)
- **Isolation:** Jedes Modul hat eigenen Speicherbereich – keine gegenseitige Überschreibung
- **Zertifikat:** Erst nach Abschluss aller Pflichtmodule freigeschaltet
- **Kein Benutzerkonto** für Kernfunktionalität erforderlich

---

## 6. Designsystem (Ziel)

| Element | Vorgabe |
|---|---|
| Plattformfarbe | Dunkles Petrol |
| Modul 1 – KI verstehen | Blau |
| Modul 2 – KI sinnvoll nutzen | Blau/Violett |
| Modul 3 – Nachhaltigkeit | Grün/Türkis |
| Abschluss/Zertifikat | Gold |
| Schaltflächen | Groß, touchfreundlich |
| Layout | Responsiv (Notebook, Tablet, Smartphone) |
| Druck | Druckansicht für Zertifikat und Zusammenfassungen |

---

## 7. Technische Leitplanken

- Kein vollständiges HTML als JavaScript-String verschachteln
- Inhalte, Darstellung und Zustandslogik modular trennen
- Wiederverwendbare UI-Komponenten für Navigation, Quiz, Feedback, Merksätze, Fortschritt
- Externe Fakten und Quellen zentral und aktualisierbar verwalten
- Eindeutige IDs und Versionen pro Modul
- Referenzimplementierungen inhaltlich und didaktisch übernehmen – technisch neu umsetzen

---

## 8. Barrierefreiheit

- Vollständige Tastaturbedienbarkeit
- Sichtbare Fokusmarkierung
- Alt-Texte für relevante Bilder
- Rückmeldung nicht ausschließlich über Farbe
- Reduzierte Animation bei entsprechender Systemeinstellung
- Vorlesefunktion (plattformweit einheitlich, soweit möglich)
- Einfache Sprache, optionale Vertiefungsinformationen

---

## 9. Projektphasen (Übersicht)

| Phase | Inhalt | Status |
|---|---|---|
| 0 – Baseline | Legacy-Sicherung, Projektstruktur, Dokumentation | ✅ Abgeschlossen |
| 1 – Analyse | Vollständige Analyse aller Legacy-Dateien | ⏳ Ausstehend (HTML-Dateien fehlen noch) |
| 2 – Architektur | Technische Architekturentscheidungen | ⏳ Ausstehend |
| 3 – Komponenten | Gemeinsames Designsystem und UI-Komponenten | ⏳ Ausstehend |
| 4 – Module | Migration der Inhalte in neue Plattform | ⏳ Ausstehend |
| 5 – Integration | Dashboard, Navigation, Fortschritt, Zertifikat | ⏳ Ausstehend |
| 6 – Abnahme | Test gegen Abnahmekriterien | ⏳ Ausstehend |

---

## 10. Wichtiger Hinweis

Das Übergabedokument (`KI_Fuehrerschein_Uebergabedokument.docx`) ist als inhaltlich-technisches Übergabeformat gedacht, wenn die ursprünglichen HTML-Dateien nicht direkt hochgeladen werden können. Für eine pixelgenaue Rekonstruktion einzelner Interaktionen ersetzt es den Originalquellcode nicht. Die HTML-Dateien müssen vor Entwicklungsbeginn in `/legacy` abgelegt werden.