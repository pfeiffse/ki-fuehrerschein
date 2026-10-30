# KI-Detektive – Technische und didaktische Dokumentation

> **Begleitdatei für eine andere KI / einen Entwickler.** Lies diese Datei **zusammen mit** `ki_entdeckungsreise_klasse7.html`. Diese Dokumentation beschreibt die aktuell vorliegende HTML-Datei, ersetzt aber keine Prüfung des tatsächlichen Quellcodes.

## 1. Projektauftrag

- **Zielgruppe:** Klasse 7, ungefähr 11–12 Jahre; teilweise geringe Lesekompetenz.
- **Thema:** „Was ist KI und wie funktioniert KI?“ – exemplarisch Bilderkennung, Trainingsdaten, Musterlernen und Textgenerierung.
- **Didaktik:** Kurze Texte, große Buttons, Fotos und visuelle Beispiele, schrittweise Freischaltung, unmittelbare Rückmeldung, optionale Vorlesefunktion.
- **Abgrenzung:** Datenschutz, Nachhaltigkeit, Kennzeichnung, Diskriminierung und verantwortliche Nutzung sind nicht der Schwerpunkt dieser Anwendung; andere Lehrkräfte behandeln diese Themen.
- **Wichtig:** Die „Mini-KI“ ist eine **didaktische Simulation**, kein trainiertes Bilderkennungsmodell. Prozentwerte bei der Wortvorhersage sind **erfunden**. Die Satzwerkstatt nutzt **vereinfachte Grammatikregeln**, kein echtes Sprachmodell.

## 2. Dateien und Ausführung

**Hauptdatei:** `ki_entdeckungsreise_klasse7.html`

Die Anwendung ist eine einzelne HTML-Datei mit eingebettetem `<style>` und einem großen eingebetteten `<script>`. Ein Build-Prozess und externe JavaScript-Bibliotheken sind im vorliegenden Dokument nicht erkennbar. Die Seite kann direkt im Browser geöffnet werden.

**Achtung bei Offline-Nutzung:** Obwohl HTML, CSS, JavaScript und mindestens ein Bild als Base64 in der Datei enthalten sind, werden weitere Fotos über **Wikimedia Commons (`Special:FilePath`) und Unsplash** geladen. Diese Fotos benötigen eine Internetverbindung, sofern sie nicht lokal eingebunden werden. Ein vollständig offlinefähiger Betrieb ist daher aktuell **nicht gewährleistet**.

Die frühere isolierte Testdatei `station4_satzwerkstatt.html` kann zur Orientierung dienen, ist aber **nicht** die maßgebliche aktuelle Gesamtfassung.

## 3. Navigationsarchitektur

Die Anwendung ist eine **Single-Page-Anwendung ohne Framework**: Der Inhalt des zentralen Containers `#main` wird bei Zustandsänderungen per `main.innerHTML = ...` neu aufgebaut.

- `page = 0`: Startseite
- `page = 1`: Station 1 – Pferdebilder / Trainingsdaten
- `page = 2`: Station 2 – Wasserzeichen / falsche Muster
- `page = 3`: Station 3 – Wahrscheinlichkeiten des nächsten Textstücks
- `page = 4`: Station 4 – Satzwerkstatt
- `page = 5`: Abschluss

**Wichtige Funktionen:**

- `render()` baut die aktuell sichtbare Ansicht auf, setzt Stationsanzeige und Fortschrittsbalken.
- `btn(label, fn, cls)` erzeugt Buttons mit `data-action`.
- `nav(...)` erzeugt Vor-/Zurück-Navigation.
- `shuffledOrder()` mischt die vier Antwort-IDs für Abschlussfragen.
- Ein zentraler `main.addEventListener('click', ...)` verarbeitet die meisten Buttons anhand von `data-action`.
- Station 4 initialisiert nach dem Rendern zusätzlich die eigenständige Satzwerkstatt-Logik über `initSatzwerkstatt(...)`.

Beim Wechsel der Hauptseiten wird `window.scrollTo(...)` aufgerufen, damit eine neue Station **oben** beginnt. Das ist insbesondere beim Übergang zu Station 2 wichtig.

**Nicht verwechseln:** Die großen Stationen (`page`) enthalten teilweise mehrere Unteransichten (Lernaufgabe → Abschlussfrage → Merksatz), ohne dass `page` sich ändert.

## 4. Station 1: Wie lernt die Mini-KI Pferde erkennen?

### Ablauf

1. Viele **ähnliche braune Pferdefotos** illustrieren das erste Training.
2. Eine kurze Animation zeigt eine **beispielhafte Menge von bis zu 1.000.000 Trainingsbildern**. Die Kinder sollen nicht glauben, dass nur die wenigen sichtbar gezeigten Fotos trainiert werden.
3. **Mehrfachauswahl-Test 1:** Zwei braune Pferde sind auszuwählen, das weiße Pferd nicht. Erst die vollständig richtige Auswahl schaltet die Fortsetzung frei.
4. Neue Trainingsbeispiele mit **mehr Vielfalt** (z. B. Schimmel, Pony, Kaltblut) werden gezeigt; die Mengenanimation läuft erneut.
5. **Mehrfachauswahl-Test 2:** Weißes Pferd und Pony auswählen, Auto ausschließen. Erst die korrekte Auswahl schaltet die Abschlussfrage frei.
6. **Abschlussfrage:** Vier plausible Aussagen über Trainingsdaten; falsche Antworten erhalten individuelle Erklärungen. Die Antworten werden beim Eintritt in die Frage gemischt.
7. **Eigene Merksatz-Ansicht:** „KI lernt Muster aus Beispielen. Wichtig sind viele und vielfältige Trainingsbilder.“ Erst anschließend weiter zu Station 2.

### Relevanter Zustand

`trained`, `horseStage`, `horseAnswer`, `phase1Choice`, `phase1Checked`, `firstSolved`, `phase2Choice`, `phase2Checked`, `expanded`, `s1Conclusion`, `s1QuizChoice`, `s1QuizFeedback`, `s1Order`.

- `s1Conclusion`: `0` = Lernaufgaben, `1` = Abschlussfrage, `2` = Merksatz.
- Die korrekte Abschlussantwort hat intern die **ID `1`**; die **sichtbare Position A–D wird gemischt**.
- Animationsfunktionen: `animateTraining()` und `animateDiverseTraining()`; die Animationen sind kurz und setzen nach Abschluss den passenden Zustand.

### Didaktische Einschränkung

Dass ein weißes Pferd nach ausschließlich braunen Trainingsbildern nicht erkannt wird, ist ein **bewusst vereinfachtes Szenario**. Daraus darf nicht abgeleitet werden, dass reale Bilderkennungsmodelle grundsätzlich nicht auf andere Fellfarben generalisieren.

## 5. Station 2: Das Wasserzeichen-Rätsel

### Ablauf

1. Sechs Pferdefotos zeigen ein kleines, halbtransparentes **„R“ als Wasserzeichen**.
2. Die Lernenden suchen das gemeinsame Merkmal mithilfe einer **beweglichen Lupe** (Maus/Touch). Erst die Entdeckung führt zur Testphase.
3. Vier Bildtests werden **nacheinander** bearbeitet. Für jeden Test wählen die Kinder „KI sagt: Pferd“ oder „KI sagt: Kein Pferd“ und drücken „Antwort prüfen“.
4. Simulierte KI-Ausgaben:

   | Testbild | Ausgabe der Mini-KI | Bewertung |
   | --- | --- | --- |
   | Pferd **mit** R | Pferd | richtig |
   | Auto **ohne** R | Kein Pferd | richtig |
   | Pferd **ohne** R | Pferd | richtig |
   | **Dasselbe Auto mit R** | Pferd | **falsch** |

5. Nach den vier Tests erscheint eine **Ergebnisübersicht mit allen vier Bildern**.
6. Eine **Abschlussfrage mit vier gemischten Antworten** fragt, warum das Auto mit R falsch erkannt wurde; falsche Antworten erhalten spezifische Erklärungen.
7. Der Merksatz steht auf einer **eigenen großen Ansicht**: „KI lernt Muster aus Beispielen. Manchmal lernt sie dabei auch unwichtige Hinweise – wie ein Wasserzeichen.“

### Relevanter Zustand

`wmStep`, `wmChoice`, `wmChecked`, `wmDiscovery`, `wmConclusion`, `wmQuizChoice`, `wmQuizFeedback`, `wmOrder`.

- `wmStep`: Fortschritt durch die vier Tests.
- `wmDiscovery`: Suche/Entdeckung/Freigabe der Testphase.
- `wmConclusion`: `0` = Experiment, `1` = Abschlussfrage, `2` = Merksatz.
- Korrekte Abschlussantwort: intern ID `1`; die sichtbare Antwortposition ist zufällig.
- Die Bildmarkierung „R“ ist ein **HTML/CSS-Overlay**, nicht zwangsläufig Bestandteil der Originalfotos.
- Die Lupe besitzt separate Pointer-/Touch-Ereignisbehandlung; beim Ändern unbedingt Maus **und** Touch testen.

## 6. Station 3: Wie verändert der Kontext Wortwahrscheinlichkeiten?

Die Kinder können zwischen zwei Kontexten umschalten (`context = 'pause'` oder `'sport'`). Ein Fahrrad dient als **Vergleichsanker**:

**Kontext 1:** „In der Pause esse ich ein …“

- 🥪 Sandwich: **65 %**
- 🥐 Croissant: **30 %**
- 🚲 Fahrrad: **5 %**

**Kontext 2:** „Auf dem Sportplatz entdecke ich …“

- ⚽ **einen Ball:** **50 %**
- 🚲 **ein Fahrrad:** **45 %**
- 🧊 **einen Kühlschrank:** **5 %**

Die unterschiedlichen Akkusativartikel sind wichtig: „**einen** Ball“, „**ein** Fahrrad“, „**einen** Kühlschrank“. Beim Pausensatz passt „ein“ zu „Sandwich“, „Croissant“ und „Fahrrad“.

Die Lernenden sehen Balken, Prozentwerte und auswählbare Fortsetzungen. Der Klick auf eine Fortsetzung zeigt eine kurze Rückmeldung. Die Prozente sind **erfundene Anschauungswerte**; das Lernziel ist, dass sich die Wahrscheinlichkeit für „Fahrrad“ durch den Kontext von 5 % auf 45 % verändert.

**Wichtig für die Übergabe:** In der aktuell vorliegenden Datei ist für Station 3 **keine eigene vierteilige Abschlussfrage und keine eigene Merksatz-Zwischenseite** erkennbar. Die Station geht über die normale Navigation weiter zu Station 4. Dies nicht stillschweigend anders dokumentieren oder beim Refactoring erfinden.

## 7. Station 4: Satzwerkstatt

### Ablauf

Die Kinder bauen einen längeren Satz schrittweise auf. **Mögliche Textbausteine bleiben sichtbar**, während grammatikalisch unpassende Optionen **ausgegraut und deaktiviert** werden. Frühere Entscheidungen beeinflussen spätere Möglichkeiten. Beispielsweise unterscheidet das Spiel zwischen Singular und Plural (etwa „Der kleine Hund … rennt“ vs. „Die kleinen Hunde … rennen“).

Die Satzwerkstatt unterstützt:

- schrittweises Auswählen von Textbausteinen;
- Anzeige der bislang aufgebauten Satzteile;
- Ausgrauen nicht passender Optionen;
- „← Einen Schritt zurück“;
- „↻ Neuer Satz“;
- Übergang zur Abschlussfrage nach Fertigstellung.

Danach folgen **vier gemischte Antwortmöglichkeiten** zur Textgenerierung und bei richtiger Antwort eine **eigene Merksatz-Ansicht**:

> Eine Sprach-KI erzeugt Texte Schritt für Schritt. Was schon dasteht, beeinflusst, welche Wörter als Nächstes wahrscheinlich sind.

### Relevanter Zustand

`built`, `step`, `s4Conclusion`, `s4QuizChoice`, `s4QuizFeedback`, `s4Order`.

- `s4Conclusion`: `0` = Satzwerkstatt, `1` = Abschlussfrage, `2` = Merksatz.
- Korrekte Abschlussantwort: intern ID `1`; die sichtbare Position wird gemischt.
- Die Satzwerkstatt besitzt eigenes HTML/CSS mit Präfixen wie `sw-` und wird über `initSatzwerkstatt(...)` initialisiert.

**Technisch besonders kritisch:** Bei einer früheren Integration führte ein JavaScript-Fehler beim Übergang **Station 3 → Station 4** dazu, dass die Anwendung nicht mehr reagierte. Änderungen an der Satzwerkstatt **immer mit diesem Übergang im echten Browser testen**, nicht nur mit einem Syntaxcheck.

**Didaktisch besonders kritisch:** Reale Sprachmodelle verwenden **keine harte Liste grammatikalisch erlaubter Wörter**. Das Ausgrauen ist eine vereinfachte Spielmechanik. Reale Modelle berechnen Wahrscheinlichkeiten für nächste **Tokens** und können auch grammatikalisch unpassende Texte erzeugen.

## 8. Abschlussfragen: Zufallsreihenfolge und Antwortprüfung

Bei Station **1, 2 und 4** sind die vier Antworten in einem Array mit festen internen IDs `0`–`3` gespeichert. `shuffledOrder()` erzeugt die sichtbare Reihenfolge. Die richtige Antwort ist derzeit jeweils **ID `1`**, aber **nicht zwingend die sichtbare Antwort B**.

**Unbedingt erhalten:**

1. Die Antworten **einmal beim Öffnen der Frage** mischen, nicht bei jedem Klick oder `render()`.
2. Beim Prüfen die **interne Antwort-ID**, nicht den angezeigten Buchstaben A–D verwenden.
3. Jede falsche Antwort muss ihre **eigene passende Erklärung** behalten.
4. Die Merksatz-Seite darf **erst nach bestätigter richtiger Antwort** erscheinen.
5. Bei „Zurück“ dürfen die Lernenden nicht in einem unbenutzbaren Zustand landen.

**Praktischer Hinweis:** Die Reihenfolge wird beim erneuten Durchlauf/Neustart neu erzeugt. Eine zufällige Mischung kann zufällig wieder dieselbe Position ergeben; sie garantiert keinen Wechsel.

## 9. Vorlesen und Bedienbarkeit

- Die Kopfzeile enthält einen Vorlese-Button (`#speak`).
- Die Funktion nutzt die **Web Speech API** (`speechSynthesis`, `SpeechSynthesisUtterance`) mit Sprache `de-DE`.
- Bei Browsern ohne Sprachsynthese wird ein Hinweis angezeigt.
- Große Buttons, deutliche Rückmeldungen und teilweise `aria`-Attribute unterstützen die Bedienbarkeit.
- Nach größeren Umbauten zusätzlich **Tastaturbedienung, Screenreader, Fokusführung, Tablet und Smartphone** prüfen; deren vollständige Barrierefreiheit ist hiermit nicht bestätigt.

## 10. Technische Wartung: Wo anfangen?

| Gewünschte Änderung | Zuerst im HTML suchen nach |
| --- | --- |
| Stationen / Navigation | `function render()`, `if(page===`, `data-action`, `a==='next'` |
| Station 1 / Pferde | `s1Conclusion`, `phase1Choice`, `phase2Choice`, `animateTraining`, `animateDiverseTraining` |
| Station 2 / Wasserzeichen | `wmDiscovery`, `wmStep`, `wmConclusion`, `wm-stamp`, `wm-pin` |
| Station 3 / Kontexte | `if(page===3)`, `context==='pause'`, `pick:` |
| Station 4 / Satzwerkstatt | `if(page===4)`, `initSatzwerkstatt`, `sw-options`, `s4Conclusion` |
| Antwortreihenfolge | `shuffledOrder`, `s1Order`, `wmOrder`, `s4Order` |
| Vorlesen | `speechSynthesis`, `id="speak"` |
| Design | `<style>`, `:root`, `.scene`, `.wm-`, `.sw-` |

Die JavaScript-Logik befindet sich in einer **IIFE** (`(()=>{'use strict'; ... })();`) und nutzt gemeinsame Zustandsvariablen. Die Variablen und die Event-Verarbeitung sind eng gekoppelt: Beim Auslagern in Module die Abhängigkeiten bewusst auflösen.

Die Datei ist durch eingebettete Bilddaten relativ groß. **Nicht die ganze Base64-Zeichenfolge in KI-Prompts kopieren**, wenn nur Text, Logik oder Layout geändert werden sollen. Stattdessen gezielt relevante Ausschnitte extrahieren oder Bilder in einen eigenen `assets/`-Ordner auslagern.

## 11. Änderungsregeln für die nächste KI

1. **Vor jeder Änderung die aktuelle HTML-Datei lesen.** Diese Dokumentation ist eine Orientierung, nicht die alleinige Quelle.
2. **Bestehende Abläufe und Freischaltbedingungen bewahren**, sofern nicht ausdrücklich eine Änderung verlangt wird.
3. **Keine Merksätze vor den Abschlussfragen anzeigen**: Das würde die Lernkontrolle vorwegnehmen.
4. Abschlussfragen **nicht durch bloße Links ersetzen**: Die Lernenden sollen die richtige Antwort selbst finden.
5. **Alle Antwortoptionen grammatikalisch korrekt** halten, wenn Grammatik nicht selbst Lerngegenstand ist.
6. **Echte Modellfunktionen nicht vortäuschen**: Simulationen und erfundene Wahrscheinlichkeiten kenntlich lassen.
7. **Beim Wechsel zur nächsten Station nach oben scrollen**.
8. Bei Änderungen an Station 4 **die Initialisierung und das Zurück-/Weiter-Verhalten** besonders prüfen.
9. Externe Bild-URLs nicht unbemerkt entfernen oder verändern; bei Offline-Anforderungen Fotos samt **Lizenz-/Quellennachweisen** lokal bereitstellen.
10. Nach jeder Änderung **neue HTML-Datei speichern und tatsächlich testen**; eine erfolgreiche JavaScript-Syntaxprüfung allein beweist nicht, dass die Klickabläufe funktionieren.

## 12. Minimaler Funktionstest nach Änderungen

- [ ] Startseite → Station 1 funktioniert.
- [ ] Erste Trainingsanimation zeigt deutlich eine große beispielhafte Bildmenge.
- [ ] Station 1: Unvollständige/falsche Mehrfachauswahl blockiert, richtige Auswahl schaltet frei.
- [ ] Zweite Trainingsanimation und zweiter Pferdetest funktionieren.
- [ ] Station 1: Abschlussfrage ist gemischt; falsche Antwort erklärt; richtige Antwort öffnet **eigene** Merksatz-Ansicht.
- [ ] Station 2 startet am **Seitenanfang**; sechs Trainingsfotos sind sichtbar.
- [ ] Lupe funktioniert mit Maus **und** Touch.
- [ ] Vier Wasserzeichen-Tests laufen in richtiger Reihenfolge; die Ergebnisübersicht zeigt alle vier Fälle.
- [ ] Station 2: Abschlussfrage → Merksatz → Station 3.
- [ ] Station 3: Beide Kontexte und die Fahrrad-Wahrscheinlichkeiten **5 % / 45 %** sind korrekt; Akkusativartikel stimmen.
- [ ] **Station 3 → Station 4** funktioniert ohne Hänger oder JavaScript-Fehler.
- [ ] Station 4: Ausgrauen, Rückgängig, Neustart und Abschluss funktionieren.
- [ ] Station 4: Abschlussfrage → eigener Merksatz → Abschlussseite.
- [ ] „Zurück“, „Weiter“, Neustart und Vorlesen funktionieren auf Desktop und Tablet.
- [ ] Keine fehlenden Fotos oder unerwarteten Scrollpositionen.

## 13. Vorschlag zur späteren Vereinheitlichung mit anderen Unterrichtsseiten

Wenn andere Lehrkräfte eigene Markdown-Unterrichtsentwürfe abgeben, ist diese Datei als **technische Spezifikation des bestehenden interaktiven Moduls** gedacht. Die Markdown-Dateien anderer Lehrkräfte können inhaltlich vereinheitlicht werden; die bereits funktionierenden HTML-Interaktionen sollten **nicht ohne Not neu erfunden** werden.

Eine spätere Projektstruktur könnte `index.html`, `styles/`, `scripts/`, `assets/` und separate Inhaltsdateien enthalten. Das ist ein **Vorschlag**, nicht der gegenwärtige Aufbau der HTML-Datei. Beim Umbau zuerst die vorhandenen Interaktionen mit Tests absichern.
