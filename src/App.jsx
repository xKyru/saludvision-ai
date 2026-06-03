import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PatientsRisk from './pages/PatientsRisk';
import ClinicalCases from './pages/ClinicalCases';
import Operations from './pages/Operations';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients-risk" element={<PatientsRisk />} />
            <Route path="/clinical-cases" element={<ClinicalCases />} />
            <Route path="/operations" element={<Operations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;