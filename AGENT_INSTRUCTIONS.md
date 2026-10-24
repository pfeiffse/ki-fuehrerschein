# AGENT_INSTRUCTIONS.md

Verbindliche Regeln für alle KI-Agenten, die in diesem Repository arbeiten.  
Diese Datei hat höchste Priorität und überschreibt allgemeine Standardverhalten.

---

## 1. OBERSTE REGEL: /legacy ist READ ONLY

Das Verzeichnis `/legacy` enthält die unveränderten Originaldateien des Projekts.

**Verbotene Aktionen für alle Dateien unter `/legacy`:**

- ❌ Bearbeiten oder Überschreiben von Inhalten
- ❌ Umbenennen oder Verschieben
- ❌ Löschen
- ❌ Automatisches Formatieren oder Einrücken
- ❌ Optimieren, Minifizieren oder Komprimieren
- ❌ Kürzen oder Zusammenfassen
- ❌ Aufteilen in mehrere Dateien
- ❌ Zusammenführen mit anderen Dateien
- ❌ Refaktorieren
- ❌ Durch vermeintlich bessere Versionen ersetzen

**Erlaubte Aktionen:**

- ✅ Lesen und Analysieren
- ✅ Als Referenz für neue Dateien außerhalb von `/legacy` verwenden

Wenn Code oder Inhalte aus einer Legacy-Datei übernommen werden sollen, **muss** dafür eine neue Datei außerhalb von `/legacy` erstellt werden. Das Original bleibt dauerhaft erhalten.

---

## 2. Prüfsummen-Pflicht

### Vor jeder Entwicklungsphase

1. Alle Dateien unter `/legacy` mit `sha256sum legacy/*` prüfen
2. Ergebnis mit `FILE_MANIFEST.json` vergleichen
3. Bei **jeder Abweichung**: **STOPP** – keine weiteren Änderungen durchführen, Abweichung melden

### Nach jeder Entwicklungsphase

Dieselbe Prüfung wiederholen.

### Bei Abweichung

```
STOPP.
Prüfsummenabweichung festgestellt.
Betroffene Datei: [Dateiname]
Erwartete SHA-256: [aus FILE_MANIFEST.json]
Tatsächliche SHA-256: [berechnet]
Keine weiteren Änderungen werden durchgeführt.
```

---

## 3. Entwicklungsregeln

### Neue Dateien

- Neue Implementierungen gehören ausschließlich in `/src`
- Statische Assets gehören in `/public`
- Dokumentation gehört in `/docs`

### Keine Verschachtelung von HTML in JavaScript-Strings

Vollständige HTML-Dokumente dürfen nicht als lange JavaScript-Strings ineinander verschachtelt werden (vgl. Übergabedokument Abschnitt 11).

### Modularität

Inhalte, Darstellung und Zustandslogik sind modular zu trennen.

### Eindeutige IDs

Jedes Modul erhält eindeutige IDs und Versionsnummern.

### Externe Fakten

Externe Fakten und Quellen sind zentral und leicht aktualisierbar zu verwalten.

---

## 4. Git-Regeln

### Commit-Konventionen

```
baseline: unveränderte Originalmodule vor Plattformintegration
feat(modul-1): [Beschreibung]
fix(navigation): [Beschreibung]
docs: [Beschreibung]
refactor(components): [Beschreibung]
```

### Branches

- `main` – stabiler Stand, nur nach Review
- `develop` – aktive Entwicklung
- `feature/[name]` – einzelne Features

### Kein direktes Pushen auf `main`

---

## 5. Dokumentationspflicht

Nach jeder Entwicklungsphase:

1. `CHANGELOG.md` aktualisieren
2. Betroffene Dateien in `docs/` aktualisieren
3. Prüfsummen verifizieren (siehe Abschnitt 2)

---

## 6. Didaktische Integrität

Die Legacy-Dateien sind **Referenzimplementierungen**, keine beliebig ersetzbaren Rohmaterialien.

Bei der Neuentwicklung müssen übernommen werden:
- Alle Lernziele und didaktischen Prinzipien
- Alle Interaktionstypen (Quiz, Simulation, Feedback)
- Alle Hinweise auf vereinfachte Simulationen und Näherungswerte
- Alle Barrierefreiheitsanforderungen

Die technische Umsetzung darf und soll verbessert werden – der didaktische Inhalt nicht ohne pädagogische Begründung verändert werden.

---

## 7. Zielgruppe im Blick behalten

Alle Entwicklungsentscheidungen müssen die Zielgruppe berücksichtigen:

- Klasse 7 (ca. 12–13 Jahre)
- Einschließlich Lernender mit geringer Lesekompetenz
- Touchfreundliche Bedienung (Tablet/Smartphone)
- Vollständige Tastaturbedienbarkeit
- WCAG-Barrierefreiheit

---

## 8. Keine produktive Implementierung in dieser Phase

In der aktuellen Phase (BASELINE / LEGACY SNAPSHOT) dürfen `/src` und `/supabase` **keine produktive Implementierung** enthalten.

Diese Phase dient ausschließlich:
- Sicherung der Originaldateien
- Dokumentation des Ausgangszustands
- Vorbereitung der Projektstruktur