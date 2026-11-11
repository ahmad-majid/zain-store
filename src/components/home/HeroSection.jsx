import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, ShieldCheck, RefreshCw, Feather } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStoreSettings } from '../../context/StoreSettingsContext'

export default function HeroSection() {
  const { settings, products } = useStoreSettings()
  const { hero } = settings

  const cardRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Find featured product selected by admin, or fallback to first product
  const featuredProduct = products.find((p) => p.id === hero.featuredProductId) || products[0]
  const featuredImg = featuredProduct?.colors?.[0]?.images?.[0] || featuredProduct?.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setRotate({
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 10,
    })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-16 px-6 lg:px-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cream-300/30 via-aura-gold/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column: Dynamic Editorial Typography from CRM */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="inline-block w-8 h-px bg-aura-gold" />
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-muted font-medium">
              {hero.eyebrow}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <h1 className="hero-title text-aura-dark font-serif font-normal">
              {hero.titleMain}
            </h1>
            <h1 className="hero-sub font-serif italic text-aura-warm font-normal -mt-2 md:-mt-5">
              {hero.titleSub}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base md:text-lg text-aura-dark/70 max-w-xl leading-relaxed mb-10 font-normal"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <Link to={hero.primaryBtnLink || '/shop'} className="btn-primary group">
              <span>{hero.primaryBtnText}</span>
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <a
              href={hero.secondaryBtnLink || '#featured'}
              className="btn-outline group"
            >
              <span>{hero.secondaryBtnText}</span>
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-14 pt-8 border-t border-aura-dark/10 flex items-center gap-6"
          >
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-100 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="" />
              <img className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-100 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="" />
              <img className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-100 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces" alt="" />
            </div>
            <div className="text-xs font-sans text-aura-dark/70">
              <p className="font-semibold text-aura-dark">500+ Hand-Curated Archives</p>
              <p className="text-aura-muted">Ranked 5.0 ★ by conscious fashion collectors</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: 3D Interactive Showcase of Admin's Selected Hero Product */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md perspective-[1200px]"
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
              }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-cream-300 bg-cream-100 aspect-[3/4] group cursor-pointer"
            >
              <img
                src={featuredImg}
                alt={featuredProduct?.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/85 via-aura-dark/20 to-transparent" />

              <div
                style={{ transform: 'translateZ(30px)' }}
                className="absolute top-5 left-5 glass-card px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-sans tracking-[0.2em] uppercase text-aura-dark font-medium shadow-sm"
              >
                <Sparkles size={11} className="text-aura-gold" />
                <span>Curator's Spotlight</span>
              </div>

              <div
                style={{ transform: 'translateZ(30px)' }}
                className="absolute top-5 right-5 bg-aura-dark text-cream-100 px-3 py-1 text-[10px] font-sans tracking-widest uppercase font-semibold"
              >
                {featuredProduct?.condition || 'Like New'}
              </div>

              {/* Bottom Details Card */}
              <div
                style={{ transform: 'translateZ(40px)' }}
                className="absolute bottom-6 left-6 right-6 text-cream-100"
              >
                <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-aura-gold mb-1">
                  {featuredProduct?.categories?.name || 'Archival'}
                </p>
                <h3 className="font-serif text-2xl font-normal text-cream-50 leading-tight mb-2">
                  {featuredProduct?.name}
                </h3>
                <div className="flex items-center justify-between pt-3 border-t border-cream-100/20">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-xl font-medium text-cream-50">
                      Rs. {Number(featuredProduct?.price || 0).toLocaleString()}
                    </span>
                    {featuredProduct?.original_price && (
                      <span className="font-sans text-xs text-cream-200/50 line-through">
                        Rs. {Number(featuredProduct.original_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/product/${featuredProduct?.id}`}
                    className="glass-card text-aura-dark hover:bg-cream-100 px-4 py-2 text-xs font-sans tracking-widest uppercase font-medium transition-colors rounded-sm inline-flex items-center gap-1.5"
                  >
                    <span>View Piece</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            <div
              style={{ transform: 'translateZ(50px)' }}
              className="hidden sm:flex absolute -bottom-6 -left-8 glass-card p-4 rounded-xl shadow-xl border border-aura-gold/20 items-center gap-3.5 max-w-xs"
            >
              <div className="w-10 h-10 rounded-full bg-aura-dark text-cream-100 flex items-center justify-center shrink-0">
                <Feather size={18} className="text-aura-gold" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-sans uppercase tracking-widest text-aura-muted">Authentic Archive</p>
                <p className="text-xs font-serif text-aura-dark font-medium">{featuredProduct?.name}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Ribbon */}
      <div className="max-w-7xl mx-auto w-full pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-aura-dark/10">
        {[
          { icon: ShieldCheck, title: '100% Authenticated', sub: 'Verified vintage provenance' },
          { icon: Sparkles, title: 'One-of-a-Kind', sub: 'Unique piece per listing' },
          { icon: RefreshCw, title: 'Circular Fashion', sub: 'Zero virgin fabric waste' },
          { icon: Feather, title: 'Dry-Cleaned & Ready', sub: 'Eco steam-sanitized' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <item.icon size={18} className="text-aura-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-aura-dark">
                {item.title}
              </h4>
              <p className="font-sans text-[11px] text-aura-muted mt-0.5">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
