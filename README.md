# KI-Führerschein Klasse 7 – Lernplattform

Modulare KI-Kompetenzplattform für Schülerinnen und Schüler der Klasse 7.

## Projektstatus

**Aktuelle Phase:** BASELINE / LEGACY SNAPSHOT  
**Stand:** 2026-10-24  
**Nächster Schritt:** Fehlende Legacy-HTML-Dateien hochladen → Prüfsummen vervollständigen → Entwicklungsphase 1 beginnen

---

## Projektziel

Aus bestehenden Einzelanwendungen entsteht eine gemeinsame, schülergerechte Plattform **„KI-Führerschein Klasse 7"**. Die Plattform ist modular aufgebaut und soll langfristig die Jahrgänge 7–10 sowie die Oberstufe abbilden können.

### Kompetenzbereiche

| Bereich | Beschreibung |
|---|---|
| Verstehen | Grundprinzipien von KI nachvollziehen |
| Anwenden | KI sinnvoll und verantwortungsvoll einsetzen |
| Reflektieren | Auswirkungen und Grenzen von KI einschätzen |
| Mitgestalten | Bewusste Entscheidungen über KI-Nutzung treffen |

---

## Stufe 1 – Klasse 7 (aktuell in Vorbereitung)

### Pflichtmodule

| Nr. | Titel | Referenzdatei |
|---|---|---|
| 1 | Was ist KI? | `legacy/ki_Fortbildung_klasse7_Borrmann.html` |
| 2 | Grundsätze der KI-Nutzung | `legacy/Modul2.html` |
| 3 | Kennzeichnungspflicht | (in Modul 2 enthalten) |
| 4 | Datenschutz | (in Modul 2 enthalten) |

### Optionales Modul / Didaktische Reserve

| Nr. | Titel | Referenzdatei |
|---|---|---|
| 5 | KI und Nachhaltigkeit | `legacy/KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html` |

### Abschluss

- KI-Führerschein Grundlagen
- Achievements für einzelne Kompetenzen
- Zertifikat nach erfolgreichem Abschluss der Pflichtmodule (`legacy/KI_Fuehrerschein_Zertifikat.html`)

---

## Repository-Struktur

```
/
├── README.md                        ← diese Datei
├── AGENT_INSTRUCTIONS.md            ← Regeln für KI-Agenten
├── PROJECT_BRIEF.md                 ← Projektzusammenfassung
├── ACCEPTANCE_CRITERIA.md           ← Abnahmekriterien
├── FILE_MANIFEST.json               ← SHA-256-Prüfsummen der Legacy-Dateien
├── CHANGELOG.md                     ← Änderungshistorie
│
├── legacy/                          ← READ ONLY – Originaldateien unverändert
│
├── docs/
│   ├── ARCHITECTURE.md              ← Systemarchitektur
│   ├── CURRICULUM.md                ← Lehrplan und Lernziele
│   ├── MODULE_MAPPING.md            ← Mapping Legacy → neue Plattform
│   └── MIGRATION_PLAN.md           ← Migrationsplan
│
├── src/                             ← Neue Implementierung (noch leer)
│   ├── app/
│   ├── modules/
│   ├── components/
│   ├── styles/
│   └── lib/
│
├── public/                          ← Statische Assets
│
└── supabase/
    └── DATA_MODEL.md                ← Datenbankschema
```

---

## Wichtige Regeln

> **⚠️ /legacy ist READ ONLY.**  
> Keine Datei unter `/legacy` darf bearbeitet, überschrieben, umbenannt, gelöscht, formatiert, optimiert, gekürzt, aufgeteilt, zusammengeführt, refaktoriert oder ersetzt werden.  
> Vor und nach jeder Entwicklungsphase sind die Prüfsummen gegen `FILE_MANIFEST.json` zu verifizieren.  
> Bei Abweichung: **STOPP** – keine weiteren Änderungen.

---

## Schnellstart für Entwickler

```bash
# Prüfsummen verifizieren (vor Entwicklungsbeginn)
sha256sum legacy/* | sort

# Ergebnis mit FILE_MANIFEST.json vergleichen
# Bei Abweichung: STOPP
```

---

## Weiterführende Dokumentation

- Inhaltliche Spezifikation: `legacy/KI_Fuehrerschein_Uebergabedokument.docx`
- Architektur: `docs/ARCHITECTURE.md`
- Lehrplan: `docs/CURRICULUM.md`
- Migrationsplan: `docs/MIGRATION_PLAN.md`
- Abnahmekriterien: `ACCEPTANCE_CRITERIA.md`