import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useStoreSettings } from '../../context/StoreSettingsContext'

export default function CategoriesSection() {
  const { settings } = useStoreSettings()
  const categories = settings.categories || []

  return (
    <section className="py-24 px-6 lg:px-12 bg-aura-dark text-cream-100 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-gold font-medium mb-3 block">
              Curated Departments
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-cream-50 leading-tight">
              Shop by <span className="italic text-aura-gold">Silhouette</span>
            </h2>
          </motion.div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-cream-200 hover:text-aura-gold transition-colors font-semibold pb-1 border-b border-cream-100/20"
          >
            <span>All Categories</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Dynamic Category Cards from CRM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id || cat.slug || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group block relative overflow-hidden rounded-xl aspect-[3/4] bg-aura-charcoal shadow-lg border border-cream-100/10"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-95"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/90 via-aura-dark/30 to-transparent" />

                <div className="absolute top-4 right-4 glass-card px-3 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase text-cream-100 font-medium">
                  {cat.count}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-serif text-2xl font-normal text-cream-50 leading-tight mb-1 group-hover:text-aura-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-xs text-cream-200/60 font-light mb-3 line-clamp-1">
                    {cat.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans tracking-widest uppercase text-aura-gold font-medium">
                    <span>Explore</span>
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
