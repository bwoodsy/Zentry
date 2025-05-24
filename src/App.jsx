import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import Projects from './pages/Projects.jsx'

export default function App() {
  return (
    <div className="min-h-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </div>
  )
}
