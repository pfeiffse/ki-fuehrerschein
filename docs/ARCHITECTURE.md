# ARCHITECTURE.md

Systemarchitektur der KI-Führerschein-Plattform Klasse 7.

**Version:** 0.1 (Platzhalter – wird nach Analyse der Legacy-Dateien ausgearbeitet)  
**Stand:** 2026-10-24

---

## Status

> ⚠️ **Dieser Abschnitt ist ein Platzhalter.**  
> Die Architekturentscheidungen werden in Phase 2 (nach vollständiger Analyse der Legacy-HTML-Dateien) ausgearbeitet und hier dokumentiert.

---

## 1. Überblick

Die Plattform besteht aus einer gemeinsamen Shell (Dashboard, Navigation, Fortschrittslogik, Zertifikat) und eigenständigen Modulen, die über eine einheitliche Schnittstelle eingebunden werden.

```
┌─────────────────────────────────────────────────────┐
│                  Plattform-Shell                    │
│  Dashboard · Navigation · Fortschritt · Zertifikat  │
└────────────┬────────────┬────────────┬──────────────┘
             │            │            │
      ┌──────┴──┐  ┌──────┴──┐  ┌─────┴───┐
      │ Modul 1 │  │ Modul 2 │  │ Modul 3 │
      │ KI ver- │  │ KI nut- │  │ Nachhal-│
      │ stehen  │  │ zen     │  │ tigkeit │
      └─────────┘  └─────────┘  └─────────┘
```

---

## 2. Technologieentscheidungen (offen)

Folgende Entscheidungen sind noch zu treffen und zu dokumentieren:

| Bereich | Optionen | Entscheidung |
|---|---|---|
| Frontend-Framework | Vanilla JS · React · Svelte · Vue | offen |
| Styling | CSS Custom Properties · Tailwind · CSS Modules | offen |
| Fortschrittsspeicherung | localStorage · Supabase · IndexedDB | offen |
| Build-Tool | Vite · Webpack · kein Build | offen |
| Deployment | Statisch · Node.js · Supabase Edge | offen |

---

## 3. Anforderungen an die Architektur

Aus dem Übergabedokument (Abschnitt 11) abgeleitet:

### 3.1 Modularität
- Inhalte, Darstellung und Zustandslogik sind zu trennen
- Jedes Modul hat einen eigenen, isolierten Speicherbereich
- Module dürfen sich gegenseitig nicht beeinflussen

### 3.2 Wiederverwendbare Komponenten
Mindestens folgende Komponenten sind als wiederverwendbar zu implementieren:
- Plattformkopf und Modulheader
- Fortschrittsanzeige
- Aufgabenbox
- Informationsbox
- Warnhinweis
- Merksatzbox
- Quiz- und Feedbackdarstellung
- Navigation (Zurück · Weiter · Modulübersicht)

### 3.3 Keine HTML-in-JS-Verschachtelung
Vollständige HTML-Dokumente dürfen nicht als lange JavaScript-Strings ineinander verschachtelt werden.

### 3.4 Externe Fakten zentral verwalten
Fakten, Quellen und Bezugswerte (z. B. Energieverbrauch, Wasserverbrauch) sind zentral und leicht aktualisierbar zu verwalten.

### 3.5 Eindeutige IDs
Jedes Modul und jede Station erhält eindeutige IDs und Versionsnummern.

---

## 4. Datenfluss (Entwurf)

```
Nutzer-Interaktion
       │
       ▼
  Modul-Logik
  (Zustandsverwaltung)
       │
       ├──► Lokaler Speicher (localStorage / IndexedDB)
       │    └── Fortschritt, Ergebnisse, Status
       │
       └──► Plattform-Shell
            └── Dashboard-Status, Zertifikatsfreigabe
```

---

## 5. Barrierefreiheits-Architektur

- `prefers-reduced-motion` plattformweit berücksichtigen
- Fokus-Management bei Seitenwechseln
- ARIA-Rollen für dynamische Inhalte
- Vorlesefunktion als optionaler Service (Web Speech API oder extern)

---

## 6. Offene Fragen (zu klären in Phase 2)

- [ ] Soll die Plattform als Single Page Application (SPA) oder als Multi-Page Application (MPA) umgesetzt werden?
- [ ] Welche Browser-Mindestversionen werden unterstützt?
- [ ] Wie wird die Vorlesefunktion technisch umgesetzt?
- [ ] Soll Supabase für Fortschrittsspeicherung genutzt werden oder reicht localStorage?
- [ ] Wie wird das Zertifikat als PDF generiert (Print CSS, html2canvas, serverseitig)?
- [ ] Wie werden externe Medien (Videos) mit Ausweichmöglichkeit implementiert?

---

*Dieser Platzhalter wird nach Abschluss der Legacy-Analyse (Phase 1) durch die vollständige Architektur-Dokumentation ersetzt.*