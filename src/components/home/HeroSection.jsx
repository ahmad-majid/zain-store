import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useStoreSettings } from '../../context/StoreSettingsContext'

export default function HeroSection() {
  const { settings, products } = useStoreSettings()
  const { hero } = settings

  // Find featured product selected by admin, or fallback to first product
  const featuredProduct = products.find((p) => p.id === hero.featuredProductId) || products[0]
  const featuredImg = featuredProduct?.colors?.[0]?.images?.[0] || featuredProduct?.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between pt-24 pb-16 px-6 lg:px-12 overflow-hidden">
      {/* Subtle luxury glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cream-300/30 via-aura-gold/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column: Editorial Typography */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-8 h-px bg-aura-gold" />
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-muted font-medium">
              {hero.eyebrow}
            </span>
          </div>

          <div className="mb-6">
            <h1 className="hero-title text-aura-dark font-serif font-normal">
              {hero.titleMain}
            </h1>
            <h1 className="hero-sub font-serif italic text-aura-warm font-normal -mt-2 md:-mt-5">
              {hero.titleSub}
            </h1>
          </div>

          <p className="font-sans text-base md:text-lg text-aura-dark/70 max-w-xl leading-relaxed mb-10 font-normal">
            {hero.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
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
          </div>

          {/* Social Proof */}
          <div className="mt-14 pt-8 border-t border-aura-dark/10 flex items-center gap-6">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-100 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="" />
              <img className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-100 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="" />
              <img className="inline-block h-9 w-9 rounded-full ring-2 ring-cream-100 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces" alt="" />
            </div>
            <div className="text-xs font-sans text-aura-dark/70">
              <p className="font-semibold text-aura-dark">500+ Hand-Curated Archives</p>
              <p className="text-aura-muted">Ranked 5.0 ★ by conscious fashion collectors</p>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Showcase of Admin's Selected Hero Product */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-cream-300 bg-cream-100 aspect-[3/4] group">
              <img
                src={featuredImg}
                alt={featuredProduct?.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/85 via-aura-dark/20 to-transparent" />

              <div className="absolute top-5 left-5 glass-card px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-sans tracking-[0.2em] uppercase text-aura-dark font-medium shadow-sm">
                <Sparkles size={11} className="text-aura-gold" />
                <span>Curator's Spotlight</span>
              </div>

              <div className="absolute top-5 right-5 bg-aura-dark text-cream-100 px-3 py-1 text-[10px] font-sans tracking-widest uppercase font-semibold">
                {featuredProduct?.condition || 'Like New'}
              </div>

              {/* Bottom Details Card */}
              <div className="absolute bottom-6 left-6 right-6 text-cream-100">
                <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-aura-gold mb-1">
                  {featuredProduct?.categories?.name || 'Archival'}
                </p>
                <h3 className="font-serif text-2xl font-normal text-cream-50 leading-tight mb-2">
                  {featuredProduct?.name}
                </h3>
                <div className="flex items-center justify-between pt-3 border-t border-cream-100/20">
                  <div>
                    <span className="font-sans text-xs text-cream-200/70 block">Archival Value</span>
                    <span className="font-sans text-xl font-bold text-cream-50 font-mono">
                      Rs. {Number(featuredProduct?.price || 0).toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/product/${featuredProduct?.id}`}
                    className="px-4 py-2 bg-cream-100 text-aura-dark text-xs font-sans tracking-wider uppercase font-semibold hover:bg-aura-gold transition-colors flex items-center gap-1.5 rounded-md"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
