import { useState } from 'react'
import { Shield, FileText, Lock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyTerms() {
  const [tab, setTab] = useState('privacy') // privacy | terms

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-3 text-aura-gold"
        >
          <Shield size={14} />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-aura-dark/70 font-semibold">
            Legal &amp; Privacy
          </span>
          <Shield size={14} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl text-aura-dark leading-tight mb-4"
        >
          {tab === 'privacy' ? 'Privacy & Data Protection' : 'Terms of Archival Acquisition'}
        </motion.h1>
        <p className="font-sans text-xs sm:text-sm text-aura-dark/70">
          Last revised: Autumn / Winter 2026 Archive Cycle
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="p-1 bg-cream-200/80 rounded-xl border border-aura-dark/10 inline-flex">
          <button
            onClick={() => setTab('privacy')}
            className={`px-5 py-2 rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-all flex items-center gap-2 ${
              tab === 'privacy' ? 'bg-aura-dark text-cream-100 shadow-sm' : 'text-aura-dark/60 hover:text-aura-dark'
            }`}
          >
            <Lock size={13} />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`px-5 py-2 rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-all flex items-center gap-2 ${
              tab === 'terms' ? 'bg-aura-dark text-cream-100 shadow-sm' : 'text-aura-dark/60 hover:text-aura-dark'
            }`}
          >
            <FileText size={13} />
            <span>Terms of Service</span>
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-cream-50/90 border border-aura-gold/30 shadow-xl space-y-6 text-xs font-sans text-aura-dark/80 leading-relaxed">
        {tab === 'privacy' ? (
          <>
            <div>
              <h3 className="font-serif text-xl text-aura-dark mb-2">1. Commitment to Discretion</h3>
              <p>
                Thrift Aura adheres to strict principles of privacy and client discretion. We never sell, lease, or monetize your personal shopping histories, device identifiers, or contact records to commercial data brokers.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-aura-dark mb-2">2. Information Collection</h3>
              <p>
                We collect only essential data needed to curate and fulfill orders: delivery addresses, contact numbers for insured courier verification, and email addresses for delivery status dispatch and order receipts.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-aura-dark mb-2">3. Payment Security</h3>
              <p>
                All payment transactions are processed through encrypted end-to-end payment gateways complying with PCI-DSS Tier 1 protocols. Thrift Aura never retains full payment card numbers on our servers.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-aura-dark mb-2">4. Your Data Rights</h3>
              <p>
                You retain the permanent right to request a complete export or immediate erasure of your member profile and order records by contacting curator@thriftaura.com.
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="font-serif text-xl text-aura-dark mb-2">1. Nature of Archival Inventory</h3>
              <p>
                Every garment sold by Thrift Aura is an authentic pre-loved, vintage, or archival collector piece. Because each item is unique and pre-owned, subtle signs of age and patina are natural characteristics of the garment rather than manufacturing defects.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-aura-dark mb-2">2. Accuracy of Representation</h3>
              <p>
                We photograph each piece from at least four precise angles (Front, Side, Fabric texture, and Back/Silhouette) under calibrated studio illumination. Hand-taken flat measurements are provided on every product page.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-aura-dark mb-2">3. 7-Day Concierge Return Guarantee</h3>
              <p>
                Clients may return an acquisition within 7 calendar days of delivery confirmation provided the garment remains unworn with original archival hangtags intact.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-aura-dark mb-2">4. Intellectual Property</h3>
              <p>
                All editorial imagery, lookbook photography, 3D graphics, and bespoke copy on Thrift Aura remain exclusive intellectual property protected under copyright law.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
