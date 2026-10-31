// PrivacyPage - Datenschutzerklärung

import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PrivacyPage() {
  const navigate = useNavigate()
  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>
      <div className="wrap" style={{ maxWidth: '50rem' }}>
        <div style={{ color: 'white', marginBottom: '1.5rem' }}>
          <h1>🔒 Datenschutz</h1>
          <p style={{ opacity: 0.8 }}>Hier erklären wir dir, welche Daten wir speichern – und warum.</p>
        </div>

        <div className="card">
          <h2>Was wir speichern</h2>
          <ul style={{ lineHeight: 2 }}>
            <li>Deinen <strong>Anzeigenamen</strong> (kann ein Pseudonym sein)</li>
            <li>Welche <strong>Module</strong> du bearbeitet hast</li>
            <li>Deinen <strong>Lernfortschritt</strong> und Punkte</li>
            <li>Ob du ein <strong>Achievement</strong> erworben hast</li>
          </ul>
          <div className="box-memory">Dein richtiger Name, dein Merksatz und dein Zertifikatsname werden <strong>nicht</strong> auf unseren Servern gespeichert.</div>
        </div>

        <div className="card">
          <h2>Warum wir das speichern</h2>
          <p>Wir speichern deinen Fortschritt, damit du dort weitermachen kannst, wo du aufgehört hast. Deine Lehrkraft kann sehen, welche Module du abgeschlossen hast.</p>
          <div className="box-info"><strong>Rechtliche Grundlage:</strong> Art. 6 Abs. 1 lit. e DSGVO (schulischer Bildungsauftrag). Du musst nicht extra zustimmen.</div>
        </div>

        <div className="card">
          <h2>Wo die Daten gespeichert werden</h2>
          <p>Deine Daten werden auf Servern in <strong>Frankfurt (Deutschland)</strong> gespeichert. Der Anbieter heißt <strong>Supabase</strong> und hält sich an die europäischen Datenschutzregeln (DSGVO).</p>
        </div>

        <div className="card">
          <h2>Deine Rechte</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '0.75rem' }}>
            {[
              { icon: '👁️', title: 'Auskunft',         text: 'Welche Daten über dich gespeichert sind.' },
              { icon: '✏️', title: 'Berichtigung',      text: 'Falsch gespeicherte Daten korrigieren.' },
              { icon: '🗑️', title: 'Löschung',          text: 'Alle deine Daten löschen lassen.' },
              { icon: '📦', title: 'Datenübertragung',  text: 'Deine Daten als Datei herunterladen.' },
            ].map(r => (
              <div key={r.title} style={{ background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: '0.875rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{r.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 'var(--fs-sm)' }}>{r.title}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', marginTop: '0.25rem' }}>{r.text}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>Um deine Rechte auszuüben, wende dich an deine Lehrkraft oder den Datenschutzbeauftragten deiner Schule.</p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--c-xp)' }}>
          <h2>Für Eltern</h2>
          <p>Diese Plattform wird im Rahmen des Schulunterrichts eingesetzt. Rechtsgrundlage: Art. 6 Abs. 1 lit. e DSGVO. Klarnamen werden nicht auf externen Servern gespeichert. Ein Auftragsverarbeitungsvertrag mit Supabase (EU-Server, Frankfurt) liegt vor.</p>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })} · Verantwortliche Stelle: Schule</p>
        </div>

        <div className="actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Zurück</button>
          <button className="btn btn-primary" onClick={() => navigate('/meine-daten')}>📦 Meine Daten verwalten</button>
        </div>
      </div>
    </div>
  )
}