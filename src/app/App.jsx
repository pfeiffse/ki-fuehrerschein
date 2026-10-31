// App.jsx - Kein Blocking, sofortiger Start

import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getStudentLocal, refreshStudentAsync, getTeacherSession } from '../lib/auth.js'

// Lazy imports fuer schnelleren Start
import LandingPage      from './pages/LandingPage.jsx'
import JoinPage         from './pages/JoinPage.jsx'
import Dashboard        from './pages/Dashboard.jsx'
import Modul01Page      from './pages/Modul01Page.jsx'
import Modul02Page      from './pages/Modul02Page.jsx'
import Modul03Page      from './pages/Modul03Page.jsx'
import Modul04Page      from './pages/Modul04Page.jsx'
import CertificatePage  from './pages/CertificatePage.jsx'
import PrivacyPage      from './pages/PrivacyPage.jsx'
import MyDataPage       from './pages/MyDataPage.jsx'
import TeacherLogin     from './pages/TeacherLogin.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import AdminDashboard   from './pages/AdminDashboard.jsx'
import NotFound         from './pages/NotFound.jsx'
import GameHeader       from '../components/layout/GameHeader.jsx'
import Footer           from '../components/layout/Footer.jsx'

export default function App() {
  // SOFORT aus localStorage laden - kein await, kein Blocking
  const [student, setStudent] = useState(() => getStudentLocal())
  const [teacher, setTeacher] = useState(null)
  const [teacherChecked, setTeacherChecked] = useState(false)

  useEffect(() => {
    // Student im Hintergrund aktualisieren (blockiert nicht)
    if (student) refreshStudentAsync()

    // Teacher-Session pruefen (nur fuer /lehrer-Routen relevant)
    getTeacherSession()
      .then(t => { setTeacher(t); setTeacherChecked(true) })
      .catch(() => setTeacherChecked(true))
  }, [])

  const isStudent = !!student
  const isTeacher = !!teacher

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isStudent && <GameHeader student={student} onLogout={() => { setStudent(null) }} />}

      <Routes>
        {/* Oeffentlich */}
        <Route path="/"          element={isStudent ? <Navigate to="/dashboard" replace /> : <LandingPage onJoin={setStudent} />} />
        <Route path="/anmelden"  element={isStudent ? <Navigate to="/dashboard" replace /> : <JoinPage onJoin={setStudent} />} />
        <Route path="/datenschutz" element={<PrivacyPage />} />

        {/* Schueler */}
        <Route path="/dashboard"   element={isStudent ? <Dashboard student={student} /> : <Navigate to="/" replace />} />
        <Route path="/modul/01"    element={isStudent ? <Modul01Page /> : <Navigate to="/" replace />} />
        <Route path="/modul/02"    element={isStudent ? <Modul02Page /> : <Navigate to="/" replace />} />
        <Route path="/modul/03"    element={isStudent ? <Modul03Page /> : <Navigate to="/" replace />} />
        <Route path="/modul/04"    element={isStudent ? <Modul04Page /> : <Navigate to="/" replace />} />
        <Route path="/zertifikat"  element={isStudent ? <CertificatePage /> : <Navigate to="/" replace />} />
        <Route path="/meine-daten" element={isStudent ? <MyDataPage /> : <Navigate to="/" replace />} />

        {/* Lehrkraft */}
        <Route path="/lehrer"
          element={isTeacher ? <Navigate to="/lehrer/dashboard" replace /> : <TeacherLogin onLogin={setTeacher} />} />
        <Route path="/lehrer/dashboard"
          element={isTeacher ? <TeacherDashboard teacher={teacher} onLogout={() => setTeacher(null)} /> : <Navigate to="/lehrer" replace />} />
        <Route path="/admin"
          element={isTeacher ? <AdminDashboard teacher={teacher} onLogout={() => setTeacher(null)} /> : <Navigate to="/lehrer" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer student={student} />
    </div>
  )
}