import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <StoreSettingsProvider>
        <AuthProvider>
          <CartProvider>
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
            </Routes>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </StoreSettingsProvider>
    </BrowserRouter>
  )
}

export default App
