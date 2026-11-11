import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AboutUs() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10 max-w-6xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-3 text-aura-gold"
        >
          <Sparkles size={13} />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-aura-dark/70 font-semibold">
            Our Atelier &amp; Heritage
          </span>
          <Sparkles size={13} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl text-aura-dark leading-tight mb-6"
        >
          The Art of Archival Preservation
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans text-sm sm:text-base text-aura-dark/70 leading-relaxed"
        >
          Thrift Aura was born from an obsession with timeless tailoring, historical textile craftsmanship, and the conviction that the most luxurious garment in the world is one that already exists.
        </motion.p>
      </div>

      {/* Hero Visual Collage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-7 rounded-3xl overflow-hidden border border-aura-gold/30 shadow-2xl relative h-[420px]"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop&q=85"
            alt="Atelier Curator inspecting archival fabric"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/80 via-transparent to-transparent flex items-end p-8">
            <p className="font-serif text-cream-100 text-lg sm:text-xl italic">
              "We don't sell discarded clothes. We revive lost masterpieces of form, silhouette, and drape."
            </p>
          </div>
        </motion.div>

        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-cream-100/90 border border-aura-dark/10 shadow-sm backdrop-blur-sm">
            <h3 className="font-serif text-2xl text-aura-dark mb-2">Individual Sourcing</h3>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              Every garment in our catalog is personally examined by our resident curators across European, Japanese, and heritage estate archives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream-100/90 border border-aura-dark/10 shadow-sm backdrop-blur-sm">
            <h3 className="font-serif text-2xl text-aura-dark mb-2">Restorative Care</h3>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              Before a piece enters our rack, it undergoes organic botanical steam laundering, seam reinforcement, and fiber conditioning.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream-100/90 border border-aura-dark/10 shadow-sm backdrop-blur-sm">
            <h3 className="font-serif text-2xl text-aura-dark mb-2">Authenticated Provenance</h3>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              We verify tags, serials, zip hallmarks (Raccagni, YKK vintage, Lampo), and fiber purity to guarantee 100% authenticity.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-aura-dark text-cream-100 mb-20 text-center shadow-xl">
        <div>
          <p className="font-serif text-3xl sm:text-4xl text-aura-gold mb-1">1,400+</p>
          <p className="font-sans text-[11px] tracking-widest uppercase text-cream-300/70">Archival Pieces Rescued</p>
        </div>
        <div>
          <p className="font-serif text-3xl sm:text-4xl text-aura-gold mb-1">100%</p>
          <p className="font-sans text-[11px] tracking-widest uppercase text-cream-300/70">Authenticity Guarantee</p>
        </div>
        <div>
          <p className="font-serif text-3xl sm:text-4xl text-aura-gold mb-1">0%</p>
          <p className="font-sans text-[11px] tracking-widest uppercase text-cream-300/70">Fast Fashion Waste</p>
        </div>
        <div>
          <p className="font-serif text-3xl sm:text-4xl text-aura-gold mb-1">4.9/5</p>
          <p className="font-sans text-[11px] tracking-widest uppercase text-cream-300/70">Curator Satisfaction</p>
        </div>
      </div>

      {/* Philosophy Points */}
      <div className="mb-20">
        <h2 className="font-serif text-3xl text-aura-dark text-center mb-12">The Three Pillars of Aura</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-cream-100/80 border border-aura-gold/25 hover:border-aura-gold transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mb-5">
              <ShieldCheck size={22} />
            </div>
            <h4 className="font-serif text-xl text-aura-dark mb-2">Uncompromising Rigor</h4>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              We reject 94% of the pieces presented to our acquisition desk. Only garments with immaculate fiber integrity and structural silhouette make the cut.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-cream-100/80 border border-aura-gold/25 hover:border-aura-gold transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mb-5">
              <Heart size={22} />
            </div>
            <h4 className="font-serif text-xl text-aura-dark mb-2">Emotional Longevity</h4>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              Fast fashion is engineered to be forgotten. Archival garments possess memory — hand-finished buttonholes, heavy drape, and patinas that deepen with age.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-cream-100/80 border border-aura-gold/25 hover:border-aura-gold transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center mb-5">
              <Award size={22} />
            </div>
            <h4 className="font-serif text-xl text-aura-dark mb-2">Modern Relevance</h4>
            <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
              We style and present historical pieces through a contemporary lens, pairing tailored 90s blazers with relaxed denim and minimal footwear.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-cream-100 via-white to-cream-100 border border-aura-gold/40 shadow-lg">
        <h3 className="font-serif text-3xl text-aura-dark mb-3">Explore the Active Rack</h3>
        <p className="font-sans text-xs text-aura-dark/70 max-w-md mx-auto mb-6">
          Every item is one-of-a-kind. Once acquired by a member, it is archived forever.
        </p>
        <Link to="/shop" className="btn-primary py-3 px-8 text-xs inline-flex items-center gap-2">
          <span>Browse Available Silhouettes</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  )
}
