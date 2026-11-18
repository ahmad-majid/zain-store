import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-4 text-aura-gold">
          <Sparkles size={14} />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] font-semibold text-aura-dark/50">404 — Not Found</span>
          <Sparkles size={14} />
        </div>
        <h1 className="font-serif text-6xl sm:text-8xl text-aura-dark mb-4 leading-none">404</h1>
        <h2 className="font-serif text-2xl text-aura-dark mb-4">This Page Has Left the Archive</h2>
        <p className="font-sans text-sm text-aura-dark/60 leading-relaxed mb-10">
          The piece you are looking for may have been moved, sold, or never existed in our archival collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="py-3 px-6 border-2 border-aura-dark text-aura-dark hover:bg-aura-dark hover:text-cream-100 rounded-xl text-xs font-sans tracking-wider uppercase font-semibold transition-all"
          >
            Return Home
          </Link>
          <Link to="/shop" className="btn-primary flex items-center gap-2 justify-center">
            <span>Browse Collection</span><ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
