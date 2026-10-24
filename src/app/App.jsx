// ============================================================
// KI-Führerschein · App-Router
// ============================================================

import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { studentRestore, getTeacherSession } from '../lib/auth.js'

// Seiten
import JoinPage        from './pages/JoinPage.jsx'
import Dashboard       from './pages/Dashboard.jsx'
import Modul02Page     from './pages/Modul02Page.jsx'
import TeacherLogin    from './pages/TeacherLogin.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import NotFound        from './pages/NotFound.jsx'

// Layout
import PlatformHeader  from '../components/layout/PlatformHeader.jsx'

export default function App() {
  const [student, setStudent]       = useState(undefined)  // undefined = noch nicht geprüft
  const [teacher, setTeacher]       = useState(undefined)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function init() {
      // Schüler-Session wiederherstellen
      const s = await studentRestore()
      setStudent(s)

      // Lehrer-Session prüfen
      const t = await getTeacherSession()
      setTeacher(t)

      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Wird geladen …</p>
      </div>
    )
  }

  return (
    <>
      {/* Plattformkopf nur für Schüler:innen */}
      {student && <PlatformHeader student={student} onLogout={() => setStudent(null)} />}

      <Routes>
        {/* ── Schüler:innen ── */}
        <Route
          path="/"
          element={
            student
              ? <Navigate to="/dashboard" replace />
              : <JoinPage onJoin={setStudent} />
          }
        />
        <Route
          path="/dashboard"
          element={
            student
              ? <Dashboard student={student} />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/modul/02"
          element={
            student
              ? <Modul02Page student={student} />
              : <Navigate to="/" replace />
          }
        />

        {/* ── Lehrkräfte ── */}
        <Route
          path="/lehrer"
          element={
            teacher
              ? <Navigate to="/lehrer/dashboard" replace />
              : <TeacherLogin onLogin={setTeacher} />
          }
        />
        <Route
          path="/lehrer/dashboard"
          element={
            teacher
              ? <TeacherDashboard teacher={teacher} onLogout={() => setTeacher(null)} />
              : <Navigate to="/lehrer" replace />
          }
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}