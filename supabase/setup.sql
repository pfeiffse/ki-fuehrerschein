-- ============================================================
-- KI-Führerschein · Supabase Setup
-- Dieses Script einmalig im Supabase SQL-Editor ausführen.
-- ============================================================

-- ── Tabellen ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schools (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id    uuid REFERENCES schools(id),
  role         text NOT NULL CHECK (role IN ('superadmin','teacher')),
  display_name text NOT NULL,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS classes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  uuid REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  grade      int  NOT NULL CHECK (grade BETWEEN 7 AND 13),
  join_code  text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id      uuid REFERENCES classes(id) ON DELETE CASCADE,
  display_name  text NOT NULL,
  session_token text UNIQUE NOT NULL,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  id          text PRIMARY KEY,
  title       text NOT NULL,
  description text,
  grade_min   int  NOT NULL DEFAULT 7,
  grade_max   int,
  is_optional boolean DEFAULT false,
  sort_order  int  NOT NULL,
  version     text NOT NULL DEFAULT '1.0.0',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class_modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    uuid REFERENCES classes(id) ON DELETE CASCADE,
  module_id   text REFERENCES modules(id) ON DELETE CASCADE,
  is_active   boolean DEFAULT true,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE (class_id, module_id)
);

CREATE TABLE IF NOT EXISTS student_module_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid REFERENCES students(id) ON DELETE CASCADE,
  module_id    text REFERENCES modules(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'not_started'
               CHECK (status IN ('not_started','in_progress','completed','passed')),
  score        int  DEFAULT 0,
  max_score    int  DEFAULT 0,
  passed       boolean DEFAULT false,
  started_at   timestamptz,
  completed_at timestamptz,
  updated_at   timestamptz DEFAULT now(),
  UNIQUE (student_id, module_id)
);

CREATE TABLE IF NOT EXISTS student_task_progress (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  module_id  text REFERENCES modules(id) ON DELETE CASCADE,
  task_id    text NOT NULL,
  status     text NOT NULL DEFAULT 'not_started'
             CHECK (status IN ('not_started','in_progress','completed','passed','failed')),
  score      int  DEFAULT 0,
  attempts   int  DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (student_id, module_id, task_id)
);

CREATE TABLE IF NOT EXISTS certificates (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        uuid REFERENCES students(id) ON DELETE CASCADE,
  display_name      text NOT NULL,
  issued_at         timestamptz DEFAULT now(),
  modules_completed text[] NOT NULL,
  UNIQUE (student_id)
);

-- ── Row Level Security aktivieren ────────────────────────────

ALTER TABLE students                ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_task_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates            ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes                 ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies (via DO-Block um Duplikate zu vermeiden) ─────

DO $$ BEGIN

  -- Lehrkräfte: eigene Klassen verwalten
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'teachers_own_classes' AND tablename = 'classes') THEN
    CREATE POLICY teachers_own_classes ON classes FOR ALL USING (teacher_id = auth.uid());
  END IF;

  -- Schüler:innen: anonym beitreten
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_insert_students' AND tablename = 'students') THEN
    CREATE POLICY anon_insert_students ON students FOR INSERT WITH CHECK (true);
  END IF;

  -- Schüler:innen: eigene Daten lesen (via session_token in App gefiltert)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_select_students' AND tablename = 'students') THEN
    CREATE POLICY anon_select_students ON students FOR SELECT USING (true);
  END IF;

  -- Lehrkräfte: Schüler:innen ihrer Klassen sehen
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'teachers_see_students' AND tablename = 'students') THEN
    CREATE POLICY teachers_see_students ON students FOR SELECT
      USING (class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid()));
  END IF;

  -- Schüler:innen: eigenen Modul-Fortschritt schreiben/lesen
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_all_module_progress' AND tablename = 'student_module_progress') THEN
    CREATE POLICY anon_all_module_progress ON student_module_progress FOR ALL WITH CHECK (true);
  END IF;

  -- Lehrkräfte: Modul-Fortschritt ihrer Klassen sehen
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'teachers_see_module_progress' AND tablename = 'student_module_progress') THEN
    CREATE POLICY teachers_see_module_progress ON student_module_progress FOR SELECT
      USING (student_id IN (
        SELECT s.id FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = auth.uid()
      ));
  END IF;

  -- Schüler:innen: eigenen Aufgaben-Fortschritt schreiben/lesen
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_all_task_progress' AND tablename = 'student_task_progress') THEN
    CREATE POLICY anon_all_task_progress ON student_task_progress FOR ALL WITH CHECK (true);
  END IF;

  -- Lehrkräfte: Aufgaben-Fortschritt ihrer Klassen sehen
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'teachers_see_task_progress' AND tablename = 'student_task_progress') THEN
    CREATE POLICY teachers_see_task_progress ON student_task_progress FOR SELECT
      USING (student_id IN (
        SELECT s.id FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = auth.uid()
      ));
  END IF;

END $$;

-- ── Klassen: anon darf join_code lesen (für Schüler-Anmeldung) ──

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_select_classes' AND tablename = 'classes') THEN
    CREATE POLICY anon_select_classes ON classes FOR SELECT USING (true);
  END IF;
END $$;

-- ── Initialdaten: Module ──────────────────────────────────────

INSERT INTO modules (id, title, description, grade_min, is_optional, sort_order, version)
VALUES
  ('modul-01', 'Was ist KI?',
   'Trainingsdaten, Mustererkennung, Sprach-KI und Satzwerkstatt.',
   7, false, 1, '1.0.0'),
  ('modul-02', 'Grundsätze der KI-Nutzung',
   'Fehler erkennen, Prompts formulieren, Verantwortung übernehmen.',
   7, false, 2, '1.0.0'),
  ('modul-03', 'Kennzeichnungspflicht',
   'Wann und wie KI-generierte Inhalte gekennzeichnet werden müssen.',
   7, false, 3, '1.0.0'),
  ('modul-04', 'Datenschutz',
   'Welche Daten bei der KI-Nutzung geschützt werden müssen.',
   7, false, 4, '1.0.0'),
  ('modul-05', 'KI & Nachhaltigkeit',
   'Ressourcen, Energiebedarf und bewusster Umgang mit KI.',
   7, true, 5, '1.0.0')
ON CONFLICT (id) DO NOTHING;

-- ── Hilfsfunktion: Klassencode prüfen ────────────────────────

CREATE OR REPLACE FUNCTION get_class_by_code(code text)
RETURNS TABLE (id uuid, name text, grade int, school_id uuid)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT id, name, grade, school_id
  FROM classes
  WHERE join_code = upper(trim(code))
  LIMIT 1;
$$;

-- ── Fertig ────────────────────────────────────────────────────
-- Alle Tabellen, Policies und Initialdaten wurden angelegt.
-- Nächster Schritt: Lehrkraft über Supabase Auth anlegen.