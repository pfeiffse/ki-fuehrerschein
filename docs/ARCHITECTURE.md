# ARCHITECTURE.md

Systemarchitektur der KI-Führerschein-Plattform.

**Version:** 1.0  
**Stand:** 2026-10-24

---

## 1. Technologieentscheidungen

| Bereich | Entscheidung | Begründung |
|---|---|---|
| **Frontend-Framework** | React 18 + Vite 5 | Komponentenbasiert, schnell, breite Unterstützung |
| **Routing** | React Router v6 | Standard für React SPAs |
| **Styling** | CSS Custom Properties + globale Klassen | Kein Build-Overhead, orientiert an Legacy-Modulen |
| **Fortschrittsspeicherung** | Supabase (primär) + localStorage (Fallback) | Geräteübergreifend, offline-fähig |
| **Authentifizierung Schüler:innen** | Klassencode + Anzeigename (kein Auth-Konto) | DSGVO-freundlich, kein Passwort nötig |
| **Authentifizierung Lehrkräfte** | Supabase Auth (E-Mail + Passwort) | Sicher, einfach zu verwalten |
| **Datenbank** | Supabase (PostgreSQL) mit RLS | Skalierbar, kostenlos bis mittlere Größe |
| **Deployment** | Statische Dateien (Vite Build) | Läuft auf jedem Webserver, Schulserver-kompatibel |

---

## 2. Systemübersicht

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React SPA (Vite Build)                  │   │
│  │                                                      │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │  Schüler-   │  │   Modul-     │  │  Lehrer-   │  │   │
│  │  │  Dashboard  │  │   Seiten     │  │  Dashboard │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │         Gemeinsame Komponenten                  │ │   │
│  │  │  Header · ModuleNav · Quiz · TextTask · Badge   │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐                  │   │
│  │  │  lib/auth.js │  │lib/progress  │                  │   │
│  │  │  lib/supabase│  │.js           │                  │   │
│  │  └──────┬───────┘  └──────┬───────┘                  │   │
│  └─────────┼────────────────┼──────────────────────────┘   │
│            │                │                               │
│  ┌─────────▼────────────────▼──────────────────────────┐   │
│  │              localStorage (Offline-Cache)            │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│                    Supabase (Cloud)                          │
│                                                             │
│  ┌─────────────────┐  ┌──────────────────────────────────┐  │
│  │  Auth Service   │  │  PostgreSQL Datenbank            │  │
│  │  (Lehrkräfte)   │  │  + Row Level Security            │  │
│  └─────────────────┘  └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Verzeichnisstruktur

```
src/
├── index.html              ← HTML-Shell
├── package.json            ← Abhängigkeiten
├── vite.config.js          ← Build-Konfiguration
├── .env.example            ← Vorlage für Umgebungsvariablen
│
├── app/
│   ├── main.jsx            ← React-Einstiegspunkt
│   ├── App.jsx             ← Router und Session-Management
│   └── pages/
│       ├── JoinPage.jsx         ← Schüler-Anmeldung
│       ├── Dashboard.jsx        ← Modulübersicht
│       ├── Modul02Page.jsx      ← Modul 2 (vollständig)
│       ├── TeacherLogin.jsx     ← Lehrkraft-Anmeldung
│       ├── TeacherDashboard.jsx ← Klassenübersicht + CSV
│       └── NotFound.jsx         ← 404
│
├── components/
│   ├── layout/
│   │   ├── PlatformHeader.jsx   ← Sticky Plattformkopf
│   │   └── ModuleNav.jsx        ← Navigation + Fortschritt
│   ├── ui/
│   │   ├── InfoBox.jsx          ← TaskBox, InfoBox, WarningBox, MemoryBox
│   │   ├── Merksatz.jsx         ← Merksatz-Komponente
│   │   └── Badge.jsx            ← Achievement-Badge
│   └── quiz/
│       ├── Quiz.jsx             ← Single-Choice mit Wiederholung
│       └── TextTask.jsx         ← Freitext-Aufgabe
│
├── lib/
│   ├── supabase.js         ← Supabase-Client
│   ├── auth.js             ← Authentifizierung
│   └── progress.js         ← Fortschrittsverwaltung
│
├── modules/
│   ├── modul-01/           ← (Phase 4)
│   ├── modul-05/           ← (Phase 4)
│   └── abschluss/          ← (Phase 5)
│
└── styles/
    ├── tokens.css          ← Design Tokens
    └── global.css          ← Globale Styles
```

---

## 4. Routing

| Pfad | Komponente | Zugang |
|---|---|---|
| `/` | `JoinPage` | Öffentlich (Weiterleitung wenn angemeldet) |
| `/dashboard` | `Dashboard` | Schüler:in (Session erforderlich) |
| `/modul/01` | `Modul01Page` | Schüler:in |
| `/modul/02` | `Modul02Page` | Schüler:in |
| `/modul/03` | `Modul03Page` | Schüler:in |
| `/modul/04` | `Modul04Page` | Schüler:in |
| `/modul/05` | `Modul05Page` | Schüler:in |
| `/zertifikat` | `CertificatePage` | Schüler:in (nur wenn berechtigt) |
| `/lehrer` | `TeacherLogin` | Öffentlich |
| `/lehrer/dashboard` | `TeacherDashboard` | Lehrkraft (Auth erforderlich) |

---

## 5. Datenfluss

### Schüler:in – Anmeldung

```
JoinPage
  → studentJoin(joinCode, displayName)
    → Supabase: classes WHERE join_code = ?
    → Supabase: INSERT students
    → localStorage: session_token speichern
  → App.jsx: student state setzen
  → Redirect: /dashboard
```

### Schüler:in – Fortschritt speichern

```
Modul02Page (Quiz/TextTask)
  → completeTask(moduleId, taskId, score)
    → localStorage: sofort aktualisieren (Offline-Fallback)
    → Supabase: UPSERT student_task_progress
  → completeModule(moduleId, score, maxScore)
    → Supabase: UPSERT student_module_progress
```

### Lehrkraft – Klassenübersicht

```
TeacherDashboard
  → getTeacherProfile() → Supabase Auth + users-Tabelle
  → supabase.from('classes').select() WHERE teacher_id = auth.uid()
  → supabase.from('students').select() WHERE class_id IN (...)
  → supabase.from('student_module_progress').select() WHERE student_id IN (...)
  → Tabelle rendern + CSV-Export
```

---

## 6. Designsystem

### Farbpalette

| Token | Wert | Verwendung |
|---|---|---|
| `--color-platform` | `#064c87` | Plattform-Shell, Header |
| `--color-modul-01` | `#2859d8` | Modul 1 – KI verstehen |
| `--color-modul-02` | `#6d3fc0` | Modul 2 – KI sinnvoll nutzen |
| `--color-modul-03` | `#5c6bc0` | Modul 3 – Kennzeichnungspflicht |
| `--color-modul-04` | `#1565c0` | Modul 4 – Datenschutz |
| `--color-modul-05` | `#087f83` | Modul 5 – Nachhaltigkeit |
| `--color-abschluss` | `#b8860b` | Abschluss/Zertifikat (Gold) |

### Wiederverwendbare Komponenten

| Komponente | Klasse/Datei | Entspricht Legacy |
|---|---|---|
| Aufgabenbox | `.box-task` / `TaskBox` | `.task` (Modul 2) |
| Informationsbox | `.box-info` / `InfoBox` | `.note` (Modul 2) |
| Warnhinweis | `.box-warning` / `WarningBox` | `.warning` (Modul 2) |
| Merksatz | `.box-memory` / `MemoryBox` | `.memory` (Modul 2) |
| Quiz | `Quiz.jsx` | `.quiz` + `.quiz-btn` (Modul 2) |
| Freitext | `TextTask.jsx` | `.text-task` (Modul 2) |
| Fortschritt | `.progress-shell/.bar` | `.progress-shell/.bar` (Modul 2) |
| Badge | `Badge.jsx` | `.badge` (Modul 2) |

---

## 7. Barrierefreiheit

| Anforderung | Umsetzung |
|---|---|
| Tastaturbedienbarkeit | Alle interaktiven Elemente fokussierbar, `focus-visible` Styles |
| Fokusmarkierung | `:focus-visible` mit 3px Outline |
| ARIA | `aria-label`, `aria-live`, `role`, `aria-valuenow` an Schlüsselstellen |
| Farbunabhängigkeit | Feedback nie nur über Farbe (immer Text + Icon) |
| Reduzierte Animation | `prefers-reduced-motion` in `tokens.css` |
| Touchfreundlich | Mindesthöhe 48px für alle Buttons |
| Alt-Texte | Für alle relevanten Bilder (in Modulen zu ergänzen) |

---

## 8. Skalierbarkeit

### Neues Modul hinzufügen

1. `supabase/modules`-Tabelle: neue Zeile einfügen
2. `src/app/pages/ModulXXPage.jsx` anlegen
3. Route in `src/app/App.jsx` ergänzen
4. Eintrag in `MODULES`-Array in `src/app/pages/Dashboard.jsx`
5. Fertig – kein Schema-Change nötig

### Neuen Jahrgang hinzufügen

1. Module mit `grade_min = 8` (o.ä.) in Supabase anlegen
2. Dashboard filtert automatisch nach `grade` der Klasse
3. Keine Code-Änderung nötig

### Mehrere Schulen

- `schools`-Tabelle bereits vorhanden
- RLS isoliert Daten pro Schule automatisch