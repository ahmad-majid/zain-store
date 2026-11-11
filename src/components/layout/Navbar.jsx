import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, LogOut, Search, Flame } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useStoreSettings } from '../../context/StoreSettingsContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count } = useCart()
  const { user, profile, signOut } = useAuth()
  const { settings } = useStoreSettings()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = settings.navigation || [
    { id: '1', label: 'Shop All', to: '/shop', isSale: false },
    { id: '2', label: 'Outerwear', to: '/shop?category=outerwear', isSale: false },
    { id: '3', label: 'Dresses', to: '/shop?category=dresses', isSale: false },
    { id: '4', label: 'About', to: '/#about', isSale: false },
  ]

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-card shadow-sm py-3 border-b border-aura-dark/10'
            : 'bg-cream-100/85 backdrop-blur-md py-4 border-b border-aura-dark/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-8">
          {/* Left: Brand Mark (Now placed on the left side) */}
          <Link to="/" className="flex flex-col items-start leading-none group shrink-0">
            <span className="font-serif text-2xl lg:text-3xl text-aura-dark tracking-tight group-hover:text-aura-warm transition-colors duration-300">
              Thrift
            </span>
            <span className="font-serif text-lg lg:text-xl text-aura-warm tracking-[0.25em] italic -mt-1 font-normal">
              aura
            </span>
          </Link>

          {/* Center: Dynamic Nav Links from CRM */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => {
              if (link.isSale) {
                return (
                  <Link
                    key={link.id}
                    to={link.to}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-cream-100 font-sans text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-aura-dark transition-all shadow-sm animate-pulse"
                  >
                    <Flame size={12} />
                    <span>{link.label}</span>
                  </Link>
                )
              }
              return (
                <Link
                  key={link.id}
                  to={link.to}
                  className="font-sans text-[11px] tracking-[0.22em] uppercase text-aura-dark/75 hover:text-aura-dark transition-colors font-medium relative group"
                >
                  <span>{link.label}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-aura-gold group-hover:w-full transition-all duration-300" />
                </Link>
              )
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <Link
              to="/shop"
              className="hidden sm:flex text-aura-dark/75 hover:text-aura-dark transition-colors p-1"
              title="Search Collection"
            >
              <Search size={19} />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:block font-sans text-[10px] tracking-widest uppercase bg-aura-gold/20 text-aura-dark px-2.5 py-1 rounded-sm font-semibold hover:bg-aura-gold transition-colors"
                  >
                    CRM Panel
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="p-1 text-aura-dark/70 hover:text-aura-dark transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="p-1 text-aura-dark/75 hover:text-aura-dark transition-colors"
                title="Account"
              >
                <User size={19} />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-1.5 text-aura-dark hover:text-aura-warm transition-colors flex items-center"
              title="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1.5 bg-aura-dark text-cream-100 text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1 text-aura-dark"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-cream-100/98 backdrop-blur-xl flex flex-col justify-center items-center gap-6 px-6 pt-20"
          >
            <div className="text-center mb-2">
              <span className="font-serif text-3xl text-aura-dark block">Thrift</span>
              <span className="font-serif text-2xl text-aura-warm italic tracking-widest block -mt-1">aura</span>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.to}
                className={`font-serif text-2xl transition-colors ${
                  link.isSale ? 'text-red-600 font-bold' : 'text-aura-dark hover:text-aura-warm'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/cart"
              className="btn-primary mt-4"
            >
              View Bag ({count})
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
