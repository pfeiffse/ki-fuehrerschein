-- ============================================================
-- KI-Führerschein · Test-Accounts und Admin-Setup
-- Im Supabase SQL-Editor ausführen
-- ============================================================

-- ── 1. Testschule anlegen ─────────────────────────────────────

INSERT INTO schools (id, name, slug)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Testschule Musterstadt',
  'testschule-musterstadt'
)
ON CONFLICT (id) DO NOTHING;

-- ── 2. Lehrkraft-Profil anlegen ───────────────────────────────
-- Voraussetzung: Lehrkraft muss zuerst über Authentication → Users → Invite angelegt werden
-- Dann UUID hier eintragen:

-- Beispiel (UUID nach Invite anpassen):
-- INSERT INTO users (id, school_id, role, display_name)
-- VALUES (
--   'HIER-UUID-DER-LEHRKRAFT-EINTRAGEN',
--   '00000000-0000-0000-0000-000000000001',
--   'teacher',
--   'Frau Musterfrau'
-- )
-- ON CONFLICT (id) DO NOTHING;

-- ── 3. Admin-Profil anlegen ───────────────────────────────────
-- Voraussetzung: Admin muss zuerst über Authentication → Users → Invite angelegt werden

-- INSERT INTO users (id, school_id, role, display_name)
-- VALUES (
--   'HIER-UUID-DES-ADMINS-EINTRAGEN',
--   '00000000-0000-0000-0000-000000000001',
--   'superadmin',
--   'Admin Mustermann'
-- )
-- ON CONFLICT (id) DO NOTHING;

-- ── 4. Testklassen anlegen ────────────────────────────────────
-- Hinweis: teacher_id muss nach Schritt 2 eingetragen werden
-- Für Tests ohne Lehrkraft: teacher_id = NULL erlaubt

INSERT INTO classes (id, school_id, teacher_id, name, grade, join_code)
VALUES
  ('00000000-0000-0000-0001-000000000001',
   '00000000-0000-0000-0000-000000000001',
   NULL, '7a (Demo)', 7, 'DEMO7A'),
  ('00000000-0000-0000-0001-000000000002',
   '00000000-0000-0000-0000-000000000001',
   NULL, '7b (Demo)', 7, 'DEMO7B'),
  ('00000000-0000-0000-0001-000000000003',
   '00000000-0000-0000-0000-000000000001',
   NULL, '8a (Demo)', 8, 'DEMO8A')
ON CONFLICT (join_code) DO NOTHING;

-- ── 5. Testschüler:innen anlegen ──────────────────────────────

INSERT INTO students (class_id, display_name, session_token)
SELECT
  c.id,
  s.name,
  gen_random_uuid()::text
FROM classes c
CROSS JOIN (VALUES
  ('Lena M.'),
  ('Max K.'),
  ('Sara T.'),
  ('Jonas B.'),
  ('Mia S.')
) AS s(name)
WHERE c.join_code = 'DEMO7A'
AND NOT EXISTS (
  SELECT 1 FROM students st WHERE st.class_id = c.id AND st.display_name = s.name
);

INSERT INTO students (class_id, display_name, session_token)
SELECT
  c.id,
  s.name,
  gen_random_uuid()::text
FROM classes c
CROSS JOIN (VALUES
  ('Tim R.'),
  ('Anna L.'),
  ('Felix W.')
) AS s(name)
WHERE c.join_code = 'DEMO7B'
AND NOT EXISTS (
  SELECT 1 FROM students st WHERE st.class_id = c.id AND st.display_name = s.name
);

-- ── 6. Beispiel-Fortschritt für Demo ─────────────────────────

-- Modul 1 für Lena M. als bestanden markieren
INSERT INTO student_module_progress (student_id, module_id, status, score, max_score, passed, started_at, completed_at)
SELECT
  s.id,
  'modul-01',
  'passed',
  100, 100, true,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day'
FROM students s
JOIN classes c ON s.class_id = c.id
WHERE c.join_code = 'DEMO7A' AND s.display_name = 'Lena M.'
ON CONFLICT (student_id, module_id) DO NOTHING;

-- Modul 2 für Lena M. als in Bearbeitung
INSERT INTO student_module_progress (student_id, module_id, status, score, max_score, passed, started_at)
SELECT
  s.id,
  'modul-02',
  'in_progress',
  45, 100, false,
  NOW() - INTERVAL '1 day'
FROM students s
JOIN classes c ON s.class_id = c.id
WHERE c.join_code = 'DEMO7A' AND s.display_name = 'Lena M.'
ON CONFLICT (student_id, module_id) DO NOTHING;

-- Modul 1 für Max K. als bestanden
INSERT INTO student_module_progress (student_id, module_id, status, score, max_score, passed, started_at, completed_at)
SELECT
  s.id,
  'modul-01',
  'passed',
  100, 100, true,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days'
FROM students s
JOIN classes c ON s.class_id = c.id
WHERE c.join_code = 'DEMO7A' AND s.display_name = 'Max K.'
ON CONFLICT (student_id, module_id) DO NOTHING;

-- ── 7. Übersicht der angelegten Daten ────────────────────────

SELECT
  c.name AS klasse,
  c.join_code,
  c.grade AS jahrgang,
  COUNT(s.id) AS schueler_anzahl
FROM classes c
LEFT JOIN students s ON s.class_id = c.id
WHERE c.school_id = '00000000-0000-0000-0000-000000000001'
GROUP BY c.name, c.join_code, c.grade
ORDER BY c.grade, c.name;