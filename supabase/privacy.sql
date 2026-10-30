-- ============================================================
-- KI-Führerschein · Datenschutz-SQL
-- Art. 17 DSGVO – Recht auf Löschung
-- Automatische Löschfristen + Admin-Funktionen
-- ============================================================
-- Dieses Script im Supabase SQL-Editor ausführen.
-- ============================================================

-- ── 1. Löschfrist-Spalte zu students hinzufügen ──────────────

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS delete_after date;

-- Standardmäßig: Löschung nach 2 Jahren
-- (kann pro Klasse angepasst werden)
UPDATE students
  SET delete_after = (created_at + INTERVAL '2 years')::date
  WHERE delete_after IS NULL;

-- Trigger: Neue Schüler:innen bekommen automatisch Löschfrist
CREATE OR REPLACE FUNCTION set_delete_after()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.delete_after IS NULL THEN
    NEW.delete_after := (NOW() + INTERVAL '2 years')::date;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_delete_after ON students;
CREATE TRIGGER trg_set_delete_after
  BEFORE INSERT ON students
  FOR EACH ROW EXECUTE FUNCTION set_delete_after();

-- ── 2. Automatische Löschung abgelaufener Datensätze ─────────
-- Wird täglich ausgeführt (via pg_cron oder manuell)

CREATE OR REPLACE FUNCTION delete_expired_students()
RETURNS TABLE(deleted_count int, deleted_names text[])
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  expired_ids uuid[];
  cnt         int;
  names       text[];
BEGIN
  -- Abgelaufene Schüler:innen finden
  SELECT array_agg(id), array_agg(display_name)
    INTO expired_ids, names
    FROM students
    WHERE delete_after <= CURRENT_DATE;

  IF expired_ids IS NULL OR array_length(expired_ids, 1) = 0 THEN
    RETURN QUERY SELECT 0, ARRAY[]::text[];
    RETURN;
  END IF;

  -- Fortschritt löschen
  DELETE FROM student_task_progress   WHERE student_id = ANY(expired_ids);
  DELETE FROM student_module_progress WHERE student_id = ANY(expired_ids);
  DELETE FROM certificates            WHERE student_id = ANY(expired_ids);

  -- Schüler:innen löschen
  DELETE FROM students WHERE id = ANY(expired_ids);

  GET DIAGNOSTICS cnt = ROW_COUNT;
  RETURN QUERY SELECT cnt, names;
END;
$$;

-- Manuell ausführen (z.B. am Schuljahresende):
-- SELECT * FROM delete_expired_students();

-- ── 3. Admin-Funktion: Einzelne Schüler:in löschen ───────────

CREATE OR REPLACE FUNCTION admin_delete_student(student_id_param uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  student_name text;
BEGIN
  SELECT display_name INTO student_name
    FROM students WHERE id = student_id_param;

  IF student_name IS NULL THEN
    RETURN 'Fehler: Schüler:in nicht gefunden.';
  END IF;

  DELETE FROM student_task_progress   WHERE student_id = student_id_param;
  DELETE FROM student_module_progress WHERE student_id = student_id_param;
  DELETE FROM certificates            WHERE student_id = student_id_param;
  DELETE FROM students                WHERE id         = student_id_param;

  RETURN 'Gelöscht: ' || student_name;
END;
$$;

-- Verwendung (nur für Lehrkräfte/Admins im SQL-Editor):
-- SELECT admin_delete_student('UUID-DER-SCHUELERIN');

-- ── 4. Admin-Funktion: Gesamte Klasse löschen ────────────────

CREATE OR REPLACE FUNCTION admin_delete_class(class_id_param uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  class_name  text;
  student_ids uuid[];
  cnt         int;
BEGIN
  SELECT name INTO class_name
    FROM classes WHERE id = class_id_param;

  IF class_name IS NULL THEN
    RETURN 'Fehler: Klasse nicht gefunden.';
  END IF;

  SELECT array_agg(id) INTO student_ids
    FROM students WHERE class_id = class_id_param;

  IF student_ids IS NOT NULL THEN
    DELETE FROM student_task_progress   WHERE student_id = ANY(student_ids);
    DELETE FROM student_module_progress WHERE student_id = ANY(student_ids);
    DELETE FROM certificates            WHERE student_id = ANY(student_ids);
    DELETE FROM students                WHERE class_id   = class_id_param;
    GET DIAGNOSTICS cnt = ROW_COUNT;
  ELSE
    cnt := 0;
  END IF;

  RETURN 'Klasse ' || class_name || ': ' || cnt || ' Schüler:innen gelöscht.';
END;
$$;

-- Verwendung:
-- SELECT admin_delete_class('UUID-DER-KLASSE');

-- ── 5. Übersicht: Wer wird wann gelöscht? ────────────────────

CREATE OR REPLACE VIEW deletion_schedule AS
SELECT
  c.name                                    AS klasse,
  s.display_name                            AS anzeigename,
  s.created_at::date                        AS beigetreten,
  s.delete_after                            AS loeschung_am,
  (s.delete_after - CURRENT_DATE)           AS tage_bis_loeschung,
  CASE
    WHEN s.delete_after <= CURRENT_DATE     THEN 'ÜBERFÄLLIG'
    WHEN s.delete_after <= CURRENT_DATE + 30 THEN 'IN 30 TAGEN'
    ELSE 'OK'
  END                                       AS status
FROM students s
JOIN classes  c ON s.class_id = c.id
ORDER BY s.delete_after ASC;

-- Verwendung (Lehrkraft-Übersicht):
-- SELECT * FROM deletion_schedule;
-- SELECT * FROM deletion_schedule WHERE status = 'ÜBERFÄLLIG';

-- ── 6. Datenschutz-Log (optional) ────────────────────────────
-- Protokolliert Löschvorgänge ohne personenbezogene Daten

CREATE TABLE IF NOT EXISTS privacy_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action      text NOT NULL,   -- 'delete_student', 'delete_class', 'export'
  class_name  text,            -- Klassenname (kein Personenbezug)
  count       int,             -- Anzahl betroffener Datensätze
  performed_at timestamptz DEFAULT now(),
  performed_by text            -- 'student_self', 'teacher', 'auto_expiry'
);

-- RLS für Log: nur Lehrkräfte können lesen
ALTER TABLE privacy_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'teachers_read_privacy_log'
    AND tablename = 'privacy_log'
  ) THEN
    CREATE POLICY teachers_read_privacy_log ON privacy_log
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- ── 7. Löschfrist pro Klasse anpassen ────────────────────────
-- Beispiel: Klasse 7a bekommt Löschfrist 31.08.2028

-- UPDATE students
--   SET delete_after = '2028-08-31'
--   WHERE class_id = (SELECT id FROM classes WHERE name = '7a');

-- ── Fertig ────────────────────────────────────────────────────
-- Zusammenfassung der angelegten Objekte:
-- - Spalte:    students.delete_after
-- - Trigger:   trg_set_delete_after
-- - Funktion:  delete_expired_students()
-- - Funktion:  admin_delete_student(uuid)
-- - Funktion:  admin_delete_class(uuid)
-- - View:      deletion_schedule
-- - Tabelle:   privacy_log