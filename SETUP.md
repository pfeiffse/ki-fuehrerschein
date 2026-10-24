# SETUP.md

Schritt-für-Schritt-Anleitung zur Einrichtung der KI-Führerschein-Plattform.

**Stand:** 2026-10-24

---

## Voraussetzungen

- Node.js 18+ und npm
- Ein [Supabase](https://supabase.com)-Konto (kostenlos)
- Ein moderner Browser (Chrome, Firefox, Edge, Safari)

---

## 1. Supabase einrichten

### 1.1 Neues Projekt anlegen

1. Auf [supabase.com](https://supabase.com) anmelden
2. „New Project" klicken
3. Name: `ki-fuehrerschein`, Region: `eu-central-1` (Frankfurt)
4. Sicheres Datenbankpasswort wählen und notieren

### 1.2 Datenbank einrichten

1. Im Supabase-Dashboard: **SQL Editor** öffnen
2. Inhalt von `supabase/setup.sql` vollständig hineinkopieren
3. „Run" klicken – alle Tabellen und Policies werden angelegt

### 1.3 API-Schlüssel kopieren

1. Im Dashboard: **Settings → API**
2. Folgende Werte notieren:
   - **Project URL** (z. B. `https://abcdef.supabase.co`)
   - **anon / public Key** (beginnt mit `eyJ...`)

### 1.4 Erste Lehrkraft anlegen

1. Im Dashboard: **Authentication → Users → Invite user**
2. E-Mail-Adresse der Lehrkraft eingeben
3. Nach Registrierung: Im **SQL Editor** ausführen:

```sql
INSERT INTO users (id, school_id, role, display_name)
VALUES (
  'UUID-DER-LEHRKRAFT',   -- aus Authentication → Users kopieren
  NULL,                    -- school_id später ergänzen
  'teacher',
  'Frau/Herr Mustermann'
);
```

---

## 2. Plattform lokal starten

### 2.1 Abhängigkeiten installieren

```bash
cd src
npm install
```

### 2.2 Umgebungsvariablen eintragen

```bash
cp .env.example .env.local
```

Dann `.env.local` öffnen und ausfüllen:

```
VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...DEIN-ANON-KEY...
```

### 2.3 Entwicklungsserver starten

```bash
npm run dev
```

Die Plattform ist dann unter `http://localhost:5173` erreichbar.

---

## 3. Erste Klasse anlegen

1. Unter `http://localhost:5173/lehrer` mit der Lehrkraft-E-Mail anmelden
2. „+ Neue Klasse" klicken
3. Klassenname (z. B. „7a") und Jahrgang (7) eingeben
4. Den generierten **Klassencode** notieren und an die Schüler:innen weitergeben

---

## 4. Schüler:innen anmelden

1. Plattform unter `http://localhost:5173` öffnen
2. Klassencode eingeben (z. B. `KI7A42`)
3. Anzeigenamen eingeben (Klarname oder Pseudonym)
4. Loslegen!

---

## 5. Produktion / Deployment

### Option A: Statisches Hosting (empfohlen für Schulen)

```bash
cd src
npm run build
```

Die fertige Plattform liegt in `public/dist/` und kann auf jedem Webserver gehostet werden:
- Schulserver (Apache, nginx)
- [Netlify](https://netlify.com) (kostenlos)
- [Vercel](https://vercel.com) (kostenlos)

### Option B: Schul-Intranet

Die `public/dist/`-Dateien in das Schulnetz-Verzeichnis kopieren.  
Supabase läuft weiterhin in der Cloud – nur die Frontend-Dateien liegen lokal.

---

## 6. Prüfsummen verifizieren (vor jeder Entwicklungsphase)

```bash
sha256sum legacy/* | sort
```

Ergebnis mit `FILE_MANIFEST.json` vergleichen.  
Bei Abweichung: **STOPP** – keine weiteren Änderungen.

---

## 7. Projektstruktur

```
/
├── legacy/          ← READ ONLY – Originaldateien
├── src/             ← React + Vite Plattform
│   ├── app/         ← Seiten und Router
│   ├── components/  ← Wiederverwendbare UI-Komponenten
│   ├── lib/         ← Supabase, Auth, Fortschritt
│   ├── modules/     ← Modulinhalte
│   └── styles/      ← Designsystem
├── docs/            ← Projektdokumentation
├── supabase/        ← Datenbankschema und Setup
└── public/          ← Statische Assets
```

---

## 8. Häufige Fragen

**Funktioniert die Plattform ohne Internet?**  
Ja – der Fortschritt wird lokal im Browser gespeichert (localStorage) und beim nächsten Online-Gang mit Supabase synchronisiert.

**Müssen Schüler:innen ein Konto erstellen?**  
Nein – nur Klassencode + Anzeigename. Kein Passwort, keine E-Mail.

**Können Schüler:innen Pseudonyme verwenden?**  
Ja – ausdrücklich empfohlen aus Datenschutzgründen.

**Wie füge ich ein neues Modul hinzu?**  
1. Neue Zeile in `supabase/modules`-Tabelle einfügen
2. Neue Seite in `src/app/pages/` anlegen
3. Route in `src/app/App.jsx` ergänzen
4. Modul in `src/app/pages/Dashboard.jsx` zur `MODULES`-Liste hinzufügen