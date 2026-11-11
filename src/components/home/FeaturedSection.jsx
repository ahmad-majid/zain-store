import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useStoreSettings } from '../../context/StoreSettingsContext'
import ProductCard from '../ui/ProductCard'
import { motion } from 'framer-motion'

export default function FeaturedSection() {
  const { products, settings } = useStoreSettings()
  const [activeTab, setActiveTab] = useState('all')

  const categories = [
    { label: 'All Featured', value: 'all' },
    ...settings.categories.map((c) => ({ label: c.name, value: c.slug })),
  ]

  // Filter products where featured is true (or fallback to top 8)
  const featuredOnly = products.filter((p) => p.featured)
  const displayPool = featuredOnly.length > 0 ? featuredOnly : products

  const filtered = activeTab === 'all'
    ? displayPool.slice(0, 8)
    : displayPool.filter((p) => p.categories?.slug === activeTab || p.category_id === activeTab).slice(0, 8)

  return (
    <section id="featured" className="py-24 px-6 lg:px-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-aura-gold" />
              <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-muted font-medium">
                Curator Selected • Limited Editions
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-aura-dark leading-tight">
              Featured <span className="italic text-aura-warm font-normal">Archives</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-aura-dark hover:text-aura-warm transition-colors font-semibold pb-1 border-b border-aura-dark/20 hover:border-aura-warm"
            >
              <span>View Full Collection ({products.length})</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scroll-row">
          {categories.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`chip rounded-full whitespace-nowrap text-[11px] ${
                activeTab === tab.value ? 'active shadow-sm' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Concierge Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 p-8 md:p-12 rounded-2xl bg-gradient-to-r from-aura-dark via-aura-charcoal to-aura-dark text-cream-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
        >
          <div>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-aura-gold mb-2 block font-semibold">
              Personal Sourcing Concierge
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-cream-50 mb-2">
              Searching for a specific archival vintage piece?
            </h3>
            <p className="font-sans text-sm text-cream-200/70 max-w-xl font-light">
              Our stylists source rare designer garments across Paris, Milan, and Tokyo archives. Contact our private styling desk.
            </p>
          </div>
          <Link
            to="/shop"
            className="btn-primary bg-aura-gold text-aura-dark hover:bg-cream-100 whitespace-nowrap rounded-none font-semibold text-xs tracking-[0.2em]"
          >
            Request Sourcing
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
