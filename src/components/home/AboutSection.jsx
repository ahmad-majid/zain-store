import { motion } from 'framer-motion'
import { Leaf, Recycle, Heart, Award, Play } from 'lucide-react'
import { useStoreSettings } from '../../context/StoreSettingsContext'

const values = [
  {
    icon: Recycle,
    title: 'Circular Fashion',
    desc: 'Every purchase extends the life of a garment, reducing waste and environmental impact.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Choice',
    desc: 'Pre-loved fashion is the most sustainable choice — no new resources needed.',
  },
  {
    icon: Heart,
    title: 'Carefully Curated',
    desc: 'Each piece is hand-selected and quality-checked before listing.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    desc: 'We only list pieces in good condition with honest, transparent grading.',
  },
]

export default function AboutSection() {
  const { settings } = useStoreSettings()
  const story = settings.story || {}

  return (
    <section id="about" className="py-24 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          {/* Dynamic Story Text from CRM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-aura-warm mb-3 block">
              — {story.label || 'Our Story'}
            </span>
            <h2 className="section-title mb-6">
              {story.title || 'Fashion with a'}{' '}
              <span className="italic text-aura-warm">{story.titleItalic || 'Conscience'}</span>
            </h2>
            <p className="font-sans text-aura-dark/70 leading-relaxed mb-6 font-light">
              {story.p1}
            </p>
            <p className="font-sans text-aura-dark/70 leading-relaxed mb-8 font-light">
              {story.p2}
            </p>
            <a href="#featured" className="btn-outline inline-flex">Explore Archives</a>
          </motion.div>

          {/* Dynamic Media Stage (Image or Video) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200 relative shadow-2xl border border-aura-dark/10">
              {story.mediaType === 'video' ? (
                <video
                  src={story.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={story.mediaUrl || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&q=85'}
                  alt="Thrift Aura Atelier"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/40 to-transparent pointer-events-none" />
            </div>

            {/* Dynamic Floating Stat Cards */}
            <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-xl shadow-xl border border-aura-gold/25 max-w-xs">
              <div className="font-serif text-3xl text-aura-dark mb-1 font-normal">
                {story.stat1Number || '500+'}
              </div>
              <div className="font-sans text-xs text-aura-muted">
                {story.stat1Label || 'pieces found new homes'}
              </div>
            </div>

            <div className="hidden sm:block absolute -top-4 -right-4 glass-card px-4 py-2 rounded-full shadow-lg border border-aura-gold/20 text-[10px] font-sans tracking-widest uppercase font-semibold text-aura-dark">
              {story.stat2Number || '100%'} {story.stat2Label || 'Circular'}
            </div>
          </motion.div>
        </div>

        {/* Brand Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center border border-aura-dark/10 rounded-xl group-hover:border-aura-gold transition-colors duration-300">
                <v.icon size={24} className="text-aura-warm group-hover:text-aura-gold transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-lg text-aura-dark mb-2 font-normal">{v.title}</h3>
              <p className="font-sans text-xs text-aura-muted leading-relaxed font-light">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
