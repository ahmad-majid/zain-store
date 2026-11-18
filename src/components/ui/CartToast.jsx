import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/ToastContext'

export default function CartToast() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-aura-gold/30 rounded-2xl shadow-2xl p-4 w-80 flex gap-3"
          >
            {/* Product Image */}
            <img
              src={toast.image}
              alt={toast.name}
              className="w-[60px] h-[60px] rounded-lg object-cover flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              {/* Top row: label + dismiss */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-aura-gold font-semibold">
                  Added to Bag
                </span>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-aura-muted hover:text-aura-dark transition-colors ml-2 flex-shrink-0"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Product name */}
              <p className="font-serif text-sm text-aura-dark line-clamp-1">
                {toast.name}
              </p>

              {/* Color + Size */}
              <p className="font-sans text-[11px] text-aura-muted">
                {toast.color} · {toast.size}
              </p>

              {/* View Bag link */}
              <Link
                to="/cart"
                className="text-[11px] font-semibold text-aura-dark hover:text-aura-gold underline mt-0.5 w-fit"
              >
                View Bag →
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
