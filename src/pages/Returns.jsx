import { useState } from 'react'
import { RotateCcw, Truck, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Returns() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleLookup = (e) => {
    e.preventDefault()
    if (!orderId || !email) return
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-3 text-aura-gold"
        >
          <RotateCcw size={14} />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-aura-dark/70 font-semibold">
            Concierge Care
          </span>
          <RotateCcw size={14} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl text-aura-dark leading-tight mb-6"
        >
          Returns, Exchanges &amp; Insured Transit
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans text-sm sm:text-base text-aura-dark/70 leading-relaxed"
        >
          We want you to love your archival acquisition. If an item fails to match expectations in fit or feel, our 7-day concierge return policy ensures a seamless resolution.
        </motion.p>
      </div>

      {/* 3 Key Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-8 rounded-3xl bg-cream-100/90 border border-aura-gold/30 shadow-md text-center">
          <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mx-auto mb-4">
            <Clock size={20} />
          </div>
          <h3 className="font-serif text-xl text-aura-dark mb-2">7-Day Window</h3>
          <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
            Initiate a return request within 7 calendar days of delivery confirmation for store credit or full refund.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-cream-100/90 border border-aura-gold/30 shadow-md text-center">
          <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mx-auto mb-4">
            <Truck size={20} />
          </div>
          <h3 className="font-serif text-xl text-aura-dark mb-2">Complimentary Pickup</h3>
          <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
            We arrange insured courier pickup directly from your doorstep with pre-paid return dispatch documents.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-cream-100/90 border border-aura-gold/30 shadow-md text-center">
          <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-serif text-xl text-aura-dark mb-2">Full Value Transit</h3>
          <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
            Every garment package travels under 100% full-value insurance against courier loss or transport damage.
          </p>
        </div>
      </div>

      {/* Return Request Concierge Portal */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-aura-dark/15 shadow-xl mb-16">
        <div className="max-w-xl mx-auto text-center mb-8">
          <h2 className="font-serif text-3xl text-aura-dark mb-2">Initiate Return or Exchange</h2>
          <p className="font-sans text-xs text-aura-muted">Enter your order ID and the email address used during checkout</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleLookup} className="max-w-md mx-auto space-y-4">
            <div>
              <label className="font-sans text-xs font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                Order Identifier (e.g. AUR-84920)
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="AUR-XXXXX"
                className="w-full px-4 py-3 bg-cream-50 border border-aura-dark/20 rounded-xl font-mono text-xs focus:outline-none focus:border-aura-gold"
              />
            </div>

            <div>
              <label className="font-sans text-xs font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@domain.com"
                className="w-full px-4 py-3 bg-cream-50 border border-aura-dark/20 rounded-xl text-xs focus:outline-none focus:border-aura-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3.5 text-xs font-sans tracking-[0.2em] uppercase font-semibold"
            >
              Verify Order &amp; Generate Return Label
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-6 rounded-2xl bg-cream-100 border border-aura-gold/40 text-center space-y-3"
          >
            <CheckCircle2 size={32} className="text-emerald-700 mx-auto" />
            <h4 className="font-serif text-xl text-aura-dark">Request Registered</h4>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              Order <span className="font-mono font-bold text-aura-dark">{orderId}</span> has been verified. A return authorization package and DHL pickup confirmation have been dispatched to <span className="font-semibold text-aura-dark">{email}</span>.
            </p>
            <button
              onClick={() => { setSubmitted(false); setOrderId(''); setEmail('') }}
              className="font-sans text-xs text-aura-warm underline hover:text-aura-dark mt-2 inline-block"
            >
              Check another order
            </button>
          </motion.div>
        )}
      </div>

      {/* Conditions for Returns */}
      <div className="p-8 rounded-3xl bg-cream-100/80 border border-aura-gold/25 space-y-4">
        <div className="flex items-center gap-2 text-aura-dark">
          <AlertCircle size={18} className="text-aura-gold" />
          <h3 className="font-serif text-xl">Return Eligibility Criteria</h3>
        </div>
        <ul className="space-y-2 text-xs font-sans text-aura-dark/75 list-disc pl-5 leading-relaxed">
          <li>Garment must remain in the exact condition dispatched, unwashed, unaltered, and free from fragrance or smoke odors.</li>
          <li>All original Thrift Aura wooden or acrylic archival hangtags must remain securely fastened to the piece.</li>
          <li>Items marked <span className="font-semibold text-aura-dark">"Final Archive Drop"</span> during special seasonal clearances are eligible for store credit only.</li>
          <li>Refunds are credited to the original payment source within 3 to 5 business days following physical receipt and atelier inspection.</li>
        </ul>
      </div>
    </main>
  )
}
