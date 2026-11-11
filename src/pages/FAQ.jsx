import { useState, useMemo } from 'react'
import { HelpCircle, ChevronDown, Search, Sparkles, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [openIdx, setOpenIdx] = useState(null)

  const faqs = [
    {
      category: 'authenticity',
      q: 'How do you authenticate archival designer and vintage pieces?',
      a: 'Every garment is authenticated through a multi-point verification protocol: serial tags, interior care typography, fabric blend analysis, stitch density, and hardware hallmarks (such as vintage Lampo, Riri, and Talon zippers). Counterfeit garments are permanently discarded.',
    },
    {
      category: 'authenticity',
      q: 'Are the clothes washed and cleaned before dispatch?',
      a: 'Yes, unconditionally. Every piece undergoes gentle organic botanical steam laundering and hypoallergenic ozone sterilization. Garments arrive fresh, sanitized, conditioned, and ready to wear immediately upon unboxing.',
    },
    {
      category: 'sizing',
      q: 'Why are vintage sizes different from modern standard sizing?',
      a: 'Fashion sizing has changed drastically over the decades (commonly referred to as vanity sizing). A 1990s Italian "Size L" jacket may fit like a modern "Size S/M". For this reason, we provide hand-measured flat dimensions (pit-to-pit, waist, length) on every single product page.',
    },
    {
      category: 'sizing',
      q: 'What do the condition ratings (Like New, Excellent, Good) mean?',
      a: '"Like New" pieces show virtually no wear; "Excellent" garments possess subtle character consistent with gentle wear; "Good" pieces have intact structural integrity with honest vintage character. You can read our full grading breakdown on our Sizing & Condition page.',
    },
    {
      category: 'orders',
      q: 'How do I apply coupon codes to my order?',
      a: 'During checkout on the Cart page, enter your code into the "Promo / Coupon Code" input and click Apply. Active promotions like AURA10 or ARCHIVE20 will immediately deduct from your order subtotal.',
    },
    {
      category: 'orders',
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit/debit cards (Visa, Mastercard, American Express), digital wallets, and Cash on Delivery (COD) for domestic destinations.',
    },
    {
      category: 'shipping',
      q: 'How long does delivery take?',
      a: 'Domestic insured orders typically arrive within 2 to 4 business days. International express shipments via DHL / FedEx arrive within 5 to 8 business days with end-to-end tracking.',
    },
    {
      category: 'shipping',
      q: 'What is your packaging made of?',
      a: 'We are committed to 100% plastic-free packaging. Your garment is packed in biodegradable unbleached tissue paper, tied with recycled cotton twine, and shipped inside FSC-certified recyclable cardboard mailers.',
    },
    {
      category: 'shipping',
      q: 'Can I return an item if it doesn’t fit?',
      a: 'Yes. We offer a 7-day concierge return policy. You can register your return through our Returns & Exchanges portal for complimentary doorstep courier pickup.',
    },
  ]

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      if (activeCategory !== 'all' && f.category !== activeCategory) return false
      if (search.trim()) {
        const query = search.toLowerCase()
        return f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)
      }
      return true
    })
  }, [activeCategory, search])

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-3 text-aura-gold"
        >
          <HelpCircle size={14} />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-aura-dark/70 font-semibold">
            Knowledge Base
          </span>
          <HelpCircle size={14} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl text-aura-dark leading-tight mb-4"
        >
          Frequently Asked Questions
        </motion.h1>
        <p className="font-sans text-xs sm:text-sm text-aura-dark/70">
          Everything you need to know about our sourcing, authenticity, sizing, and concierge service.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8 max-w-lg mx-auto">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions (e.g. authenticity, returns, sizing)..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-aura-dark/15 rounded-2xl text-xs text-aura-dark placeholder-aura-muted focus:outline-none focus:border-aura-gold shadow-sm"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { label: 'All Questions', id: 'all' },
          { label: 'Authenticity', id: 'authenticity' },
          { label: 'Sizing & Fit', id: 'sizing' },
          { label: 'Orders & Payments', id: 'orders' },
          { label: 'Shipping & Care', id: 'shipping' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-sans tracking-wider uppercase font-semibold transition-all ${
              activeCategory === tab.id
                ? 'bg-aura-dark text-cream-100 shadow-md'
                : 'bg-cream-100/80 text-aura-dark/70 hover:text-aura-dark border border-aura-dark/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3 mb-16">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-aura-dark/10 bg-cream-50/90 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-cream-100/80 transition-colors"
                >
                  <span className="font-serif text-base sm:text-lg text-aura-dark font-medium">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-aura-gold shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs font-sans text-aura-dark/75 leading-relaxed border-t border-aura-dark/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 p-6 rounded-2xl bg-cream-100/60 border border-aura-dark/10">
            <p className="font-serif text-lg text-aura-dark mb-1">No matching questions found</p>
            <p className="font-sans text-xs text-aura-muted">Try a different search term or browse all categories above.</p>
          </div>
        )}
      </div>

      {/* Contact Curator Box */}
      <div className="p-8 rounded-3xl bg-aura-dark text-cream-100 text-center shadow-xl space-y-3">
        <MessageCircle size={28} className="text-aura-gold mx-auto" />
        <h3 className="font-serif text-2xl">Still have an inquiry?</h3>
        <p className="font-sans text-xs text-cream-300/70 max-w-md mx-auto leading-relaxed">
          Our resident atelier curator is on hand to answer specific questions regarding fabric composition, tailor fits, or private viewings.
        </p>
        <div className="pt-2">
          <a
            href="mailto:curator@thriftaura.com"
            className="btn-primary py-2.5 px-6 text-xs inline-flex items-center gap-2"
          >
            <span>Speak with a Curator</span>
          </a>
        </div>
      </div>
    </main>
  )
}
