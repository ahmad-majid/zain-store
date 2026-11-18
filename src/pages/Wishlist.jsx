import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useStoreSettings } from '../context/StoreSettingsContext'
import ProductCard from '../components/ui/ProductCard'
import { motion } from 'framer-motion'

export default function Wishlist() {
  const { wishlist, clearWishlist, count } = useWishlist()
  const { products } = useStoreSettings()

  const wishlisted = products.filter((p) => wishlist.includes(p.id))

  if (count === 0 || wishlisted.length === 0) {
    return (
      <main className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-red-400" />
          </div>
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-aura-gold font-semibold block mb-2">My Wishlist</span>
          <h2 className="font-serif text-3xl text-aura-dark mb-3">Your Wishlist is Empty</h2>
          <p className="font-sans text-sm text-aura-dark/60 leading-relaxed mb-8">
            Save pieces you love by tapping the heart icon on any product. Find them here to revisit anytime.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <span>Browse Archival Collection</span><ArrowRight size={14} />
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-aura-gold mb-2">
              <Heart size={13} />
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] font-semibold text-aura-dark/60">Saved Collection</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-aura-dark">My Wishlist</h1>
            <p className="font-sans text-sm text-aura-muted mt-2">{count} piece{count !== 1 ? 's' : ''} saved</p>
          </div>
          <button
            onClick={clearWishlist}
            className="flex items-center gap-2 font-sans text-xs tracking-wider uppercase text-aura-muted hover:text-red-500 transition-colors font-semibold mt-2"
          >
            <Trash2 size={13} /> Clear All
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {wishlisted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}
