import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, X, Sparkles, Send, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WhatsAppConcierge() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Default boutique WhatsApp concierge number
  // Can be configured by the store owner
  const WHATSAPP_NUMBER = '923001234567'

  // Generate intelligent contextual message based on current route
  const getContextualPrompt = () => {
    const path = location.pathname
    if (path.startsWith('/product/')) {
      return `Hello Thrift Aura Atelier, I am inquiring about this archival piece: ${window.location.href}. Could you share more details regarding fabric drape and sizing?`
    }
    if (path === '/cart') {
      return `Hello Thrift Aura Concierge, I have items in my bag and had a quick question regarding payment and courier delivery.`
    }
    if (path === '/sizing-guide') {
      return `Hello Thrift Aura, I need assistance finding the exact fit for an archival silhouette.`
    }
    if (path === '/returns') {
      return `Hello Thrift Aura Concierge, I would like to inquire about returning or exchanging an archival order.`
    }
    return `Hello Thrift Aura Atelier, I would like to inquire about your curated archival drops.`
  }

  const [message, setMessage] = useState('')

  const handleOpen = () => {
    setMessage(getContextualPrompt())
    setOpen(true)
  }

  const handleSend = (e) => {
    e.preventDefault()
    const encoded = encodeURIComponent(message || getContextualPrompt())
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
    setOpen(false)
  }

  // Hide on admin routes so it doesn't obstruct CRM forms
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <>
      {/* Floating Pill Button */}
      <aside aria-label="Atelier Concierge" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 w-80 sm:w-96 rounded-2xl bg-cream-50 border border-aura-gold/40 shadow-2xl overflow-hidden p-5 text-aura-dark font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-aura-dark/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <MessageCircle size={17} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-aura-dark leading-tight">
                      Atelier Concierge
                    </h4>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live on WhatsApp
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md text-aura-muted hover:text-aura-dark transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Message Prompt */}
              <p className="text-[11px] text-aura-dark/70 mb-3 leading-relaxed">
                Connect directly with our resident stylist for private sizing inquiries, fabric drape videos, or reservation requests:
              </p>

              <form onSubmit={handleSend} className="space-y-3">
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-aura-dark/15 rounded-xl text-xs text-aura-dark placeholder-aura-muted focus:outline-none focus:border-aura-gold resize-none leading-relaxed"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-sans tracking-wider uppercase font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight size={14} />
                </button>
              </form>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-aura-muted">
                <Sparkles size={10} className="text-aura-gold" />
                <span>Typical response time: Under 15 minutes</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Trigger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={open ? () => setOpen(false) : handleOpen}
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-aura-dark text-cream-100 hover:bg-aura-gold hover:text-aura-dark shadow-2xl border border-aura-gold/30 transition-all duration-300 backdrop-blur-md"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MessageCircle size={14} />
          </div>
          <span className="font-sans text-xs tracking-wider uppercase font-bold pr-1">
            Concierge
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-aura-dark" />
        </motion.button>
      </aside>
    </>
  )
}
