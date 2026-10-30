// ============================================================
// KI-Führerschein · Datenschutzerklärung
// Art. 13 DSGVO – Information der betroffenen Personen
// Sprache: einfach und verständlich für Klasse 7
// ============================================================

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoBox, WarningBox, MemoryBox } from '../../components/ui/InfoBox.jsx'

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap" style={{ maxWidth: '800px' }}>

        {/* Hero */}
        <div className="hero">
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein · Klasse 7</div>
          <h1 style={{ margin: '8px 0 6px' }}>🔒 Datenschutz</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Hier erklären wir dir, welche Daten wir speichern – und warum.
          </p>
        </div>

        {/* Einfache Erklärung für Schüler:innen */}
        <div className="card">
          <h2>Was passiert mit meinen Daten?</h2>
          <MemoryBox>
            Wir speichern so wenig wie möglich. Dein richtiger Name kommt nie auf unsere Server.
          </MemoryBox>

          <InfoBox title="Was wir speichern:">
            <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: 2 }}>
              <li>Deinen <strong>Anzeigenamen</strong> (das kann ein Pseudonym sein)</li>
              <li>Welche <strong>Module</strong> du bearbeitet hast</li>
              <li>Wie viele <strong>Punkte</strong> du erreicht hast</li>
              <li>Ob du ein <strong>Achievement</strong> erworben hast</li>
            </ul>
          </InfoBox>

          <InfoBox title="Was wir NICHT speichern:">
            <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: 2 }}>
              <li>Deinen <strong>richtigen Namen</strong></li>
              <li>Deine <strong>E-Mail-Adresse</strong></li>
              <li>Dein <strong>Geburtsdatum</strong></li>
              <li>Deinen <strong>persönlichen Merksatz</strong> (bleibt nur auf deinem Gerät)</li>
              <li>Deine <strong>IP-Adresse</strong></li>
              <li>Informationen über andere Personen</li>
            </ul>
          </InfoBox>

          <WarningBox title="Wichtig:">
            Gib bei der Anmeldung <strong>kein echtes Passwort</strong> ein, das du auch woanders verwendest.
            Nutze am besten ein Pseudonym statt deines echten Namens.
          </WarningBox>
        </div>

        {/* Warum speichern wir das? */}
        <div className="card">
          <h2>Warum speichern wir diese Daten?</h2>
          <p>
            Wir speichern deinen Fortschritt, damit du dort weitermachen kannst, wo du aufgehört hast –
            auch wenn du den Browser schließt oder das Gerät wechselst.
          </p>
          <p>
            Deine Lehrkraft kann sehen, welche Module du abgeschlossen hast.
            So kann sie dir besser helfen.
          </p>
          <InfoBox title="Rechtliche Grundlage:">
            Die Schule verarbeitet diese Daten im Rahmen ihres gesetzlichen Bildungsauftrags
            (Art. 6 Abs. 1 lit. e DSGVO). Du musst dafür nicht extra zustimmen.
          </InfoBox>
        </div>

        {/* Wo werden die Daten gespeichert? */}
        <div className="card">
          <h2>Wo werden die Daten gespeichert?</h2>
          <p>
            Deine Daten werden auf Servern in <strong>Frankfurt (Deutschland)</strong> gespeichert.
            Der Anbieter heißt <strong>Supabase</strong> und hält sich an die europäischen Datenschutzregeln (DSGVO).
          </p>
          <p>
            Dein persönlicher Merksatz und dein Name für das Zertifikat werden
            <strong> nur auf deinem eigenen Gerät</strong> gespeichert – sie verlassen deinen Browser nicht.
          </p>
        </div>

        {/* Deine Rechte */}
        <div className="card">
          <h2>Deine Rechte</h2>
          <p>Du hast das Recht:</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--space-md)' }}>
            {[
              { icon: '👁️', title: 'Auskunft', text: 'Du kannst jederzeit fragen, welche Daten über dich gespeichert sind.' },
              { icon: '✏️', title: 'Berichtigung', text: 'Wenn etwas falsch gespeichert ist, kann es korrigiert werden.' },
              { icon: '🗑️', title: 'Löschung', text: 'Du kannst verlangen, dass alle deine Daten gelöscht werden.' },
              { icon: '📦', title: 'Datenübertragung', text: 'Du kannst deine Daten als Datei herunterladen.' },
            ].map(r => (
              <div key={r.title} style={{
                display:      'flex',
                gap:          '14px',
                alignItems:   'flex-start',
                padding:      '14px',
                background:   'var(--color-platform-pale)',
                borderRadius: 'var(--radius-lg)',
                border:       '1px solid var(--color-border)',
              }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <strong style={{ color: 'var(--color-platform-teal)' }}>{r.title}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                    {r.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <InfoBox>
            Um deine Rechte auszuüben, wende dich an deine Lehrkraft oder
            den Datenschutzbeauftragten deiner Schule.
          </InfoBox>
        </div>

        {/* Für Eltern */}
        <div className="card" style={{ borderLeft: '5px solid var(--color-gold-dark)' }}>
          <h2>Informationen für Eltern</h2>
          <p>
            Diese Plattform wird im Rahmen des Schulunterrichts eingesetzt.
            Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. e DSGVO
            (Verarbeitung zur Wahrnehmung einer Aufgabe im öffentlichen Interesse).
          </p>
          <p>
            Es werden ausschließlich für den Unterrichtszweck notwendige Daten erhoben.
            Klarnamen werden nicht auf externen Servern gespeichert.
            Ein Auftragsverarbeitungsvertrag mit Supabase (EU-Server, Frankfurt) liegt vor.
          </p>
          <p>
            Bei Fragen wenden Sie sich bitte an die Schule oder den schulischen Datenschutzbeauftragten.
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)' }}>
            Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })} ·
            Verantwortliche Stelle: Schule (Träger der Plattform)
          </p>
        </div>

        {/* Meine Daten verwalten */}
        <div className="card">
          <h2>Meine Daten verwalten</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
            Du kannst deine Daten jederzeit herunterladen oder löschen.
          </p>
          <div className="actions">
            <button className="btn btn-ghost" onClick={() => navigate('/meine-daten')}>
              📦 Meine Daten herunterladen
            </button>
            <button className="btn" onClick={() => navigate('/meine-daten')}
              style={{ background: 'var(--color-error-light)', color: 'var(--color-error)', border: `1px solid var(--color-error)` }}>
              🗑️ Meine Daten löschen
            </button>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Zurück</button>
        </div>
      </div>
    </div>
  )
}