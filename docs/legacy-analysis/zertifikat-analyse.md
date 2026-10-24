# Analyse: KI_Fuehrerschein_Zertifikat.html

**Datei:** Abschluss – KI-Führerschein-Zertifikat  
**Legacy-Datei:** `legacy/KI_Fuehrerschein_Zertifikat.html`  
**SHA-256:** `31bbfaa9d2f56c2fefa3bb74432c98ae83fdcc54b3ead015c2533ac64ee8999f`  
**Größe:** 5.203 Bytes  
**Analysiert:** 2026-10-24

---

## 1. Zweck

Eigenständige HTML-Datei zur Ausstellung eines Zertifikats nach Abschluss der KI-Führerschein-Module. Aktuell auf die fünf Nachhaltigkeitsstationen ausgerichtet. In der neuen Plattform soll daraus das übergreifende Abschlusszertifikat des gesamten KI-Führerscheins werden.

---

## 2. Zielgruppe

- Schüler:innen der Klasse 7 nach erfolgreichem Abschluss der Pflichtmodule
- Lehrkräfte (Drucken und Unterschreiben)

---

## 3. Lernziele / Funktion

Das Zertifikat hat keine Lernfunktion im engeren Sinne, sondern dient als:
- Motivationselement und Abschlussritual
- Nachweis der bearbeiteten Inhalte
- Druckbares/speicherbares Dokument (PDF)

---

## 4. Struktur und Inhalt

### Steuerbereich (`.controls`) – wird beim Drucken ausgeblendet

| Element | Beschreibung |
|---|---|
| Namensfeld | Texteingabe, max. 90 Zeichen, Placeholder „Vor- und Nachname" |
| Datumsfeld | `<input type="date">`, vorbelegt mit aktuellem Datum |
| Drucken-Button | `window.print()` – öffnet Druckdialog / PDF-Speicherung |

### Zertifikat (`.paper` / `.frame`)

| Element | Inhalt |
|---|---|
| Eyebrow | „KI & NACHHALTIGKEIT" |
| Symbol | 🌿 🏅 🤖 |
| Überschrift | „KI-FÜHRERSCHEIN" |
| Untertitel | „Zertifikat für einen bewussten und nachhaltigen Umgang mit KI" |
| Name | Dynamisch aus Eingabefeld (`#printedName`) |
| Beschreibungstext | „hat die fünf Lernstationen erfolgreich bearbeitet und sich damit beschäftigt, wie künstliche Intelligenz verantwortungsvoll eingesetzt werden kann." |
| Kompetenz-Badges | 5 Skill-Pills (siehe unten) |
| Motto | „KI soll mir helfen, besser zu lernen und zu arbeiten – nicht das Denken und Lernen für mich übernehmen." |
| Zusatztext | „Ich überlege vor jeder KI-Anfrage, ob sie wirklich notwendig und sinnvoll ist." |
| Fußzeile | Datum (dynamisch) · Unterschrift der Lehrkraft |
| Tiny-Footer | „KI-Führerschein · Klasse 7 · KI & Nachhaltigkeit" |

### Kompetenz-Badges (aktuell – Nachhaltigkeit)

| Badge | Text |
|---|---|
| 🔎 | Ressourcen erkennen |
| 🎬 | KI kritisch hinterfragen |
| 💧 | Wasserverbrauch verstehen |
| 🔋 | Energiebedarf einschätzen |
| 🌍 | Umweltbewusst entscheiden |

---

## 5. Technische Merkmale

| Merkmal | Details |
|---|---|
| **Dateigröße** | 5.203 Bytes – sehr kompakt |
| **Speicherung** | Kein localStorage – Name und Datum nur im DOM |
| **Externe Abhängigkeiten** | Keine |
| **Frameworks** | Keine – reines Vanilla JS + CSS |
| **Druckfunktion** | `window.print()` – Browser-Druckdialog |
| **Drucklayout** | `@page { size: A4 landscape; margin: 9mm }` |
| **Druckstyles** | `.controls` ausgeblendet, `.paper` auf 100% Breite, Schatten entfernt |
| **Responsive** | Media Query für ≤650px (Fußzeile, Abstände) |
| **Dynamik** | Name und Datum werden live aktualisiert (`input`-Events) |
| **Datum-Format** | Eingabe: `YYYY-MM-DD` → Anzeige: `DD.MM.YYYY` |
| **Vorlesefunktion** | Nicht vorhanden |
| **Barrierefreiheit** | Minimal – kein ARIA, kein Fokus-Management |

---

## 6. JavaScript-Logik

```javascript
// Datum vorbelegen
dateInput.value = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

// Live-Update bei Eingabe
function update() {
  document.getElementById('printedName').textContent =
    nameInput.value.trim() || 'Dein Name';
  // Datum: YYYY-MM-DD → DD.MM.YYYY
  let [y, m, day] = d.split('-');
  document.getElementById('printedDate').textContent = `${day}.${m}.${y}`;
}
nameInput.addEventListener('input', update);
dateInput.addEventListener('input', update);
```

---

## 7. Designmerkmale

| Element | Wert |
|---|---|
| Primärfarbe | `#087f83` (Teal) |
| Sekundärfarbe | `#16495b` (Dunkles Petrol) |
| Akzentfarbe | `#ffda76` (Gold) |
| Hintergrund | `#f0fafb` (Hellblau-Grün) |
| Rahmen | 8px solid Teal + 3px solid Gold (outline, offset -18px) |
| Hintergrund Zertifikat | `radial-gradient(circle at 50% 0%, #e8f7f4, transparent 55%)` |
| Schrift | Arial, Helvetica, sans-serif |
| Name-Unterstreichung | 2px solid Gold |

---

## 8. Anpassungsbedarf für die neue Plattform

### Inhaltliche Anpassungen (zwingend)

| Bereich | Aktuell | Neu (Plattform) |
|---|---|---|
| Eyebrow | „KI & NACHHALTIGKEIT" | „KI-FÜHRERSCHEIN KLASSE 7" o.ä. |
| Beschreibungstext | „hat die fünf Lernstationen erfolgreich bearbeitet..." | „hat alle Pflichtmodule des KI-Führerscheins erfolgreich abgeschlossen..." |
| Kompetenz-Badges | 5 Nachhaltigkeits-Kompetenzen | 4 übergreifende Kompetenzbereiche (s.u.) |
| Tiny-Footer | „KI & Nachhaltigkeit" | „KI-Führerschein Klasse 7" |

### Neue Kompetenz-Badges (laut Übergabedokument Abschnitt 10)

| Badge | Text |
|---|---|
| 🔎 | KI verstehen |
| 🛠️ | KI verantwortlich zum Lernen nutzen |
| ✅ | Ergebnisse kritisch prüfen |
| 🌍 | Auswirkungen von KI reflektieren |

### Technische Anpassungen

| Bereich | Anforderung |
|---|---|
| **Freischaltlogik** | Zertifikat darf erst nach Abschluss aller Pflichtmodule zugänglich sein – aktuell keine Sperrung vorhanden |
| **Name aus Plattform** | Name sollte aus Plattform-Profil vorausgefüllt werden (optional) |
| **Datum** | Datum der Freischaltung aus Plattform-Daten |
| **Druckstyles** | Bestehende A4-Landscape-Styles sind gut – übernehmen |
| **Barrierefreiheit** | ARIA-Attribute ergänzen |

---

## 9. Wichtige Hinweise für die Neuentwicklung

| Thema | Hinweis |
|---|---|
| **Gestalterisch geeignet** | Das Übergabedokument bestätigt: „Das vorhandene Zertifikat ist gestalterisch als Ausgangspunkt geeignet" |
| **Keine Sperrlogik** | Aktuell kann das Zertifikat jederzeit geöffnet und gedruckt werden – Plattform muss Sperrung implementieren |
| **Drucklayout übernehmen** | A4 Landscape, 9mm Margin, `.controls` ausblenden – bewährtes Muster |
| **Farben anpassen** | Teal/Gold-Farbschema passt zur Plattform-Farbpalette (Gold für Abschluss laut Designsystem) |
| **Kompetenz-Badges ersetzen** | Nachhaltigkeits-spezifische Badges durch die 4 übergreifenden Kompetenzbereiche ersetzen |
| **Live-Update-Muster** | Name/Datum-Live-Update ist gutes UX-Muster – übernehmen |