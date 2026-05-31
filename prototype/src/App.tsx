import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CompareBar from './components/CompareBar'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import VehiclePDP from './pages/VehiclePDP'
import Account from './pages/Account'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/auto/:id" element={<VehiclePDP />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CompareBar />
      <Footer />
    </div>
  )
}
