import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { StoreSettingsProvider } from './context/StoreSettingsContext'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ThreeBackground from './components/3d/ThreeBackground'
import CustomCursor from './components/ui/CustomCursor'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Campaign from './pages/Campaign'
import AboutUs from './pages/AboutUs'
import Sustainability from './pages/Sustainability'
import SizingGuide from './pages/SizingGuide'
import Returns from './pages/Returns'
import FAQ from './pages/FAQ'
import PrivacyTerms from './pages/PrivacyTerms'
import WhatsAppConcierge from './components/ui/WhatsAppConcierge'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <StoreSettingsProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <CustomCursor />
            <AnnouncementBar />
            <ThreeBackground />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-access" element={<AdminLogin />} />
              <Route path="/campaign/:slug" element={<Campaign />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/sizing-guide" element={<SizingGuide />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyTerms />} />
              <Route path="/terms" element={<PrivacyTerms />} />
            </Routes>
            <WhatsAppConcierge />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </StoreSettingsProvider>
    </BrowserRouter>
  )
}

export default App
