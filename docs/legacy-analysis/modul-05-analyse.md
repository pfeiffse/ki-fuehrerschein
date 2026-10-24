# Analyse: KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html

**Modul:** 05 – KI & Nachhaltigkeit (optional)  
**Legacy-Datei:** `legacy/KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html`  
**SHA-256:** `7e36c05d3b7f967bc1843c05bf843245cc34daa57afd649abce52a881a0b5f0d`  
**Größe:** 76.203 Bytes  
**Analysiert:** 2026-10-24

---

## 1. Zweck

Interaktive Lerneinheit „KI & Nachhaltigkeit" mit 5 Stationen für den KI-Führerschein Klasse 7. Schüler:innen erkunden, welche Ressourcen KI benötigt und wann ihr Einsatz wirklich sinnvoll ist. Die Datei ist eine **Shell-Anwendung**: Sie enthält eine gemeinsame Navigation und lädt die 5 Stationen als vollständige HTML-Dokumente in einen `<iframe>` – alle Stationen sind als JavaScript-Strings inline in der Hauptdatei gespeichert.

> ⚠️ **Technische Besonderheit:** Die Stationen sind als vollständige HTML-Strings in einem JavaScript-Objekt (`pages`) gespeichert und werden per `iframe.srcdoc` geladen. Dies ist genau das Muster, das das Übergabedokument (Abschnitt 11) für die Neuentwicklung **ausdrücklich vermeiden** möchte.

---

## 2. Zielgruppe

- Klasse 7 (ca. 12–13 Jahre)
- Selbstgesteuertes Lernen, Einzelarbeit
- Keine Zeitvorgabe angegeben

---

## 3. Lernziele

| Nr. | Lernziel | Kompetenzbereich |
|---|---|---|
| M5-L1 | Schüler:innen können die Ressourcen benennen, die KI benötigt (Strom, Wasser, Rohstoffe, Fläche, Kühlung, Kupfer, Seltene Erden, Datennetze, Menschen, Gebäude, Trainingsdaten, Transport) | Verstehen |
| M5-L2 | Schüler:innen können den Energiebedarf von KI-Anfragen einordnen und mit Alltagsgeräten vergleichen | Reflektieren |
| M5-L3 | Schüler:innen können den Wasserverbrauch von KI-Anfragen hochrechnen und einordnen | Reflektieren |
| M5-L4 | Schüler:innen können erläutern, warum Kupferabbau Landschaften verändert | Verstehen |
| M5-L5 | Schüler:innen können beurteilen, wann KI-Nutzung sinnvoll ist und wann darauf verzichtet werden kann | Mitgestalten |

---

## 4. Architektur der Datei

```
KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html
├── Shell (Header + Navigation)
│   ├── Navigationsleiste: Start · 1·Ressourcen · 2·Film · 3·Wasser · 4·Akku · 5·KI im Alltag
│   └── Intro-Seite (#intro)
│
└── <iframe id="content"> – lädt Stationen via srcdoc
    ├── pages["1"] – Station 1: Ressourcen-Detektive (vollständiges HTML-Dokument)
    ├── pages["2"] – Station 2: KI unter Strom / Filmcheck (vollständiges HTML-Dokument)
    ├── pages["3"] – Station 3: Wasser (vollständiges HTML-Dokument)
    ├── pages["4"] – Station 4: Handy-Akku (vollständiges HTML-Dokument)
    └── pages["5"] – Station 5: KI im Alltag (vollständiges HTML-Dokument)
```

**Navigation zwischen Stationen:** Über `parent.postMessage('go1'/'go2'/..., '*')` aus dem iframe heraus.

---

## 5. Stationen im Detail

### Station 1 · Ressourcen-Detektive

**Lernziel:** Ressourcen hinter KI erkennen und verstehen

#### Schritt 1: Kachel-Auswahl (choose/check)
- 18 Kacheln mit Flip-Animation (3D CSS `rotateY`)
- 12 korrekte Ressourcen (Strom, Wasser, Rohstoffe, Fläche, Kühlung, Kupfer, Seltene Erden, Datennetze, Menschen, Gebäude, Trainingsdaten, Transport)
- 6 Ablenkungen (Bäume, Papier, Schokolade, Uhrzeit, Spielzeug, Shampoo)
- Grün = richtig erkannt, Rot = falsch entschieden, Blass = richtigerweise nicht angeklickt
- Wiederholungsversuch möglich (Button „Noch einmal versuchen")

#### Schritt 2: Informationskarten (detail)
- 12 Informationskarten (eine pro Ressource)
- Jede Karte enthält: Was wird benötigt? · Welche Umweltfolgen? · Alltagsvergleich mit Zahl · Quelle mit Link
- Fortschrittsbalken zeigt gelesene Karten
- Karte gilt als gelesen nach Klick auf „Gelesen"-Button
- Alle 12 Karten müssen gelesen werden, um zur Zusammenfassung zu gelangen

#### Kupfer-Sonderbehandlung (mine: true)
- 3 Fotos der Chuquicamata/Escondida-Kupfermine (Wikimedia Commons)
- Externe Bild-URLs mit Fallback-Text wenn nicht erreichbar
- Bildunterschriften mit Lizenzangaben (CC BY-SA 3.0, CC BY-SA 2.0, Public Domain)
- Hinweis: „Rückstände in einem Becken belegen nicht automatisch eine Verschmutzung umliegender Gewässer"

#### Schritt 3: Zusammenfassung (summary)
- Tabelle mit 8 Ressourcen, Vergleichswerten und Hinweisen
- ⚠️ Hinweis: „Die Zahlen sind Beispiele mit unterschiedlichen Bezugsgrößen. Man darf sie nicht als Verbrauch einer einzelnen KI-Anfrage verstehen."

**Quellen in Station 1:**
| Ressource | Quelle | URL |
|---|---|---|
| Strom | IEA, Energy and AI (2025) | https://www.iea.org/reports/energy-and-ai |
| Wasser | Google Environmental Report 2023 | https://www.gstatic.com/gumdrop/sustainability/google-2023-environmental-report.pdf |
| Rohstoffe | UNEP, Global Resources Outlook 2024 | https://www.unep.org/resources/Global-Resource-Outlook-2024 |
| Fläche | Einordnung anhand verschiedener Rechenzentrumsbauweisen | – |
| Kühlung | IEA, Energy and AI (2025) | https://www.iea.org/reports/energy-and-ai |
| Kupfer | USGS Mineral Commodity Summaries: Copper | https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-copper.pdf |
| Seltene Erden | USGS Mineral Commodity Summaries: Rare Earths | https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-rare-earths.pdf |
| Datennetze | IEA, Energy and AI (2025) | https://www.iea.org/reports/energy-and-ai |
| Menschen | UNEP, Global Resources Outlook 2024 | https://www.unep.org/resources/Global-Resource-Outlook-2024 |
| Gebäude | IEA, Energy and AI (2025) | https://www.iea.org/reports/energy-and-ai |
| Trainingsdaten | IEA, Energy and AI (2025) | https://www.iea.org/reports/energy-and-ai |
| Transport | UNEP, Global Resources Outlook 2024 | https://www.unep.org/resources/Global-Resource-Outlook-2024 |

---

### Station 2 · KI unter Strom (Filmcheck)

**Lernziel:** Energiebedarf von KI verstehen, kritisch mit Medien umgehen

#### Schritt 1: Film ansehen
- Link zur ARD Mediathek: „Wie klimaschädlich ist Künstliche Intelligenz?" (Wissen vor acht – Erde)
- Öffnet in neuem Tab
- ✅ **Ausweichmöglichkeit explizit vorhanden:** „Film funktioniert nicht? Station 2 überspringen →" (direkt zu Station 3)
- Hinweis: „Das kann an den Sicherheitseinstellungen des Schulnetzes liegen."

#### Schritt 2: Filmcheck (6 Richtig/Falsch-Fragen)
- Nur sichtbar nach Klick auf „Film angesehen"
- Radio-Buttons (Richtig/Falsch)
- Auswertung nach Klick auf „Meine Antworten überprüfen"
- Reset möglich

**Fragen und Antworten:**
| Nr. | Aussage | Antwort | Erläuterung |
|---|---|---|---|
| 1 | KI-Anfragen werden in Rechenzentren mit leistungsfähigen Chips verarbeitet | Richtig | Im Film erklärt |
| 2 | Kühlung kann bis zu 30% der gesamten Energie verbrauchen | Richtig | Film nennt diese Schätzung; abhängig von Technik |
| 3 | Große Technologieunternehmen veröffentlichen genaue Angaben zum Stromverbrauch je Anfrage | Falsch | Film kritisiert fehlende Transparenz |
| 4 | Ein kurzer KI-Text benötigt mehr Energie als ein KI-Video | Falsch | Videos deutlich aufwendiger als Texte |
| 5 | Erzeugung eines kurzen KI-Textes ≈ 8 Sekunden Mikrowellenbetrieb | Richtig | Veranschaulichung, kein fester Messwert |
| 6 | Film empfiehlt, KI für jede Kleinigkeit zu verwenden | Falsch | Film empfiehlt bewussten Einsatz |

#### Schritt 3: Abschluss
- Zusammenfassung der Lernerkenntnisse
- ⚠️ Hinweis: „Die Mikrowellen-Vergleiche aus dem Film sind Beispiele und keine festen Verbrauchswerte für jede KI-Anfrage."

---

### Station 3 · Wasser

*(Datei zu groß für vollständige Analyse – Struktur aus Übergabedokument rekonstruiert)*

**Lernziel:** Wasserverbrauch von KI-Anfragen hochrechnen und einordnen

- Hochrechnung: Wie viele KI-Anfragen stellt eine Klasse? → Wasserverbrauch berechnen
- Vergleich mit Wasser und Toilettenspülungen (didaktischer Vergleich)
- ⚠️ Näherungswerte ausdrücklich als Modellwerte kennzeichnen

---

### Station 4 · Handy-Akku

*(Datei zu groß für vollständige Analyse – Struktur aus Übergabedokument rekonstruiert)*

**Lernziel:** Energiebedarf vieler kleiner KI-Anfragen über Gerätevergleich verstehen

- Interaktives Rechenmodell
- Vergleich: Energiebedarf von KI-Anfragen vs. Handy-Akku laden
- ⚠️ Modellwerte kennzeichnen

---

### Station 5 · KI im Alltag

*(Datei zu groß für vollständige Analyse – Struktur aus Übergabedokument rekonstruiert)*

**Lernziel:** Transfer – wann ist KI-Einsatz sinnvoll?

- Reflexionsaufgabe: Wann lohnt sich KI, wann kann darauf verzichtet werden?
- Abschluss des Moduls

---

## 6. Technische Merkmale

| Merkmal | Details |
|---|---|
| **Architektur** | Shell + 5 iframe-Stationen (HTML-Strings in JS-Objekt `pages`) |
| **Speicherung** | Kein localStorage in der Shell; Stationen kommunizieren via `postMessage` |
| **Navigation** | `parent.postMessage('go1'/'go2'/..., '*')` aus iframe → Shell wechselt Station |
| **Externe Abhängigkeiten** | Kupfer-Fotos (Wikimedia Commons), ARD-Mediathek-Link |
| **Fallbacks** | ✅ Bild-Fallback (onerror), ✅ Film-Ausweichmöglichkeit |
| **Frameworks** | Keine – reines Vanilla JS + CSS |
| **Vorlesefunktion** | ❌ Nicht vorhanden |
| **Responsive** | ✅ Media Queries für ≤600px und ≤760px |
| **Druckansicht** | ✅ Druckbutton in Station 1 (Zusammenfassung) und Station 2 |
| **Barrierefreiheit** | `prefers-reduced-motion` in Station 1 berücksichtigt; Flip-Kacheln mit `aria-label` und `aria-pressed` |
| **Quellen** | ✅ Alle Fakten mit Quelle und URL versehen |
| **Modellwert-Hinweise** | ✅ Explizit vorhanden in Station 1 und Station 2 |

---

## 7. Externe Ressourcen

| Ressource | URL | Typ | Fallback |
|---|---|---|---|
| Kupfermine Chuquicamata (Luftaufnahme) | Wikimedia Commons | Bild | ✅ Text-Fallback + Link |
| Kupfermine Chuquicamata (Weltraum) | Wikimedia Commons | Bild | ✅ Text-Fallback + Link |
| Escondida-Kupfermine (NASA) | Wikimedia Commons | Bild | ✅ Text-Fallback + Link |
| ARD Mediathek – „Wie klimaschädlich ist KI?" | ardmediathek.de | Video | ✅ Station überspringen möglich |

---

## 8. Wichtige Hinweise für die Neuentwicklung

| Thema | Hinweis |
|---|---|
| **iframe-Architektur vermeiden** | Das HTML-in-JS-String-Muster ist genau das, was Übergabedokument Abschnitt 11 ausdrücklich verbietet – Stationen müssen als echte Module implementiert werden |
| **Quellen zentral verwalten** | 12 Ressourcen mit Quellen und URLs – in der neuen Plattform zentral und aktualisierbar speichern |
| **Modellwert-Hinweise erhalten** | Alle Näherungswerte müssen weiterhin als Modellwerte gekennzeichnet sein |
| **Film-Ausweichmöglichkeit** | Bereits gut implementiert – Muster für alle externen Medien übernehmen |
| **Bild-Fallbacks** | `onerror`-Handler für externe Bilder – Muster übernehmen |
| **postMessage-Navigation** | In der neuen Plattform durch einheitliche Navigationskomponente ersetzen |
| **Kein Fortschritt gespeichert** | Kein localStorage – Plattform muss Stationsfortschritt speichern |
| **Flip-Kacheln** | Didaktisch wertvolle Interaktion – als wiederverwendbare Komponente implementieren |
| **Stationen 3–5** | Vollständige Analyse erst nach direktem Zugriff auf den Quellcode möglich (Datei zu groß für vollständigen Parse) |