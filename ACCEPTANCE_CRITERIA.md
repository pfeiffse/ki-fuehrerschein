# ACCEPTANCE_CRITERIA.md

Verbindliche Abnahmekriterien für die KI-Führerschein-Plattform Klasse 7.  
Quelle: Übergabedokument Abschnitt 12, ergänzt um projektspezifische Anforderungen.

**Version:** 1.0  
**Stand:** 2026-10-24

---

## 1. Navigation und Erreichbarkeit

| ID | Kriterium | Priorität |
|---|---|---|
| NAV-01 | Alle Pflichtmodule sind über eine gemeinsame Startseite erreichbar | MUSS |
| NAV-02 | Das optionale Modul (KI & Nachhaltigkeit) ist über die Startseite erreichbar | SOLL |
| NAV-03 | Innerhalb jedes Moduls gibt es einheitliche Navigation: Zurück · Weiter · Modulübersicht | MUSS |
| NAV-04 | Die Plattform ist vollständig per Tastatur bedienbar | MUSS |
| NAV-05 | Fokusmarkierungen sind sichtbar | MUSS |

---

## 2. Fortschritt und Speicherung

| ID | Kriterium | Priorität |
|---|---|---|
| PROG-01 | Der aktuelle Bearbeitungsstand wird nach einem Neuladen korrekt wiederhergestellt | MUSS |
| PROG-02 | Abgeschlossene Module werden eindeutig gekennzeichnet | MUSS |
| PROG-03 | Jedes Modul hat einen eigenen Speicherbereich – Zustände überschreiben sich nicht gegenseitig | MUSS |
| PROG-04 | Statuswerte: noch nicht begonnen · in Bearbeitung · abgeschlossen · bestanden | MUSS |
| PROG-05 | Bearbeitungsfortschritt und fachliche Leistung werden getrennt behandelt | MUSS |
| PROG-06 | Reine Textlänge oder Bestätigen eines gelesenen Abschnitts gilt nicht automatisch als fachlich richtige Leistung | MUSS |

---

## 3. Quiz und Feedback

| ID | Kriterium | Priorität |
|---|---|---|
| QUIZ-01 | Quiz-Feedback ist verständlich formuliert | MUSS |
| QUIZ-02 | Lernorientierte Wiederholungsversuche sind möglich | MUSS |
| QUIZ-03 | Rückmeldungen werden nicht ausschließlich über Farbe kommuniziert | MUSS |
| QUIZ-04 | Feedback ermöglicht eine lernorientierte Korrektur | MUSS |

---

## 4. Zertifikat

| ID | Kriterium | Priorität |
|---|---|---|
| CERT-01 | Das Zertifikat ist vor Erfüllung der Abschlussbedingungen gesperrt | MUSS |
| CERT-02 | Das Zertifikat wird erst freigeschaltet, wenn alle definierten Pflichtmodule erfolgreich abgeschlossen sind | MUSS |
| CERT-03 | Das Zertifikat ist druckbar bzw. als PDF speicherbar | MUSS |
| CERT-04 | Das Zertifikat bildet die übergreifenden Kompetenzbereiche ab: KI verstehen · KI verantwortlich zum Lernen nutzen · Ergebnisse kritisch prüfen · Auswirkungen von KI reflektieren | SOLL |

---

## 5. Technische Qualität

| ID | Kriterium | Priorität |
|---|---|---|
| TECH-01 | Die Plattform funktioniert in aktuellen Desktop- und Tablet-Browsern responsiv | MUSS |
| TECH-02 | Die Kernerfahrung benötigt kein Benutzerkonto | MUSS |
| TECH-03 | Die Plattform funktioniert bei lokalem Betrieb ohne Benutzerkonto | MUSS |
| TECH-04 | Externe Medien und Bilder sind als solche erkennbar | MUSS |
| TECH-05 | Externe Medien besitzen eine sinnvolle Ausweichmöglichkeit, wenn sie nicht erreichbar sind | MUSS |

---

## 6. Didaktische Integrität

| ID | Kriterium | Priorität |
|---|---|---|
| DID-01 | Alle didaktischen Simulationen werden als vereinfachte Simulationen gekennzeichnet | MUSS |
| DID-02 | Alle Näherungswerte werden als Modellwerte gekennzeichnet | MUSS |
| DID-03 | Es wird deutlich darauf hingewiesen, dass keine echte KI trainiert wird | MUSS |
| DID-04 | Dargestellte Wahrscheinlichkeiten werden als didaktisch vereinfacht gekennzeichnet | MUSS |
| DID-05 | Quellen und Bezugswerte für Fakten (z. B. Wasserverbrauch, Energiebedarf) sind transparent gekennzeichnet | MUSS |

---

## 7. Barrierefreiheit

| ID | Kriterium | Priorität |
|---|---|---|
| A11Y-01 | Alt-Texte für alle relevanten Bilder vorhanden | MUSS |
| A11Y-02 | Animationen werden bei entsprechender Systemeinstellung (`prefers-reduced-motion`) reduziert | MUSS |
| A11Y-03 | Texte sind in einfacher Sprache verfasst | SOLL |
| A11Y-04 | Optionale Vertiefungsinformationen statt sehr langer Pflichttexte | SOLL |
| A11Y-05 | Vorlesefunktion plattformweit einheitlich vorhanden | KANN |
| A11Y-06 | Schaltflächen sind groß und touchfreundlich | MUSS |

---

## 8. Integrität der Legacy-Dateien

| ID | Kriterium | Priorität |
|---|---|---|
| LEG-01 | Alle Dateien unter `/legacy` sind unverändert (SHA-256 stimmt mit `FILE_MANIFEST.json` überein) | MUSS |
| LEG-02 | Keine produktive Implementierung in `/src` oder `/supabase` vor Abschluss der Analysephase | MUSS |

---

## Abnahme-Checkliste (Kurzform)

```
[ ] NAV-01  Alle Module über Startseite erreichbar
[ ] NAV-04  Vollständige Tastaturbedienbarkeit
[ ] PROG-01 Fortschritt bleibt nach Neuladen erhalten
[ ] PROG-02 Abgeschlossene Module eindeutig gekennzeichnet
[ ] PROG-05 Fortschritt und Leistung getrennt
[ ] QUIZ-01 Verständliches Quiz-Feedback
[ ] QUIZ-02 Wiederholungsversuche möglich
[ ] CERT-01 Zertifikat vor Abschluss gesperrt
[ ] CERT-03 Zertifikat druckbar / als PDF speicherbar
[ ] TECH-01 Responsiv auf Desktop und Tablet
[ ] TECH-02 Kein Benutzerkonto erforderlich
[ ] DID-01  Simulationen als solche gekennzeichnet
[ ] DID-02  Näherungswerte als Modellwerte gekennzeichnet
[ ] A11Y-01 Alt-Texte vorhanden
[ ] A11Y-06 Touchfreundliche Schaltflächen
[ ] LEG-01  Legacy-Prüfsummen stimmen überein
```