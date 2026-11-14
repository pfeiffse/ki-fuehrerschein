// PrivacyPage - Datenschutzerklärung (korrigiert Nov. 2026)

import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PrivacyPage() {
  const navigate = useNavigate()
  const stand = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })

  return (
    <div style={{ background: 'linear-gradient(145deg, var(--slzb-navy), var(--slzb-blue))', minHeight: '100vh' }}>
      <div className="wrap" style={{ maxWidth: '50rem' }}>
        <div style={{ color: 'white', marginBottom: '1.5rem' }}>
          <h1>🔒 Datenschutz</h1>
          <p style={{ opacity: 0.8 }}>Hier erklären wir, welche Daten wir speichern – und warum.</p>
        </div>

        {/* Hinweis-Box */}
        <div style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.5)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-lg)', color: 'white' }}>
          <strong>⚠️ Hinweis:</strong> Diese Plattform befindet sich im Pilotbetrieb. Die Datenschutzerklärung wurde mit dem Datenschutzbeauftragten der Schule abgestimmt. Bei Fragen wende dich an deine Lehrkraft.
        </div>

        <div className="card">
          <h2>1. Verantwortliche Stelle</h2>
          <p>Verantwortlich für die Datenverarbeitung ist das <strong>Schul- und Leistungssportzentrum Berlin (SLZB)</strong>. Bei datenschutzrechtlichen Fragen wende dich an den Datenschutzbeauftragten deiner Schule.</p>
        </div>

        <div className="card">
          <h2>2. Welche Daten wir speichern</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--c-pale2)' }}>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid var(--c-border)' }}>Daten</th>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid var(--c-border)' }}>Wo</th>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid var(--c-border)' }}>Zweck</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Anzeigename (Pseudonym möglich)', 'Browser + Supabase', 'Identifikation im System'],
                ['Modulfortschritt (bestanden/nicht bestanden)', 'Browser + Supabase', 'Lernstandserfassung'],
                ['Merksätze & persönliche Notizen', 'Browser + Supabase', 'Zertifikat & Arbeitsblatt'],
                ['XP-Punkte & Achievements', 'Browser + Supabase', 'Gamification'],
                ['Klassencode (keine Klasse/Schule)', 'Supabase', 'Klassenzuordnung'],
              ].map(([d, w, z]) => (
                <tr key={d} style={{ borderBottom: '1px solid var(--c-border)' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{d}</td>
                  <td style={{ padding: '8px', color: 'var(--c-muted)', fontSize: 'var(--fs-xs)' }}>{w}</td>
                  <td style={{ padding: '8px', color: 'var(--c-muted)', fontSize: 'var(--fs-xs)' }}>{z}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="box-info" style={{ marginTop: '1rem' }}>
            <strong>Pseudonyme empfohlen:</strong> Du kannst statt deines echten Namens ein Pseudonym verwenden (z. B. „Lena7a"). Deine Lehrkraft weiß dann, wer du bist.
          </div>
        </div>

        <div className="card">
          <h2>3. Rechtsgrundlage</h2>
          <p>Die Datenverarbeitung erfolgt auf Grundlage von <strong>Art. 6 Abs. 1 lit. e DSGVO</strong> (Verarbeitung zur Erfüllung einer Aufgabe im öffentlichen Interesse – schulischer Bildungsauftrag) in Verbindung mit den Schulgesetzen des Landes Berlin.</p>
          <p style={{ marginTop: '0.5rem', color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>Eine gesonderte Einwilligung ist nicht erforderlich. Eltern werden im Rahmen der üblichen Schulkommunikation informiert.</p>
        </div>

        <div className="card">
          <h2>4. Auftragsverarbeitung (Supabase)</h2>
          <div className="box-warning">
            <strong>Wichtiger Hinweis:</strong> Für die Nutzung von Supabase als Datenbankdienstleister ist gemäß Art. 28 DSGVO ein <strong>Auftragsverarbeitungsvertrag (AVV)</strong> erforderlich. Dieser muss vor dem regulären Schulbetrieb abgeschlossen werden.
          </div>
          <p style={{ marginTop: '0.75rem' }}>Supabase Inc. betreibt Server in <strong>Frankfurt (Deutschland / EU)</strong>. Die Datenübertragung erfolgt verschlüsselt (HTTPS/TLS). Supabase ist nach SOC 2 Type II zertifiziert.</p>
          <p style={{ marginTop: '0.5rem', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
            AVV abschließen: <a href="https://supabase.com/privacy" target="_blank" rel="noopener" style={{ color: 'var(--c-teal)' }}>supabase.com/privacy</a> → „Data Processing Agreement"
          </p>
        </div>

        <div className="card">
          <h2>5. Externe Dienste</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Supabase', zweck: 'Datenbank & Authentifizierung', server: 'Frankfurt (EU)', avv: '⚠️ AVV erforderlich' },
              { name: 'GitHub Pages', zweck: 'Hosting der Webanwendung', server: 'USA (SCCs)', avv: '✅ Standardvertragsklauseln' },
              { name: 'Google Fonts', zweck: 'Schriftart Fira Sans', server: 'USA', avv: '⚠️ IP-Übertragung an Google – wird lokal eingebunden' },
              { name: 'Wikimedia Commons', zweck: 'Pferdefotos in Modul 1', server: 'USA', avv: 'CC-Lizenzen, keine personenbezogenen Daten' },
              { name: 'Unsplash', zweck: 'Illustrationsfotos', server: 'USA', avv: 'Unsplash-Lizenz, keine personenbezogenen Daten' },
            ].map(d => (
              <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', padding: '0.625rem', background: 'var(--c-pale2)', borderRadius: 'var(--r-md)', fontSize: 'var(--fs-sm)' }}>
                <strong>{d.name}</strong>
                <div>
                  <div>{d.zweck}</div>
                  <div style={{ color: 'var(--c-muted)', fontSize: 'var(--fs-xs)' }}>Server: {d.server} · {d.avv}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>6. Speicherdauer</h2>
          <p>Daten werden <strong>am Ende des Schuljahres</strong> gelöscht, spätestens jedoch nach 12 Monaten. Du kannst deine Daten jederzeit selbst löschen (siehe „Meine Daten").</p>
        </div>

        <div className="card">
          <h2>7. Deine Rechte</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '0.75rem' }}>
            {[
              { icon: '👁️', title: 'Auskunft', text: 'Welche Daten über dich gespeichert sind (Art. 15 DSGVO).' },
              { icon: '✏️', title: 'Berichtigung', text: 'Falsch gespeicherte Daten korrigieren (Art. 16 DSGVO).' },
              { icon: '🗑️', title: 'Löschung', text: 'Alle deine Daten löschen lassen (Art. 17 DSGVO).' },
              { icon: '📦', title: 'Datenübertragung', text: 'Deine Daten als Datei herunterladen (Art. 20 DSGVO).' },
            ].map(r => (
              <div key={r.title} style={{ background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: '0.875rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{r.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 'var(--fs-sm)' }}>{r.title}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', marginTop: '0.25rem' }}>{r.text}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>
            Um deine Rechte auszuüben: Nutze die Funktion „Meine Daten" in der App oder wende dich an deine Lehrkraft bzw. den Datenschutzbeauftragten der Schule.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--c-xp)' }}>
          <h2>8. Für Eltern</h2>
          <p>Diese Plattform wird im Rahmen des Schulunterrichts eingesetzt. Rechtsgrundlage: Art. 6 Abs. 1 lit. e DSGVO i.V.m. Berliner Schulgesetz. Schüler:innen können Pseudonyme verwenden. Daten werden auf EU-Servern gespeichert.</p>
          <p style={{ marginTop: '0.5rem', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
            <strong>Hinweis:</strong> Ein Auftragsverarbeitungsvertrag mit Supabase wird vor dem regulären Einsatz abgeschlossen. Bei Fragen wenden Sie sich an die Schulleitung oder den Datenschutzbeauftragten.
          </p>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', marginTop: '0.5rem' }}>Stand: {stand} · Verantwortliche Stelle: SLZB Berlin</p>
        </div>

        <div className="actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Zurück</button>
          <button className="btn btn-primary" onClick={() => navigate('/meine-daten')}>📦 Meine Daten verwalten</button>
        </div>
      </div>
    </div>
  )
}
