import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStoreSettings } from '../../context/StoreSettingsContext'

export default function LookbookSection() {
  const { settings } = useStoreSettings()
  const looks = settings.lookbook || []

  return (
    <section className="py-24 px-6 lg:px-12 bg-cream-200/50 border-y border-aura-dark/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-muted font-medium mb-3 block">
              Editorial Moodboard • Edition 2026
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-aura-dark leading-tight">
              The Thrift <span className="italic text-aura-warm">Aura Lookbook</span>
            </h2>
          </motion.div>

          <p className="font-sans text-sm text-aura-dark/60 max-w-md font-light leading-relaxed">
            Styled with curated archival pieces. Demonstrating how rare vintage effortlessly anchors a modern, elevated wardrobe.
          </p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {looks.map((look, i) => (
            <motion.div
              key={look.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className={`${look.colSpan || 'md:col-span-4'} group relative rounded-xl overflow-hidden aspect-[4/5] bg-cream-300 shadow-md`}
            >
              {look.mediaType === 'video' ? (
                <video
                  src={look.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={look.mediaUrl}
                  alt={look.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/85 via-aura-dark/25 to-transparent transition-opacity" />

              <div className="absolute top-4 left-4 glass-card px-3 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase font-semibold text-aura-dark flex items-center gap-1.5">
                {look.mediaType === 'video' && <Play size={10} className="fill-current text-aura-gold" />}
                <span>{look.tag}</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-cream-100">
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-aura-gold mb-1">
                  {look.sub}
                </p>
                <h3 className="font-serif text-2xl font-normal text-cream-50 leading-tight mb-3">
                  {look.title}
                </h3>
                <Link
                  to={look.link || '/shop'}
                  className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-cream-200 hover:text-aura-gold transition-colors font-medium"
                >
                  <span>Shop The Aesthetic</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
