# Analyse: ki_Fortbildung_klasse7_Borrmann.html

**Modul:** 01 – Was ist KI? (KI-Detektive)  
**Legacy-Datei:** `legacy/ki_Fortbildung_klasse7_Borrmann.html`  
**SHA-256:** `c4e85dee87a6b52b323b28ccecdcc4e61ec2381b4ff154cc4cf355aec054fc8b`  
**Größe:** 518.714 Bytes (257 Zeilen – stark komprimierter Code)  
**Analysiert:** 2026-10-24

---

## 1. Zweck

Interaktive Lerneinheit „KI-Detektive – Wie funktioniert KI?" für den KI-Führerschein Klasse 7. Schüler:innen erkunden spielerisch die Grundprinzipien von KI: Trainingsdaten, Mustererkennung, Wasserzeichen-Fehler, Sprach-KI und Satzaufbau. Die Anwendung ist vollständig selbstenthalten – keine externen Abhängigkeiten.

---

## 2. Zielgruppe

- Klasse 7 (ca. 12–13 Jahre)
- Einzelarbeit, geführte Entdeckung
- Keine Zeitvorgabe angegeben (schätzungsweise 30–45 Minuten)

---

## 3. Lernziele

| Nr. | Lernziel | Kompetenzbereich |
|---|---|---|
| M1-L1 | Schüler:innen können erklären, was Trainingsdaten sind und warum Menge und Vielfalt wichtig sind | Verstehen |
| M1-L2 | Schüler:innen können beschreiben, wie eine Mini-KI Muster aus Bildern lernt | Verstehen |
| M1-L3 | Schüler:innen können erläutern, dass KI auch falsche oder irrelevante Merkmale lernen kann (Wasserzeichen-Effekt) | Verstehen |
| M1-L4 | Schüler:innen können das Funktionsprinzip von Sprach-KI (Wortfortsetzung, Kontext) vereinfacht erklären | Verstehen |
| M1-L5 | Schüler:innen können den schrittweisen Aufbau eines Satzes durch KI nachvollziehen | Verstehen |

---

## 4. Didaktisches Leitprinzip

> **beobachten → vermuten → ausprobieren → prüfen → Rückmeldung erhalten → Merksatz sichern**

Jede Station folgt diesem Zyklus. Merksätze werden explizit als `💡 Merksatz` hervorgehoben.

---

## 5. Struktur und Interaktionen

### Station 1 · Trainingsdaten und Bilderkennung (Pferde)

**Lernziel:** Menge und Vielfalt von Trainingsdaten sichtbar machen

| Schritt | Beschreibung | Interaktionstyp |
|---|---|---|
| Training animieren | Schüler:innen starten eine Animation, die zeigt, wie Bilder als Trainingsdaten hinzugefügt werden | Button, Animation |
| Trainingsmeter | Fortschrittsbalken zeigt Trainingsfortschritt | Visuelles Feedback |
| Pferde-Grid | 6 Pferde-Kacheln (Emojis) werden als Trainingsdaten angezeigt | Exploration |
| Test: Welches Bild erkennt die KI? | Schüler:innen wählen aus Bildern, welche die KI als Pferd erkennt | Multiple-Choice |
| Diverse Trainingsdaten | Zweite Runde mit vielfältigeren Trainingsdaten (weißes Pferd, Pony) | Vergleich |
| Quiz | Single-Choice: Warum helfen vielfältige Trainingsdaten? | Quiz mit Feedback |
| Merksatz | „Viele und vielfältige Beispiele helfen einer KI, besser zu lernen." | Merksatz |

**Wichtige Implementierungsdetails:**
- `phase1Choice`, `phase2Choice` – Mehrfachauswahl möglich
- Korrekte Antwort Phase 1: Bilder `d` und `e` (nicht-braune Pferde)
- Korrekte Antwort Phase 2: `white` und `pony`
- `firstSolved` – Flag, das verhindert, dass Phase 1 nach Lösung nochmals gewertet wird
- `animateTraining()` und `animateDiverseTraining()` – Animationsfunktionen

---

### Station 2 · Wasserzeichen-Rätsel

**Lernziel:** Zeigen, dass KI auch irrelevante/falsche Merkmale lernen kann

| Schritt | Beschreibung | Interaktionstyp |
|---|---|---|
| Wasserzeichen entdecken | Schüler:innen sehen Fotos mit eingeblendetem „R"-Wasserzeichen | Exploration |
| Drag & Drop (Pin) | Schüler:innen ziehen einen Pin auf ein Foto, um das Wasserzeichen zu markieren | Drag & Drop (`wm-pin`, `wm-drop-photo`) |
| Ja/Nein-Entscheidungen | Für 5 Testbilder (wmStep 0–4): Ist das ein Pferd? | Binäre Entscheidung |
| Auflösung | Zeigt, dass das Auto mit „R" fälschlicherweise als Pferd erkannt wurde | Feedback |
| Quiz | Single-Choice: Warum hat die KI das Auto als Pferd erkannt? | Quiz mit Feedback |
| Merksatz | KI kann auch falsche Merkmale lernen | Merksatz |

**Wichtige Implementierungsdetails:**
- `wmStep` (0–4) – Schritt durch 5 Testbilder
- `wmChoice` – `'yes'` oder `'no'`
- `wmChecked` – ob Antwort bestätigt wurde
- `wmDiscovery` (0/1/2) – Fortschritt im Entdeckungsprozess
- `wmConclusion` (0/1/2) – Fortschritt zur Schlussfolgerung
- Drag & Drop mit Touch-Support (`touch-action:none`, `user-select:none`)
- Fallback-Anzeige wenn Bilder nicht laden (`wm-fallback`)

---

### Station 3 · Sprach-KI: Wortfortsetzung

**Lernziel:** Einfluss des Kontexts auf Wortfortsetzungen verstehen

| Schritt | Beschreibung | Interaktionstyp |
|---|---|---|
| Kontext wählen | Schüler:innen wählen zwischen zwei Kontexten: „pause" oder „sport" | Toggle-Buttons (`context-btn`) |
| Wahrscheinlichkeitsbalken | Zeigt für verschiedene Wörter deren Wahrscheinlichkeit als Fortsetzung | Balkendiagramm (CSS) |
| Wort auswählen | Schüler:innen klicken auf ein Wort und sehen Feedback | Button-Auswahl |
| Stern-Toggle | Zeigt, wie ein zusätzliches Kontextwort die Wahrscheinlichkeiten verändert | Toggle (`starOn`) |

**Wichtige Implementierungsdetails:**
- `context` – `'pause'` oder `'sport'`
- `starOn` – boolean, ob Stern-Kontext aktiv
- Wahrscheinlichkeiten sind **didaktisch vereinfacht** (keine echte KI)
- Balken werden als CSS-Breite dargestellt (`.bar span`)

---

### Station 4 · Satzwerkstatt

**Lernziel:** Schrittweisen Satzaufbau durch KI nachvollziehen

| Schritt | Beschreibung | Interaktionstyp |
|---|---|---|
| Satz aufbauen | Schüler:innen wählen schrittweise Wörter aus, die den Satz erweitern | Button-Auswahl (3 Schritte) |
| Satz anzeigen | Aktueller Satz wird in `sw-sentence` angezeigt | Dynamische Anzeige |
| Zurück/Reset | Navigation durch den Satzaufbau | Buttons |
| Quiz | Single-Choice: Wie beeinflusst der bisherige Text die nächste Wahl? | Quiz mit Feedback |
| Merksatz | Kontext beeinflusst Wahrscheinlichkeiten | Merksatz |

**Wichtige Implementierungsdetails:**
- `built` – Array der gewählten Wörter
- `step` (0–3) – aktueller Schritt
- `s4Conclusion` (0/1/2) – Fortschritt zur Schlussfolgerung
- `s4Order` – zufällige Reihenfolge der Optionen (`shuffledOrder()`)

---

### Abschluss · „Du bist KI-Detektiv!"

- Zusammenfassung aller Merksätze
- `final-list` – Liste der gelernten Erkenntnisse
- Kein Punktesystem – rein inhaltlicher Abschluss

---

## 6. Technische Merkmale

| Merkmal | Details |
|---|---|
| **Dateigröße** | 518 KB – sehr groß, da alle Inhalte, Logik und Bilder (als Emojis/CSS) inline sind |
| **Zeilen** | 257 – stark komprimierter, minifizierter Code |
| **Speicherung** | **Kein localStorage** – kein persistenter Fortschritt |
| **Fortschrittsanzeige** | Einfacher Fortschrittsbalken (`#progress`) |
| **Externe Abhängigkeiten** | **Keine** – vollständig selbstenthalten |
| **Bilder** | Ausschließlich Emojis und CSS-Grafiken – keine externen Bild-URLs |
| **Frameworks** | Keine – reines Vanilla JS + CSS |
| **Vorlesefunktion** | ✅ Vorhanden: Web Speech API (`speechSynthesis`), Button `#speak`, Sprache `de-DE`, Rate 0.87 |
| **Drag & Drop** | ✅ Vorhanden (Wasserzeichen-Station), mit Touch-Support |
| **Animationen** | ✅ Vorhanden (Training, diverse Training), `prefers-reduced-motion` berücksichtigt |
| **Responsive** | ✅ Media Queries für ≤520px und ≤580px |
| **Druckansicht** | Nicht explizit implementiert |
| **Reset** | ✅ Vollständiger Reset aller Zustandsvariablen via `action === 'restart'` |

---

## 7. Zustandsvariablen (vollständig)

```javascript
page              // aktuelle Seite/Station
trained           // Anzahl trainierter Bilder
horseAnswer       // 'a' oder 'b' – Pferd-Auswahl
phase1Choice      // Array – gewählte Bilder Phase 1
phase1Checked     // boolean – Phase 1 geprüft
firstSolved       // boolean – Phase 1 korrekt gelöst
phase2Choice      // Array – gewählte Bilder Phase 2
phase2Checked     // boolean – Phase 2 geprüft
expanded          // boolean – diverse Trainingsdaten gezeigt
starOn            // boolean – Stern-Kontext aktiv
wmStep            // 0–4 – Wasserzeichen-Testschritt
wmChoice          // 'yes'|'no' – aktuelle Wasserzeichen-Antwort
wmChecked         // boolean – Wasserzeichen-Antwort bestätigt
wmDiscovery       // 0/1/2 – Entdeckungsfortschritt
wmConclusion      // 0/1/2 – Schlussfolgerungsfortschritt
s1Conclusion      // 0/1/2 – Station 1 Schlussfolgerung
s1QuizChoice      // string – gewählte Quiz-Antwort Station 1
s1QuizFeedback    // string – Feedback-Text Station 1
s1Order           // Array – zufällige Reihenfolge
wmOrder           // Array – zufällige Reihenfolge Wasserzeichen
wmQuizChoice      // string – gewählte Quiz-Antwort Wasserzeichen
wmQuizFeedback    // string – Feedback-Text Wasserzeichen
built             // Array – aufgebaute Satzwörter
step              // 0–3 – Satzwerkstatt-Schritt
s4Conclusion      // 0/1/2 – Station 4 Schlussfolgerung
s4QuizChoice      // string – gewählte Quiz-Antwort Station 4
s4QuizFeedback    // string – Feedback-Text Station 4
s4Order           // Array – zufällige Reihenfolge Station 4
context           // 'pause'|'sport' – Sprach-KI-Kontext
```

---

## 8. Wichtige Hinweise für die Neuentwicklung

| Thema | Hinweis |
|---|---|
| **Kein localStorage** | Fortschritt geht beim Neuladen verloren – muss in der Plattform ergänzt werden |
| **Vorlesefunktion** | Bereits implementiert (Web Speech API) – als Referenz für plattformweite Lösung geeignet |
| **Emojis als Bilder** | Alle Tierdarstellungen sind Emojis – plattformübergreifend unterschiedlich dargestellt; ggf. durch SVG ersetzen |
| **Didaktischer Hinweis** | Wahrscheinlichkeiten in Station 3 sind vereinfacht – Hinweis muss in der neuen Plattform sichtbar bleiben |
| **Drag & Drop** | Touch-Support vorhanden – Referenzimplementierung für Plattform-Komponente |
| **Kein Punktesystem** | Anders als Modul 2 – kein Score, rein inhaltliche Progression |
| **Zufällige Reihenfolge** | `shuffledOrder()` sorgt für Varianz bei Wiederholung – Prinzip übernehmen |
| **Sehr große Datei** | 518 KB durch inline-Code – in der neuen Plattform modular aufteilen |
| **Abschluss-Bedingungen** | Strenge Gating-Logik: z.B. `s1-to-quiz` nur wenn `firstSolved && expanded && phase2Checked && phase2Choice.length===2 && ['white','pony'].every(...)` – didaktisch wichtig, übernehmen |