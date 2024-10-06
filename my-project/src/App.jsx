import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './LandingPage'
import StudyMaterialOverview from './StudyMaterialOverview'
import SignIn from './signin'
import ProjectPage from './ProjectPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<StudyMaterialOverview />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App