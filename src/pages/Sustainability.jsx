import { Link } from 'react-router-dom'
import { Leaf, RefreshCw, Droplets, Package, Wind, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Sustainability() {
  const stats = [
    { label: 'Water Saved per Garment', value: '7,000 Liters', desc: 'Equivalent to 60 full bathtubs saved by wearing archival rather than producing new cotton' },
    { label: 'Carbon Emissions Avoided', value: '82% Reduction', desc: 'Pre-owned garments produce an average of 82% less CO2 than newly manufactured fashion' },
    { label: 'Landfill Diversion', value: '100% Zero-Landfill', desc: 'Every unsold fiber is repaired, recut into silk dust bags, or gifted to textile archives' },
    { label: 'Biodegradable Packaging', value: '0% Single-Use Plastic', desc: 'Dispatched exclusively in FSC-certified boxes with compostable cornstarch garment pouches' },
  ]

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-3 text-aura-gold"
        >
          <Leaf size={14} />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-aura-dark/70 font-semibold">
            Ecological Responsibility
          </span>
          <Leaf size={14} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl text-aura-dark leading-tight mb-6"
        >
          The Circular Luxury Manifesto
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans text-sm sm:text-base text-aura-dark/70 leading-relaxed"
        >
          Fashion is the second most polluting industry on Earth. We believe true luxury must not come at the expense of our planet’s soil, water, and atmosphere.
        </motion.p>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {stats.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-3xl bg-cream-100/90 border border-aura-gold/30 shadow-md backdrop-blur-sm"
          >
            <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-aura-warm block mb-2">
              {s.label}
            </span>
            <p className="font-serif text-3xl sm:text-4xl text-aura-dark font-normal mb-3">
              {s.value}
            </p>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* The 4 Principles of Circularity */}
      <div className="mb-20">
        <h2 className="font-serif text-3xl text-aura-dark text-center mb-12">Our Sustainable Operating Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-aura-dark/10 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mx-auto mb-4">
              <RefreshCw size={20} />
            </div>
            <h4 className="font-serif text-lg text-aura-dark mb-2">Extended Life</h4>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              Extending the active wear life of a piece by just 9 months reduces its carbon, waste, and water footprints by ~25%.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-aura-dark/10 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mx-auto mb-4">
              <Droplets size={20} />
            </div>
            <h4 className="font-serif text-lg text-aura-dark mb-2">Water Preservation</h4>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              We employ closed-loop organic botanical steam cleaning, using 90% less water than industrial laundry facilities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-aura-dark/10 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mx-auto mb-4">
              <Package size={20} />
            </div>
            <h4 className="font-serif text-lg text-aura-dark mb-2">Zero Plastic</h4>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              Every parcel is protected with biodegradable tissue and unbleached cotton ribbon. 100% kerbside recyclable.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-aura-dark/10 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mx-auto mb-4">
              <Wind size={20} />
            </div>
            <h4 className="font-serif text-lg text-aura-dark mb-2">Carbon Offset</h4>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              We partner with verified carbon offset programs to neutralize shipping emissions on every courier delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainable Pledge Banner */}
      <div className="p-10 rounded-3xl bg-aura-dark text-cream-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-aura-gold text-xs uppercase tracking-widest font-semibold mb-2">
            <Sparkles size={14} />
            <span>The Aura Promise</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl mb-3">Buy Less. Invest Better. Wear Forever.</h3>
          <p className="font-sans text-xs text-cream-300/70 leading-relaxed">
            When you acquire from Thrift Aura, you are voting against disposable fashion culture. You are honoring the weavers, patternmakers, and tailors of yesterday.
          </p>
        </div>
        <Link to="/shop" className="btn-primary py-3 px-8 text-xs shrink-0 whitespace-nowrap inline-flex items-center gap-2">
          <span>Explore Curated Archive</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  )
}
