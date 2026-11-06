import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import RiskSimulator from './components/RiskSimulator'
import Dashboard from './pages/Dashboard'
import InsectScanner from './pages/InsectScanner'
import PesticideChecker from './pages/PesticideChecker'
import './App.css'

function App() {
  return (
    <>
      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulator" element={<RiskSimulator />} />
          <Route path="/insect-scanner" element={<InsectScanner />} />
          <Route path="/pesticide-checker" element={<PesticideChecker />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>
          PestiSafe is a student research project (FLL Team 13981). All data shown is illustrative demo
          data, not live sensor output or certified pesticide guidance.
        </p>
      </footer>
    </>
  )
}

export default App
