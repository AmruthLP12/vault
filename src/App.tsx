import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import EncryptPage from './pages/EncryptPage'
import DecryptPage from './pages/DecryptPage'
import Nav from './components/Nav'
import Footer from './components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Nav />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"        element={<Navigate to="/encrypt" />} />
            <Route path="/encrypt" element={<EncryptPage />} />
            <Route path="/decrypt" element={<DecryptPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
