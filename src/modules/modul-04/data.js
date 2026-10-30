// ============================================================
// Modul 04 · KI & Nachhaltigkeit – Gemeinsame Daten
// Modellwerte, Ressourcen, Situationen
// ============================================================

// ── Modellwerte (transparent gekennzeichnet) ──────────────────

export const MODELL = {
  wasserPro1000Anfragen: 15,      // Liter – didaktische Näherung, kein exakter Messwert
  toilettenLiter: 4.5,            // Liter pro Spülung
  energieProAnfrage: 0.3,         // Wh – Modellannahme
  akkuWh: 15,                     // Wh – Vergleichsakku
  wasserProAnfrageStation5: 0.3,  // ml – Modellannahme Station 5
}

// ── 18 Ressourcen-Kacheln (Station 1) ────────────────────────

export const RESSOURCEN_KACHELN = [
  { id: 'strom',        emoji: '⚡', label: 'Strom',          correct: true  },
  { id: 'wasser',       emoji: '💧', label: 'Wasser',         correct: true  },
  { id: 'rohstoffe',    emoji: '🪨', label: 'Rohstoffe',      correct: true  },
  { id: 'flaeche',      emoji: '🏗️', label: 'Fläche',         correct: true  },
  { id: 'kuehlung',     emoji: '❄️', label: 'Kühlung',        correct: true  },
  { id: 'kupfer',       emoji: '🔌', label: 'Kupfer',         correct: true  },
  { id: 'seltene',      emoji: '🧲', label: 'Seltene Erden',  correct: true  },
  { id: 'netze',        emoji: '🌐', label: 'Datennetze',     correct: true  },
  { id: 'menschen',     emoji: '👩‍💻', label: 'Menschen',       correct: true  },
  { id: 'gebaeude',     emoji: '🏢', label: 'Gebäude',        correct: true  },
  { id: 'trainingsdaten',emoji:'📚', label: 'Trainingsdaten', correct: true  },
  { id: 'transport',    emoji: '🚢', label: 'Transport',      correct: true  },
  { id: 'baeume',       emoji: '🌳', label: 'Bäume',          correct: false },
  { id: 'papier',       emoji: '📄', label: 'Papier',         correct: false },
  { id: 'schokolade',   emoji: '🍫', label: 'Schokolade',     correct: false },
  { id: 'uhrzeit',      emoji: '⏰', label: 'Uhrzeit',        correct: false },
  { id: 'spielzeug',    emoji: '🧸', label: 'Spielzeug',      correct: false },
  { id: 'shampoo',      emoji: '🧴', label: 'Shampoo',        correct: false },
]

// ── 12 Informationskarten (Station 1) ────────────────────────

export const INFO_KARTEN = [
  {
    id: 'strom',
    icon: '⚡', title: 'Strom',
    was: 'KI-Modelle laufen auf leistungsfähigen Computern. Ihre Chips benötigen Strom – ebenso die Netzwerktechnik und Kühlung.',
    wirkung: 'Je nachdem, wie der Strom erzeugt wird, entstehen dabei Treibhausgase. Große Rechenzentren benötigen besonders viel Energie.',
    vergleich: '415 Milliarden kWh',
    vergleichText: 'So viel Strom verbrauchten Rechenzentren weltweit im Jahr 2024 nach Schätzung der IEA. Das entspricht rund 1,5 % des weltweiten Stromverbrauchs – nicht nur KI, sondern allen Rechenzentren zusammen.',
    quelle: 'IEA, Energy and AI (2025)',
    quellUrl: 'https://www.iea.org/reports/energy-and-ai',
    quiz: {
      frage: 'Was bedeutet der Wert „415 Milliarden kWh"?',
      optionen: [
        { value: '0', label: 'Den Stromverbrauch einer einzigen KI-Anfrage.' },
        { value: '1', label: 'Den geschätzten Stromverbrauch aller Rechenzentren weltweit im Jahr 2024.' },
        { value: '2', label: 'Den Stromverbrauch aller KI-Anfragen weltweit pro Sekunde.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Dieser Wert bezieht sich auf alle Rechenzentren weltweit – nicht auf eine einzelne Anfrage.',
      falsch: 'Noch nicht ganz. Achte auf den Bezugswert: Wer oder was verbraucht diese Menge?',
    },
  },
  {
    id: 'wasser',
    icon: '💧', title: 'Wasser',
    was: 'Einige Rechenzentren nutzen Wasser zum Kühlen. Zusätzlich kann bei der Erzeugung ihres Stroms Wasser benötigt werden.',
    wirkung: 'Verdunstetes Kühlwasser steht vor Ort nicht sofort wieder zur Verfügung. In trockenen Regionen kann das problematisch sein.',
    vergleich: '21 Milliarden Liter',
    vergleichText: 'Ungefähr diese Wassermenge verbrauchten Googles Rechenzentren und Büros zusammen 2022. Das wären rechnerisch rund 175 Millionen Badewannen à 120 Liter. Achtung: nicht nur KI und nicht nur Rechenzentren!',
    quelle: 'Google Environmental Report 2023',
    quellUrl: 'https://www.gstatic.com/gumdrop/sustainability/google-2023-environmental-report.pdf',
    quiz: {
      frage: 'Warum ist Wasserverbrauch bei Rechenzentren ein Thema?',
      optionen: [
        { value: '0', label: 'Weil Computer Wasser trinken.' },
        { value: '1', label: 'Weil manche Rechenzentren Wasser zur Kühlung nutzen und dieses verdunstet.' },
        { value: '2', label: 'Weil KI-Anfragen direkt Wasser verbrauchen.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Kühlung ist der Hauptgrund für den Wasserverbrauch.',
      falsch: 'Noch nicht ganz. Denke daran, wie Rechenzentren gekühlt werden.',
    },
  },
  {
    id: 'rohstoffe',
    icon: '🪨', title: 'Rohstoffe',
    was: 'Für Chips, Platinen, Gehäuse, Kabel und Bauwerke braucht man mineralische Rohstoffe und andere Materialien.',
    wirkung: 'Abbau, Transport und Verarbeitung verändern Landschaften, benötigen Energie und können Böden oder Gewässer belasten.',
    vergleich: 'Nicht nur ein Chip',
    vergleichText: 'Ein KI-Rechenzentrum besteht aus Tausenden Einzelteilen. Deshalb zählen nicht nur die Rohstoffe im Chip, sondern auch Kabel, Stromversorgung, Kühlung und Gebäude.',
    quelle: 'UNEP, Global Resources Outlook 2024',
    quellUrl: 'https://www.unep.org/resources/Global-Resource-Outlook-2024',
    quiz: {
      frage: 'Warum sind Rohstoffe für KI ein Thema?',
      optionen: [
        { value: '0', label: 'Weil KI-Modelle aus Metall bestehen.' },
        { value: '1', label: 'Weil die Hardware für KI viele verschiedene Rohstoffe benötigt, deren Abbau Umweltfolgen hat.' },
        { value: '2', label: 'Weil KI Rohstoffe direkt verbraucht.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Die Hardware – nicht die Software – braucht Rohstoffe.',
      falsch: 'Noch nicht ganz. KI ist Software, aber sie läuft auf Hardware, die Rohstoffe benötigt.',
    },
  },
  {
    id: 'flaeche',
    icon: '🏗️', title: 'Fläche',
    was: 'Rechenzentren brauchen Grundstücke für Gebäude, Kühltechnik, Leitungen und manchmal Umspannwerke.',
    wirkung: 'Versiegelte Flächen nehmen Pflanzen und Tieren Lebensraum und erschweren das Versickern von Regenwasser.',
    vergleich: 'Mehrere Fußballfelder',
    vergleichText: 'Große Rechenzentrums-Campus können Flächen in dieser Größenordnung oder deutlich darüber belegen. Die Größe ist kein fester KI-Wert.',
    quelle: 'Einordnung anhand verschiedener Rechenzentrumsbauweisen',
    quellUrl: '',
    quiz: {
      frage: 'Was ist ein Umweltproblem bei der Fläche von Rechenzentren?',
      optionen: [
        { value: '0', label: 'Rechenzentren brauchen keine Fläche.' },
        { value: '1', label: 'Versiegelte Flächen nehmen Lebensraum und verhindern das Versickern von Regenwasser.' },
        { value: '2', label: 'Rechenzentren wachsen wie Pflanzen.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Flächenversiegelung ist ein bekanntes Umweltproblem.',
      falsch: 'Noch nicht ganz. Denke daran, was passiert, wenn Boden versiegelt wird.',
    },
  },
  {
    id: 'kuehlung',
    icon: '❄️', title: 'Kühlung',
    was: 'Computerchips werden beim Rechnen heiß. Luftkühlung, Flüssigkeitskühlung und andere Verfahren führen die Wärme ab.',
    wirkung: 'Kühlung benötigt technische Anlagen und häufig zusätzlichen Strom; bei manchen Systemen auch Wasser.',
    vergleich: 'Auch nachts',
    vergleichText: 'Viele Rechenzentren arbeiten rund um die Uhr. Deshalb muss die Wärme kontinuierlich abgeführt werden – anders als etwa bei einem Schulcomputer, der nach Unterrichtsschluss ausgeschaltet wird.',
    quelle: 'IEA, Energy and AI (2025)',
    quellUrl: 'https://www.iea.org/reports/energy-and-ai',
    quiz: {
      frage: 'Warum brauchen Rechenzentren Kühlung?',
      optionen: [
        { value: '0', label: 'Damit die Mitarbeiter:innen nicht schwitzen.' },
        { value: '1', label: 'Weil Computerchips beim Rechnen Wärme erzeugen, die abgeführt werden muss.' },
        { value: '2', label: 'Damit die Daten nicht warm werden.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Chips erzeugen Wärme – diese muss abgeführt werden.',
      falsch: 'Noch nicht ganz. Denke daran, was beim Rechnen physikalisch passiert.',
    },
  },
  {
    id: 'kupfer',
    icon: '🔌', title: 'Kupfer',
    was: 'Kupfer leitet Strom gut. Es steckt in Kabeln, Leiterplatten, Transformatoren und der Stromversorgung von Rechenzentren.',
    wirkung: 'Kupfer wird häufig im Tagebau gewonnen. Gestein wird gesprengt, transportiert, zerkleinert und verarbeitet. Abraum und Rückstände können Gewässer belasten.',
    vergleich: 'Riesige Tagebaue',
    vergleichText: 'Chile, Peru und die Demokratische Republik Kongo sind bedeutende Förderländer. Die Mine Chuquicamata in Chile zeigt, wie stark der Abbau eine Landschaft verändern kann.',
    quelle: 'USGS Mineral Commodity Summaries: Copper',
    quellUrl: 'https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-copper.pdf',
    quiz: {
      frage: 'Warum ist Kupferabbau ein Umweltthema?',
      optionen: [
        { value: '0', label: 'Weil Kupfer giftig ist.' },
        { value: '1', label: 'Weil der Tagebau Landschaften verändert und Gewässer belasten kann.' },
        { value: '2', label: 'Weil Kupfer selten ist.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Tagebau verändert Landschaften erheblich.',
      falsch: 'Noch nicht ganz. Denke an die Auswirkungen des Bergbaus auf die Umgebung.',
    },
  },
  {
    id: 'seltene',
    icon: '🧲', title: 'Seltene Erden',
    was: '„Seltene Erden" bezeichnet 17 chemische Elemente, darunter Neodym und Lanthan. Viele sind nicht besonders selten, aber ihre Trennung und Verarbeitung ist schwierig.',
    wirkung: 'Der Abbau und die chemische Trennung können viel Material und Wasser beanspruchen. Manche Lagerstätten enthalten problematische Begleitstoffe.',
    vergleich: '17 Elemente',
    vergleichText: 'Seltene Erden stecken etwa in starken Magneten von Motoren und anderen technischen Komponenten. Sie sind nicht der Hauptrohstoff von KI-Chips. Nicht mit Kupfer verwechseln: Kupfer gehört nicht zu den Seltenen Erden.',
    quelle: 'USGS Mineral Commodity Summaries: Rare Earths',
    quellUrl: 'https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-rare-earths.pdf',
    quiz: {
      frage: 'Was sind „Seltene Erden"?',
      optionen: [
        { value: '0', label: 'Besonders seltene Metalle, die nur in der Antarktis vorkommen.' },
        { value: '1', label: 'Eine Gruppe von 17 chemischen Elementen, deren Verarbeitung aufwendig ist.' },
        { value: '2', label: 'Ein anderer Name für Kupfer.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Seltene Erden sind eine Gruppe von 17 Elementen – nicht unbedingt selten, aber schwer zu verarbeiten.',
      falsch: 'Noch nicht ganz. Lies die Erklärung oben noch einmal.',
    },
  },
  {
    id: 'netze',
    icon: '🌐', title: 'Datennetze',
    was: 'Eine Frage wird oft über das Internet an ein Rechenzentrum geschickt; die Antwort gelangt über Netze zurück.',
    wirkung: 'Router, Glasfaserkabel, Mobilfunkanlagen und andere Netztechnik benötigen Geräte, Rohstoffe und Strom.',
    vergleich: 'Mehr als dein Handy',
    vergleichText: 'Bei einer KI-Anfrage arbeiten nicht nur dein Gerät, sondern auch Netztechnik und Computer an anderen Orten zusammen.',
    quelle: 'IEA, Energy and AI (2025)',
    quellUrl: 'https://www.iea.org/reports/energy-and-ai',
    quiz: {
      frage: 'Was passiert, wenn du eine KI-Anfrage stellst?',
      optionen: [
        { value: '0', label: 'Nur dein Gerät arbeitet.' },
        { value: '1', label: 'Dein Gerät, Netzwerktechnik und ein Rechenzentrum arbeiten zusammen.' },
        { value: '2', label: 'Die KI ist direkt auf deinem Gerät gespeichert.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Eine KI-Anfrage durchläuft viele Stationen.',
      falsch: 'Noch nicht ganz. Denke daran, wo die KI tatsächlich läuft.',
    },
  },
  {
    id: 'menschen',
    icon: '👩‍💻', title: 'Menschen',
    was: 'Menschen entwickeln KI, beschaffen Rohstoffe, bauen Chips und Rechenzentren, prüfen Ergebnisse und warten Anlagen.',
    wirkung: 'Auch Arbeitsbedingungen und die Auswirkungen auf Gemeinden in Bergbauregionen gehören zur Nachhaltigkeit.',
    vergleich: 'Viele Berufe',
    vergleichText: 'Vom Bergbau über die Chipfertigung bis zur Programmierung und Reparatur: KI entsteht durch die Arbeit vieler Menschen.',
    quelle: 'UNEP, Global Resources Outlook 2024',
    quellUrl: 'https://www.unep.org/resources/Global-Resource-Outlook-2024',
    quiz: {
      frage: 'Warum gehören Menschen zu den Ressourcen von KI?',
      optionen: [
        { value: '0', label: 'Weil KI Menschen ersetzt.' },
        { value: '1', label: 'Weil viele Menschen an der Entwicklung, dem Betrieb und der Wartung von KI beteiligt sind.' },
        { value: '2', label: 'Weil Menschen KI-Anfragen stellen.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! KI entsteht durch die Arbeit vieler Menschen in verschiedenen Berufen.',
      falsch: 'Noch nicht ganz. Denke an alle Schritte von der Rohstoffgewinnung bis zum Betrieb.',
    },
  },
  {
    id: 'gebaeude',
    icon: '🏢', title: 'Gebäude',
    was: 'Server benötigen sichere Gebäude mit Stromversorgung, Brandschutz und Kühlsystemen.',
    wirkung: 'Beim Bauen werden etwa Beton, Stahl und Dämmstoffe eingesetzt. Ihre Herstellung verbraucht Ressourcen und verursacht Emissionen.',
    vergleich: 'Eine echte Fabrik für Daten',
    vergleichText: 'Obwohl KI digital wirkt, benötigt sie reale Gebäude und große technische Anlagen.',
    quelle: 'IEA, Energy and AI (2025)',
    quellUrl: 'https://www.iea.org/reports/energy-and-ai',
    quiz: {
      frage: 'Warum braucht KI Gebäude?',
      optionen: [
        { value: '0', label: 'KI ist rein digital und braucht keine Gebäude.' },
        { value: '1', label: 'Server müssen in sicheren Gebäuden mit Strom, Kühlung und Brandschutz untergebracht werden.' },
        { value: '2', label: 'Damit Nutzer:innen die KI besuchen können.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Digitale KI braucht reale Infrastruktur.',
      falsch: 'Noch nicht ganz. Wo laufen die Server, die KI betreiben?',
    },
  },
  {
    id: 'trainingsdaten',
    icon: '📚', title: 'Trainingsdaten',
    was: 'Viele KI-Modelle werden mit großen Mengen an Texten, Bildern und anderen Daten trainiert.',
    wirkung: 'Die Verarbeitung dieser Daten benötigt Rechenleistung. Außerdem stellen sich Fragen zu Urheberrecht, Datenschutz und Qualität.',
    vergleich: 'Training und Nutzung',
    vergleichText: 'Beim Training lernt ein Modell Muster aus Daten. Bei deiner späteren Frage wird das bereits trainierte Modell erneut berechnet. Beides benötigt Ressourcen, aber nicht gleich viel.',
    quelle: 'IEA, Energy and AI (2025)',
    quellUrl: 'https://www.iea.org/reports/energy-and-ai',
    quiz: {
      frage: 'Was ist der Unterschied zwischen Training und Nutzung einer KI?',
      optionen: [
        { value: '0', label: 'Es gibt keinen Unterschied.' },
        { value: '1', label: 'Beim Training lernt die KI aus Daten; bei der Nutzung wird das fertige Modell für Anfragen verwendet.' },
        { value: '2', label: 'Training ist kostenlos, Nutzung kostet Geld.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Training und Nutzung sind verschiedene Phasen mit unterschiedlichem Ressourcenbedarf.',
      falsch: 'Noch nicht ganz. Lies die Erklärung oben noch einmal.',
    },
  },
  {
    id: 'transport',
    icon: '🚢', title: 'Transport',
    was: 'Erze, Chips, Computer, Kühlgeräte und Baumaterialien werden oft über weite Strecken transportiert.',
    wirkung: 'Schiffe, Lkw und andere Transportmittel benötigen Energie und verursachen je nach Antrieb Emissionen.',
    vergleich: 'Globale Lieferketten',
    vergleichText: 'Ein Chip kann aus Rohstoffen verschiedener Länder entstehen und mehrere Produktionsorte durchlaufen, bevor er im Rechenzentrum eingesetzt wird.',
    quelle: 'UNEP, Global Resources Outlook 2024',
    quellUrl: 'https://www.unep.org/resources/Global-Resource-Outlook-2024',
    quiz: {
      frage: 'Warum ist Transport eine Ressource für KI?',
      optionen: [
        { value: '0', label: 'Weil KI-Anfragen transportiert werden müssen.' },
        { value: '1', label: 'Weil Rohstoffe, Chips und Geräte über weite Strecken transportiert werden und das Energie kostet.' },
        { value: '2', label: 'Weil Rechenzentren in der Nähe von Häfen gebaut werden.' },
      ],
      antwort: '1',
      erklaerung: 'Richtig! Globale Lieferketten verbrauchen Energie und verursachen Emissionen.',
      falsch: 'Noch nicht ganz. Denke an die Reise der Rohstoffe und Bauteile.',
    },
  },
]

// ── Station 2: Filmcheck-Fragen ───────────────────────────────

export const FILM_FRAGEN = [
  {
    id: 'f1',
    aussage: 'KI-Anfragen werden in großen Rechenzentren mit leistungsfähigen Computerchips verarbeitet.',
    richtig: true,
    erklaerung: 'Im Film wird erklärt, dass viele leistungsfähige Chips in Rechenzentren gleichzeitig KI-Anfragen bearbeiten.',
  },
  {
    id: 'f2',
    aussage: 'Die Kühlung der Rechenzentren kann laut Film bis zu 30 Prozent der gesamten Energie verbrauchen.',
    richtig: true,
    erklaerung: 'Der Film nennt diese Schätzung. Der tatsächliche Anteil ist von Rechenzentrum und Kühltechnik abhängig.',
  },
  {
    id: 'f3',
    aussage: 'Große Technologieunternehmen veröffentlichen genaue Angaben darüber, wie viel Strom jede KI-Anfrage verbraucht.',
    richtig: false,
    erklaerung: 'Der Beitrag kritisiert, dass verlässliche und detaillierte Angaben oft nicht öffentlich sind.',
  },
  {
    id: 'f4',
    aussage: 'Ein kurzer KI-generierter Text benötigt normalerweise mehr Energie als ein KI-generiertes Video.',
    richtig: false,
    erklaerung: 'Der Film betont, dass Bilder und besonders Videos deutlich aufwendiger sein können als kurze Texte.',
  },
  {
    id: 'f5',
    aussage: 'Im Film wird die Erzeugung eines kurzen KI-Textes mit ungefähr acht Sekunden Mikrowellenbetrieb verglichen.',
    richtig: true,
    erklaerung: 'Dieser Vergleich kommt im Film vor. Er ist eine Veranschaulichung, kein fester Messwert für jede Textanfrage.',
  },
  {
    id: 'f6',
    aussage: 'Der Film empfiehlt, KI möglichst für jede Kleinigkeit zu verwenden.',
    richtig: false,
    erklaerung: 'Der Film empfiehlt, KI bewusst und nur dann einzusetzen, wenn sie wirklich sinnvoll ist.',
  },
]

// ── Station 5: Alltagssituationen ────────────────────────────

export const ALLTAG_SITUATIONEN = [
  { id: 'a01', text: 'Du lässt dir ein schwieriges Mathe-Konzept erklären, das du im Buch nicht verstehst.', kategorie: 'hilfreich', grund: 'KI kann komplexe Konzepte auf verschiedene Arten erklären.' },
  { id: 'a02', text: 'Du lässt KI deine gesamte Hausaufgabe schreiben und gibst sie als deine eigene ab.', kategorie: 'ueberflüssig', grund: 'Du lernst dabei nichts und es ist unehrlich.' },
  { id: 'a03', text: 'Du fragst KI nach dem Wetter – obwohl du aus dem Fenster schauen könntest.', kategorie: 'ueberflüssig', grund: 'Ein Blick aus dem Fenster reicht hier völlig aus.' },
  { id: 'a04', text: 'Du nutzt KI, um Ideen für ein Projekt zu sammeln, und entscheidest dann selbst.', kategorie: 'hilfreich', grund: 'KI als Ideengeber, eigene Entscheidung bleibt bei dir.' },
  { id: 'a05', text: 'Du lässt KI einen einfachen Text übersetzen, den du auch im Wörterbuch nachschlagen könntest.', kategorie: 'nachdenken', grund: 'Kommt darauf an: Lernst du dabei etwas? Ist es wirklich nötig?' },
  { id: 'a06', text: 'Du nutzt KI, um eine lange Nachricht in einfache Sprache umzuformulieren, damit deine Oma sie versteht.', kategorie: 'hilfreich', grund: 'Sinnvoller Einsatz mit echtem Nutzen.' },
  { id: 'a07', text: 'Du lässt KI ein Bild für dein Referat erstellen, obwohl du selbst zeichnen könntest.', kategorie: 'nachdenken', grund: 'Kommt auf den Kontext an – eigene Kreativität hat auch Wert.' },
  { id: 'a08', text: 'Du fragst KI nach dem Geburtsdatum einer historischen Person, die du auch in der Bibliothek nachschlagen könntest.', kategorie: 'nachdenken', grund: 'Schnell und praktisch – aber prüfe die Antwort trotzdem.' },
  { id: 'a09', text: 'Du nutzt KI, um Feedback auf deinen Aufsatz zu bekommen, bevor du ihn abgibst.', kategorie: 'hilfreich', grund: 'Gutes Werkzeug zur Verbesserung der eigenen Arbeit.' },
  { id: 'a10', text: 'Du lässt KI entscheiden, welchen Film du heute Abend schaust.', kategorie: 'ueberflüssig', grund: 'Das kannst du selbst entscheiden – und dabei lernst du deine eigenen Vorlieben kennen.' },
  { id: 'a11', text: 'Du nutzt KI, um eine Fremdsprache zu üben und Feedback auf deine Sätze zu bekommen.', kategorie: 'hilfreich', grund: 'Sinnvoller Lernpartner für Sprachübungen.' },
  { id: 'a12', text: 'Du lässt KI deine Nachrichten an Freunde schreiben.', kategorie: 'ueberflüssig', grund: 'Freundschaften leben von echter Kommunikation.' },
  { id: 'a13', text: 'Du nutzt KI, um eine komplizierte Bedienungsanleitung zu verstehen.', kategorie: 'hilfreich', grund: 'Praktische Hilfe bei wirklich schwierigen Texten.' },
]