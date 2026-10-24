# DATA_MODEL.md

Logisches Datenmodell der KI-Führerschein-Plattform.

**Version:** 0.1 (Platzhalter – wird in Phase 2 ausgearbeitet)  
**Stand:** 2026-10-24

---

## Status

> ⚠️ **Dieser Abschnitt ist ein Platzhalter.**  
> Das Datenmodell wird in Phase 2 ausgearbeitet, nachdem die Architekturentscheidung getroffen wurde (localStorage vs. Supabase vs. IndexedDB).  
> Die folgende Struktur basiert auf dem Übergabedokument (Abschnitt 9) und ist als logisches Modell zu verstehen – unabhängig von der späteren technischen Implementierung.

---

## 1. Logisches Modell (aus Übergabedokument)

| Bereich | Benötigte Informationen |
|---|---|
| **Plattform** | Version, Gesamtfortschritt, Zertifikatsfreigabe |
| **Lernende Person** | Optional: lokaler Anzeigename für das Zertifikat |
| **Modul** | ID, Titel, Status, Fortschritt, bestanden |
| **Station / Aufgabe** | ID, Bearbeitungsstatus, Ergebnis bzw. Versuche |
| **Zertifikat** | Freigeschaltet ja/nein, Datum, Anzeigename |

---

## 2. Statuswerte

### Modul-Status

| Wert | Beschreibung |
|---|---|
| `not_started` | Noch nicht begonnen |
| `in_progress` | In Bearbeitung |
| `completed` | Abgeschlossen (alle Stationen bearbeitet) |
| `passed` | Bestanden (fachliche Mindestleistung erreicht) |

### Aufgaben-Status

| Wert | Beschreibung |
|---|---|
| `not_started` | Noch nicht begonnen |
| `in_progress` | In Bearbeitung |
| `completed` | Bearbeitet |
| `passed` | Fachlich korrekt abgeschlossen |
| `failed` | Nicht bestanden (Wiederholungsversuch möglich) |

---

## 3. Wichtige Designprinzipien

### Isolation der Speicherbereiche

Jedes Modul hat einen eigenen, isolierten Speicherbereich.  
Zustände verschiedener Module dürfen sich nicht gegenseitig überschreiben.

### Trennung von Fortschritt und Leistung

- **Fortschritt** = Welche Stationen wurden bearbeitet?
- **Leistung** = Wurden die fachlichen Anforderungen erfüllt?

Reine Textlänge oder das Bestätigen eines gelesenen Abschnitts gilt **nicht** als fachlich richtige Leistung.

### Zertifikatsfreischaltung

Das Zertifikat wird erst freigeschaltet, wenn **alle Pflichtmodule** den Status `passed` haben.

### Kein Benutzerkonto erforderlich

Die Kernerfahrung funktioniert ohne Benutzerkonto.  
Der Anzeigename für das Zertifikat ist optional und wird lokal gespeichert.

---

## 4. Vorläufige Datenstruktur (localStorage-Entwurf)

```json
{
  "platform": {
    "version": "1.0.0",
    "lastUpdated": "2026-10-24T10:00:00Z"
  },
  "learner": {
    "displayName": ""
  },
  "modules": {
    "modul-01": {
      "id": "modul-01",
      "title": "Was ist KI?",
      "status": "not_started",
      "progress": 0,
      "passed": false,
      "stations": {
        "bilderkennung": { "status": "not_started", "attempts": 0, "result": null },
        "wasserzeichen": { "status": "not_started", "attempts": 0, "result": null },
        "sprach-ki": { "status": "not_started", "attempts": 0, "result": null },
        "satzwerkstatt": { "status": "not_started", "attempts": 0, "result": null }
      }
    },
    "modul-02": {
      "id": "modul-02",
      "title": "Grundsätze der KI-Nutzung",
      "status": "not_started",
      "progress": 0,
      "passed": false,
      "stations": {
        "einstiegsreflexion": { "status": "not_started", "attempts": 0, "result": null },
        "fehlerexperiment": { "status": "not_started", "attempts": 0, "result": null },
        "quiz": { "status": "not_started", "attempts": 0, "result": null },
        "fuenf-grundsaetze": { "status": "not_started", "attempts": 0, "result": null },
        "prompt-challenge": { "status": "not_started", "attempts": 0, "result": null },
        "alltagssituationen": { "status": "not_started", "attempts": 0, "result": null },
        "abschlusstest": { "status": "not_started", "attempts": 0, "result": null },
        "persoenliche-regeln": { "status": "not_started", "attempts": 0, "result": null }
      }
    },
    "modul-05": {
      "id": "modul-05",
      "title": "KI & Nachhaltigkeit",
      "optional": true,
      "status": "not_started",
      "progress": 0,
      "passed": false,
      "stations": {
        "ressourcen": { "status": "not_started", "attempts": 0, "result": null },
        "filmcheck": { "status": "not_started", "attempts": 0, "result": null },
        "wasser": { "status": "not_started", "attempts": 0, "result": null },
        "handy-akku": { "status": "not_started", "attempts": 0, "result": null },
        "ki-im-alltag": { "status": "not_started", "attempts": 0, "result": null }
      }
    }
  },
  "certificate": {
    "unlocked": false,
    "unlockedAt": null,
    "displayName": ""
  }
}
```

> ⚠️ Diese Struktur ist ein Entwurf für den localStorage-Fall. Bei Einsatz von Supabase wird ein relationales Schema entwickelt.

---

## 5. Offene Fragen (zu klären in Phase 2)

- [ ] localStorage, Supabase oder IndexedDB?
- [ ] Soll ein optionaler Sync zwischen Geräten möglich sein?
- [ ] Wie werden Wiederholungsversuche gezählt und gespeichert?
- [ ] Wie wird das Datum der Zertifikatsfreischaltung gespeichert und angezeigt?
- [ ] Soll der Fortschritt zurückgesetzt werden können?
- [ ] Wie wird mit veralteten Datenstrukturen (Versionsmigration) umgegangen?

---

*Dieser Platzhalter wird nach der Architekturentscheidung in Phase 2 durch das vollständige Datenbankschema ersetzt.*