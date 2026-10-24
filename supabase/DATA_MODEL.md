# DATA_MODEL.md

Datenbankschema der KI-Führerschein-Plattform.

**Version:** 1.0  
**Stand:** 2026-10-24  
**Technologie:** Supabase (PostgreSQL) + Row Level Security (RLS)

---

## 1. Designprinzipien

- **Kein echtes Benutzerkonto für Schüler:innen** – nur Klassencode + Anzeigename (DSGVO-freundlich)
- **Skalierbar** – Jahrgänge 7–10 und Oberstufe können später ergänzt werden
- **Module aktivierbar** – Lehrkräfte/Admins können Module pro Klasse aktivieren/deaktivieren
- **Fortschritt und Leistung getrennt** – `progress` (bearbeitet) vs. `passed` (bestanden)
- **Offline-Fallback** – localStorage spiegelt Supabase-Daten lokal

---

## 2. Rollenmodell

| Rolle | Beschreibung |
|---|---|
| `superadmin` | Schulweite Verwaltung, alle Klassen, alle Lehrkräfte |
| `teacher` | Eigene Klassen verwalten, Schülerfortschritt einsehen |
| `student` | Eigene Module bearbeiten, eigenen Fortschritt sehen |

---

## 3. Tabellen

### 3.1 `schools`
Schulen (für spätere Mehrmandantenfähigkeit)

```sql
CREATE TABLE schools (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,  -- z.B. "gymnasium-musterstadt"
  created_at  timestamptz DEFAULT now()
);
```

---

### 3.2 `users`
Lehrkräfte und Admins (Supabase Auth)

```sql
-- Supabase Auth übernimmt Authentifizierung
-- Diese Tabelle erweitert auth.users um Profildaten

CREATE TABLE users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id   uuid REFERENCES schools(id),
  role        text NOT NULL CHECK (role IN ('superadmin', 'teacher')),
  display_name text NOT NULL,
  created_at  timestamptz DEFAULT now()
);
```

---

### 3.3 `classes`
Klassen einer Lehrkraft

```sql
CREATE TABLE classes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id  uuid REFERENCES users(id) ON DELETE CASCADE,
  name        text NOT NULL,        -- z.B. "7a", "7b Informatik"
  grade       int NOT NULL,         -- Jahrgang: 7, 8, 9, 10, 11, 12, 13
  join_code   text UNIQUE NOT NULL, -- 6-stelliger Code, z.B. "KI7A42"
  created_at  timestamptz DEFAULT now()
);
```

---

### 3.4 `students`
Schüler:innen (kein echtes Auth-Konto)

```sql
CREATE TABLE students (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id      uuid REFERENCES classes(id) ON DELETE CASCADE,
  display_name  text NOT NULL,       -- selbst gewählt, z.B. "Lena M."
  session_token text UNIQUE NOT NULL, -- zufälliger Token, im localStorage gespeichert
  created_at    timestamptz DEFAULT now()
);
```

> **Datenschutz:** Kein Klarname erforderlich. Schüler:innen können Pseudonyme verwenden. Kein Passwort, kein E-Mail.

---

### 3.5 `modules`
Verfügbare Lernmodule (plattformweit)

```sql
CREATE TABLE modules (
  id           text PRIMARY KEY,     -- z.B. "modul-01", "modul-02", "modul-05"
  title        text NOT NULL,        -- z.B. "Was ist KI?"
  description  text,
  grade_min    int NOT NULL DEFAULT 7,  -- ab Jahrgang
  grade_max    int,                     -- bis Jahrgang (null = alle)
  is_optional  boolean DEFAULT false,
  sort_order   int NOT NULL,
  version      text NOT NULL DEFAULT '1.0.0',
  created_at   timestamptz DEFAULT now()
);
```

**Initiale Daten:**

| id | title | grade_min | optional | sort_order |
|---|---|---|---|---|
| `modul-01` | Was ist KI? | 7 | false | 1 |
| `modul-02` | Grundsätze der KI-Nutzung | 7 | false | 2 |
| `modul-03` | Kennzeichnungspflicht | 7 | false | 3 |
| `modul-04` | Datenschutz | 7 | false | 4 |
| `modul-05` | KI & Nachhaltigkeit | 7 | true | 5 |

---

### 3.6 `class_modules`
Welche Module sind für eine Klasse aktiviert?

```sql
CREATE TABLE class_modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    uuid REFERENCES classes(id) ON DELETE CASCADE,
  module_id   text REFERENCES modules(id) ON DELETE CASCADE,
  is_active   boolean DEFAULT true,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE (class_id, module_id)
);
```

---

### 3.7 `student_module_progress`
Fortschritt eines Schülers / einer Schülerin pro Modul

```sql
CREATE TABLE student_module_progress (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid REFERENCES students(id) ON DELETE CASCADE,
  module_id   text REFERENCES modules(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'not_started'
              CHECK (status IN ('not_started','in_progress','completed','passed')),
  score       int DEFAULT 0,         -- erreichte Punkte
  max_score   int DEFAULT 0,         -- maximale Punkte des Moduls
  passed      boolean DEFAULT false,
  started_at  timestamptz,
  completed_at timestamptz,
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (student_id, module_id)
);
```

---

### 3.8 `student_task_progress`
Fortschritt pro Aufgabe / Station

```sql
CREATE TABLE student_task_progress (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid REFERENCES students(id) ON DELETE CASCADE,
  module_id   text REFERENCES modules(id) ON DELETE CASCADE,
  task_id     text NOT NULL,          -- z.B. "intro", "experiment", "q1"
  status      text NOT NULL DEFAULT 'not_started'
              CHECK (status IN ('not_started','in_progress','completed','passed','failed')),
  score       int DEFAULT 0,
  attempts    int DEFAULT 0,
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (student_id, module_id, task_id)
);
```

---

### 3.9 `certificates`
Ausgestellte Zertifikate

```sql
CREATE TABLE certificates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid REFERENCES students(id) ON DELETE CASCADE,
  display_name  text NOT NULL,        -- Name auf dem Zertifikat
  issued_at     timestamptz DEFAULT now(),
  modules_completed text[] NOT NULL,  -- Array der abgeschlossenen Modul-IDs
  UNIQUE (student_id)
);
```

---

## 4. Row Level Security (RLS)

```sql
-- Schüler:innen sehen nur eigene Daten (via session_token)
-- Lehrkräfte sehen alle Daten ihrer Klassen
-- Admins sehen alle Daten ihrer Schule

-- Beispiel: student_module_progress
ALTER TABLE student_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_own_progress" ON student_module_progress
  FOR ALL USING (
    student_id = (
      SELECT id FROM students
      WHERE session_token = current_setting('app.session_token', true)
    )
  );

CREATE POLICY "teachers_class_progress" ON student_module_progress
  FOR SELECT USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );
```

---

## 5. Skalierbarkeit

Das Schema unterstützt ohne Änderungen:

| Erweiterung | Wie |
|---|---|
| Neue Module (Jahrgang 8–10) | Neue Zeile in `modules` mit `grade_min = 8` |
| Neue Jahrgänge | `grade` in `classes` anpassen |
| Mehrere Schulen | Neue Zeile in `schools` |
| Neue Lehrkräfte | Neue Zeile in `users` mit `role = 'teacher'` |
| Oberstufe | `grade_min = 11`, `grade_max = 13` in `modules` |
| Pflicht → Optional | `is_optional` in `modules` anpassen |

---

## 6. localStorage-Fallback

Bei fehlender Internetverbindung wird der Fortschritt lokal gespeichert und beim nächsten Online-Gang synchronisiert:

```javascript
// Key-Schema
`ki_student_token`           // session_token des Schülers
`ki_progress_${moduleId}`    // Fortschritt pro Modul
`ki_tasks_${moduleId}`       // Aufgabenfortschritt pro Modul
```