# Analyse: Modul2.html

**Modul:** 02 – KI sinnvoll nutzen  
**Legacy-Datei:** `legacy/Modul2.html`  
**SHA-256:** `1b9b1297bd13323401cd79b8b9b441c96e18f5fa4f24401bf3d0b656cfe67c7d`  
**Größe:** 20.573 Bytes  
**Analysiert:** 2026-10-24

---

## 1. Zweck

Interaktive Lerneinheit „KI sinnvoll nutzen" für den KI-Führerschein Klasse 7. Schüler:innen erarbeiten, wie KI als Werkzeug eingesetzt werden kann, ohne eigenes Denken zu ersetzen. Enthält auch die Inhalte zu Kennzeichnungspflicht (Modul 3) und Datenschutz (Modul 4). Fortschritt und Punkte werden lokal im Browser gespeichert.

**Leitfrage:** Wie kann KI mir helfen, ohne mein eigenes Denken zu ersetzen?

---

## 2. Zielgruppe

- Klasse 7 (ca. 12–13 Jahre)
- Einzel-, Partner- und Gruppenarbeit
- Bearbeitungszeit: ca. 45 Minuten

---

## 3. Lernziele

| Nr. | Lernziel | Kompetenzbereich |
|---|---|---|
| M2-L1 | KI als Werkzeug einordnen, nicht als Ersatz für eigenes Denken | Verstehen / Reflektieren |
| M2-L2 | Fehler in KI-Antworten erkennen und mit Quellen prüfen | Anwenden |
| M2-L3 | Überzeugend klingende, aber falsche Antworten identifizieren | Reflektieren |
| M2-L4 | Gute Lernprompts formulieren (Thema, Ziel, Klassenstufe, Form) | Anwenden |
| M2-L5 | Sinnvolle und problematische KI-Nutzung in Alltagssituationen beurteilen | Reflektieren |
| M2-L6 | Verantwortung für übernommene KI-Ergebnisse übernehmen | Reflektieren |
| M2-L7 | Datenschutzregeln im Umgang mit KI kennen | Reflektieren |
| M2-L8 | Schulische Regeln zur KI-Nutzung kennen und einhalten | Anwenden |
| M2-L9 | Persönliche KI-Regeln formulieren und sich dazu verpflichten | Mitgestalten |

---

## 4. Struktur (10 Abschnitte)

### Abschnitt 1 · Dein Auftrag
- **Typ:** Lernziele lesen + bestätigen
- **Punkte:** 5
- **Interaktion:** Button „Ziele gelesen ✓" (`complete-btn`, `data-task="intro"`)
- **Inhalt:** Lernziele als Notiz-Box + Kernbotschaft als Merksatz

### Abschnitt 2 · Einstieg: Ist KI schlauer als du?
- **Typ:** Partnerreflexion, Freitext
- **Punkte:** 5
- **Interaktion:** Textarea (`#startReflection`), Button speichert bei ≥20 Zeichen
- **Sozialform:** Partnerarbeit, 3 Minuten
- **Prompt:** „Wir denken ..., weil ..."

### Abschnitt 3 · Experiment: Die KI als Fehlerquelle
- **Typ:** Praktisches Experiment mit externer KI + Dokumentation
- **Punkte:** 15
- **Interaktion:** Textarea (`#foundError`), Button speichert bei ≥20 Zeichen
- **Besonderheit:** Vorgefertigter Prompt für die KI (z.B. AIS.chat) zum Kopieren
- **Datenschutz-Hinweis:** ✅ Explizit vorhanden: „Gebt keine persönlichen Daten ein"
- **Auftrag:** 4 Fragen aus verschiedenen Schulfächern stellen, Fehler markieren, prüfen

### Abschnitt 4 · Zwischenquiz: Fehlerdetektiv
- **Typ:** Single-Choice-Quiz
- **Punkte:** 5
- **Frage:** Warum können falsche KI-Antworten gefährlich sein?
- **Korrekte Antwort:** „Weil sie überzeugend klingen können und deshalb leicht ungeprüft übernommen werden."
- **Besonderheit:** Nur ein Versuch, danach gesperrt

### Abschnitt 5 · Fünf Grundsätze
- **Typ:** Informationsseite + Bestätigung
- **Punkte:** 5
- **Interaktion:** Button „Grundsätze gelesen ✓"
- **Inhalt:** 5 Grundsätze als Notiz-Karten im Grid:
  1. Werkzeug – KI übernimmt weder Denken noch Verantwortung
  2. Prüfen – „Klingt richtig" ≠ „ist richtig"
  3. Lernen – KI zum Erklären, Üben, Verbessern nutzen, nicht zum Abschreiben
  4. Genau fragen – Thema, Ziel, Klassenstufe, Form nennen
  5. Kritisch bleiben – KI-Ergebnisse können einseitig, unfair oder unvollständig sein

### Abschnitt 6 · Prompt-Challenge
- **Typ:** Quiz + Freitext
- **Punkte:** 5 (Quiz) + 10 (eigener Prompt)
- **Quiz:** Welche Anfrage hilft besser beim Lernen? (Single-Choice, 1 Versuch)
- **Korrekte Antwort:** Detaillierter Prompt mit Thema, Klassenstufe, Schritten und Aufgaben
- **Freitext:** Eigenen Lernprompt formulieren (`#ownPrompt`, ≥20 Zeichen)

### Abschnitt 7 · Situationen beurteilen
- **Typ:** 4 Dropdown-Szenarien
- **Punkte:** bis 10 (2,5 pro richtige Antwort)
- **Szenarien:**
  - A: Ersten Rechenschritt erklären lassen, dann selbst weiterrechnen → Sinnvoll ✓
  - B: Vollständige KI-Hausaufgabe unverändert einreichen → Nicht sinnvoll ✓
  - C: Ideen sammeln, prüfen, selbst formulieren → Sinnvoll ✓
  - D: Antwort übernehmen, weil sie professionell klingt → Nicht sinnvoll ✓
- **Besonderheit:** Auswertung erst nach Klick auf „Situationen auswerten"

### Abschnitt 8 · Abschlusstest
- **Typ:** 4 Single-Choice-Fragen (je 5 Punkte)
- **Fragen:**
  1. Wer trägt die Verantwortung für eine übernommene KI-Antwort? → Die Person, die das Ergebnis nutzt
  2. Warum können KI-Ergebnisse Vorurteile enthalten? → Weil verarbeitete Inhalte Fehler und Vorurteile von Menschen enthalten können
  3. Was ist der beste erste Schritt bei einer überraschenden Behauptung? → Mit geeigneter Quelle prüfen
  4. Welche Nutzung fördert eigenes Lernen? → Hinweise erhalten, selbst weiterarbeiten, Ergebnis erklären können

### Abschnitt 9 · Meine KI-Regeln
- **Typ:** Checkliste + Freitext
- **Punkte:** 10
- **Interaktion:** 4 Checkboxen + Textarea für eigene Regel (≥15 Zeichen)
- **Bedingung:** Alle 4 Checkboxen müssen aktiviert sein UND eigene Regel ausgefüllt
- **Regeln:**
  1. Ich prüfe wichtige Informationen.
  2. Ich nutze KI als Hilfe und nicht als Ersatz für mein Denken.
  3. Ich gebe keine persönlichen Daten ein. *(Datenschutz – Modul 4)*
  4. Ich beachte die schulischen Regeln und kennzeichne KI-Nutzung, wenn es verlangt wird. *(Kennzeichnungspflicht – Modul 3)*

### Abschnitt 10 · Badges & Gesamtauswertung
- **Typ:** Automatische Auswertung
- **Badges (4 Stück):**
  - 🕵️ Fehlerdetektiv – Fehlerexperiment dokumentiert (`done.experiment`)
  - 💬 Prompt-Profi – Guten Lernprompt formuliert (`done.prompt`)
  - ✅ Faktenprüfer – Mindestens 3 Quizfragen richtig (`correct >= 3`)
  - 🏆 KI-Profi – Mindestens 80 Punkte erreicht (`points >= 80`)
- **Gesamtergebnis:** Pass (≥80), Mid (≥60), Fail (<60)
- **Merksatz bei Bestehen:** „KI unterstützt mich. Prüfen, Entscheiden und Verantwortung bleiben bei mir."

---

## 5. Technische Merkmale

| Merkmal | Details |
|---|---|
| **Speicherung** | `localStorage` (Key: `kiModuleState`) – JSON mit `points`, `done`, `correct` |
| **Maximale Punkte** | 100 |
| **Bestehensschwelle** | 80 Punkte |
| **Fortschrittsanzeige** | Sticky Dashboard (oben, `position:sticky`), Fortschrittsbalken + Punktestand |
| **Quiz-Logik** | Single-Choice, einmaliger Versuch, sofortiges Feedback, danach gesperrt |
| **Freitext-Validierung** | Mindestlänge 20 Zeichen (Ausnahme: eigene Regel 15 Zeichen) – kein inhaltlicher Check |
| **Externe Abhängigkeiten** | **Keine** – vollständig selbstenthalten |
| **Frameworks** | Keine – reines Vanilla JS + CSS |
| **Vorlesefunktion** | ❌ Nicht vorhanden |
| **Responsive** | ✅ `@media print` blendet Dashboard und Buttons aus |
| **Druckansicht** | ✅ Basis-Druckstyles vorhanden |
| **Reset** | ✅ Button „Neu starten" mit `confirm()`-Dialog, löscht localStorage |
| **Barrierefreiheit** | `aria-label="Lernfortschritt"` am Dashboard; sonst keine expliziten ARIA-Attribute |

---

## 6. Zustandsmodell (localStorage)

```javascript
{
  "points": 0,        // Gesamtpunkte (0–100)
  "done": {           // Abgeschlossene Aufgaben (boolean-Map)
    "intro": true,
    "start": true,
    "experiment": true,
    "q1": true,       // Zwischenquiz
    "principles": true,
    "q2": true,       // Prompt-Quiz
    "prompt": true,
    "scenarios": true,
    "q3": true,       // Abschlusstest Frage 1
    "q4": true,       // Abschlusstest Frage 2
    "q5": true,       // Abschlusstest Frage 3
    "q6": true,       // Abschlusstest Frage 4
    "rules": true
  },
  "correct": 0        // Anzahl richtig beantworteter Quizfragen (für Badge)
}
```

---

## 7. Enthaltene Inhalte zu Modul 3 (Kennzeichnungspflicht) und Modul 4 (Datenschutz)

| Modul | Wo integriert | Inhalt |
|---|---|---|
| Modul 3 – Kennzeichnungspflicht | Abschnitt 9, Checkbox 4 | „Ich beachte die schulischen Regeln und kennzeichne KI-Nutzung, wenn es verlangt wird." |
| Modul 4 – Datenschutz | Abschnitt 3 (Warnung) + Abschnitt 9, Checkbox 3 | „Gebt keine persönlichen Daten ein" + „Ich gebe keine persönlichen Daten ein." |

> ℹ️ Beide Themen sind inhaltlich integriert, aber nicht als eigenständige Lerneinheiten ausgearbeitet. In der neuen Plattform ist zu entscheiden, ob sie als eigene Module oder als Abschnitte in Modul 2 umgesetzt werden.

---

## 8. Wichtige Hinweise für die Neuentwicklung

| Thema | Hinweis |
|---|---|
| **Freitext ≠ Leistung** | Validierung prüft nur Mindestlänge (20 Zeichen), nicht inhaltliche Qualität – laut Übergabedokument muss das verbessert werden |
| **Quiz: nur ein Versuch** | Falsche Antworten können nicht wiederholt werden – lernorientierte Wiederholungsversuche sind für die neue Plattform vorgesehen |
| **Fortschritt und Leistung trennen** | Aktuell werden Fortschritt (Aufgabe bearbeitet) und Leistung (fachlich korrekt) nicht klar getrennt – explizite Anforderung aus Übergabedokument |
| **Datenschutz-Hinweis** | Explizit vorhanden – muss in der neuen Plattform erhalten bleiben |
| **Kennzeichnungspflicht** | Nur als Checkbox-Regel integriert – ggf. als eigenes Modul ausbauen |
| **Externer KI-Zugang** | Abschnitt 3 setzt voraus, dass Lehrkraft eine KI freigibt (z.B. AIS.chat) – Plattform muss das kommunizieren |
| **Prompt-Vorlage** | Vorgefertigter Prompt in Abschnitt 3 ist didaktisch wertvoll – als Komponente übernehmen |
| **Badge-System** | 4 Badges mit klaren Freischaltbedingungen – als Referenz für Plattform-Achievement-System |
| **Sticky Dashboard** | Fortschrittsanzeige bleibt beim Scrollen sichtbar – gutes UX-Muster für die Plattform |