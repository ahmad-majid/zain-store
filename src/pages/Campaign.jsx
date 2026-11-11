import { useParams, Link } from 'react-router-dom'
import { useStoreSettings } from '../context/StoreSettingsContext'
import ProductCard from '../components/ui/ProductCard'
import { ArrowLeft, Sparkles, Tag } from 'lucide-react'

export default function Campaign() {
  const { slug } = useParams()
  const { settings, products } = useStoreSettings()

  const campaign = settings.campaigns?.find((c) => c.slug === slug)

  // Get products assigned to this campaign
  const campaignProducts = products.filter((p) =>
    campaign?.productIds?.includes(p.id)
  )

  if (!campaign) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-6 flex flex-col items-center justify-center text-center relative z-10">
        <h2 className="font-serif text-3xl text-aura-dark mb-2">Campaign Not Found</h2>
        <p className="font-sans text-sm text-aura-muted mb-6">This curated sale or drop is no longer active.</p>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-24 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-aura-dark/10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wider uppercase text-aura-muted hover:text-aura-dark transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            <span>All Collections</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] font-sans tracking-widest uppercase text-aura-gold font-semibold">
            <Tag size={13} />
            <span>Special Curator Event</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[24/8] bg-aura-dark mb-12 shadow-xl border border-cream-100/10">
          <img
            src={campaign.bannerImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=600&fit=crop&q=85'}
            alt={campaign.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aura-dark via-aura-dark/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 max-w-2xl text-cream-100">
            <span className="glass-card px-3 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase font-semibold text-aura-dark mb-3 inline-block">
              Exclusive Drop
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-cream-50 leading-tight mb-2">
              {campaign.title}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-cream-200/80 font-light">
              {campaign.subtitle}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-aura-dark/10">
          <p className="font-sans text-xs text-aura-muted uppercase tracking-wider">
            Showing <strong className="text-aura-dark">{campaignProducts.length}</strong> selected pieces in this drop
          </p>
        </div>

        {campaignProducts.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl max-w-md mx-auto p-8">
            <p className="font-serif text-2xl text-aura-dark mb-2">No pieces in this drop yet</p>
            <p className="font-sans text-xs text-aura-muted mb-6">Pieces will be assigned by the curator shortly.</p>
            <Link to="/shop" className="btn-primary">Browse All Items</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaignProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
