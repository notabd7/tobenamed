
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './LandingPage'
import StudyMaterialOverview from './StudyMaterialOverview'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/overview" element={<StudyMaterialOverview />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App