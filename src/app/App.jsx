// ============================================================
// KI-Führerschein · App-Router
// ============================================================

import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { studentRestore, getTeacherSession } from '../lib/auth.js'

import PlatformHeader    from '../components/layout/PlatformHeader.jsx'
import Footer            from '../components/layout/Footer.jsx'
import LandingPage       from './pages/LandingPage.jsx'
import JoinPage          from './pages/JoinPage.jsx'
import Dashboard         from './pages/Dashboard.jsx'
import Modul01Page       from './pages/Modul01Page.jsx'
import Modul02Page       from './pages/Modul02Page.jsx'
import Modul03Page       from './pages/Modul03Page.jsx'
import Modul04Page       from './pages/Modul04Page.jsx'
import CertificatePage   from './pages/CertificatePage.jsx'
import PrivacyPage       from './pages/PrivacyPage.jsx'
import MyDataPage        from './pages/MyDataPage.jsx'
import TeacherLogin      from './pages/TeacherLogin.jsx'
import TeacherDashboard  from './pages/TeacherDashboard.jsx'
import NotFound          from './pages/NotFound.jsx'

export default function App() {
  const [student, setStudent] = useState(undefined)
  const [teacher, setTeacher] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const s = await studentRestore()
      setStudent(s)
      const t = await getTeacherSession()
      setTeacher(t)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg)' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Wird geladen …</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {student && <PlatformHeader student={student} onLogout={() => setStudent(null)} />}

      <Routes>
        {/* ── Öffentlich ── */}
        <Route path="/"
          element={student ? <Navigate to="/dashboard" replace /> : <LandingPage onJoin={setStudent} />} />
        <Route path="/anmelden"
          element={student ? <Navigate to="/dashboard" replace /> : <JoinPage onJoin={setStudent} />} />
        <Route path="/datenschutz" element={<PrivacyPage />} />

        {/* ── Schüler:innen ── */}
        <Route path="/dashboard"
          element={student ? <Dashboard student={student} /> : <Navigate to="/" replace />} />
        <Route path="/modul/01"
          element={student ? <Modul01Page student={student} /> : <Navigate to="/" replace />} />
        <Route path="/modul/02"
          element={student ? <Modul02Page student={student} /> : <Navigate to="/" replace />} />
        
        
        <Route path="/zertifikat"
          element={student ? <CertificatePage student={student} /> : <Navigate to="/" replace />} />
        <Route path="/meine-daten"
          element={student ? <MyDataPage student={student} /> : <Navigate to="/" replace />} />

        {/* ── Lehrkräfte ── */}
        <Route path="/lehrer"
          element={teacher ? <Navigate to="/lehrer/dashboard" replace /> : <TeacherLogin onLogin={setTeacher} />} />
        <Route path="/lehrer/dashboard"
          element={teacher ? <TeacherDashboard teacher={teacher} onLogout={() => setTeacher(null)} /> : <Navigate to="/lehrer" replace />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer student={student} />
    </div>
  )
}