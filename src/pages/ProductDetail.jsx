import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { sampleProducts } from '../data/sampleProducts'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ui/ProductCard'
import { ShoppingBag, ArrowLeft, Heart, ShieldCheck, Sparkles, Truck, RefreshCw, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // Color & Angle Selection
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [selectedAngleIdx, setSelectedAngleIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      const localMatch = sampleProducts.find((p) => p.id === id)

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name, slug)')
          .eq('id', id)
          .single()

        if (!error && data) {
          setProduct({
            ...data,
            colors: data.colors || localMatch?.colors || [
              {
                name: 'Classic Vintage',
                hex: '#3E3E3E',
                images: data.images || ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'],
              },
            ],
          })
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
        } else if (localMatch) {
          setProduct(localMatch)
          if (localMatch.sizes?.length > 0) setSelectedSize(localMatch.sizes[0])
        } else {
          setProduct(null)
        }
      } catch (err) {
        if (localMatch) {
          setProduct(localMatch)
          if (localMatch.sizes?.length > 0) setSelectedSize(localMatch.sizes[0])
        }
      }
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    fetchDetail()
  }, [id])

  const colors = product?.colors || []
  const activeColor = colors[selectedColorIdx] || colors[0] || { name: 'Standard', hex: '#000', images: [] }
  const activeImages = activeColor.images || []
  const currentImage = activeImages[selectedAngleIdx] || activeImages[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'

  const angles = [
    { label: 'Front Angle', idx: 0 },
    { label: 'Profile View', idx: 1 },
    { label: 'Fabric Texture', idx: 2 },
    { label: 'Styled Silhouette', idx: 3 },
  ]

  const handleAddToCart = () => {
    if (!product) return
    addItem(
      {
        ...product,
        selectedColor: activeColor.name,
      },
      selectedSize || 'Standard'
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  // Related products
  const related = useMemo(() => {
    return sampleProducts.filter((p) => p.id !== id).slice(0, 4)
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen pt-36 px-6 lg:px-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-aura-dark border-t-aura-gold rounded-full animate-spin" />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h2 className="font-serif text-3xl text-aura-dark mb-3">Garment Not Found</h2>
        <p className="font-sans text-sm text-aura-muted mb-8">This archival piece may have already found a new home.</p>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </main>
    )
  }

  const discount = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-aura-dark/10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-aura-muted hover:text-aura-dark transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            <span>Back to Collection</span>
          </button>
          <span className="font-sans text-[11px] uppercase tracking-widest text-aura-gold font-semibold">
            One of One Archival
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Gallery Stage (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Wooden Hanger Assembly */}
            <div className="hanger-hook mb-0.5" />
            <div className="hanger-bar w-56 sm:w-72 h-3.5 mb-3" />

            {/* Main Stage with Right Side Hanging Tags */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-cream-200 border border-cream-300 shadow-xl">
              <img
                src={currentImage}
                alt={`${product.name} - ${activeColor.name}`}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Tag / Badge */}
              <div className="absolute top-4 left-4 glass-card px-3.5 py-1.5 rounded-full text-[10px] font-sans tracking-widest uppercase font-semibold text-aura-dark shadow-sm">
                {product.condition} Condition • {angles[selectedAngleIdx]?.label}
              </div>

              {/* ─── Hanging Color Tags on the Right (Video signature!) ─── */}
              <div className="absolute top-6 right-5 flex flex-col gap-3 z-30">
                {colors.map((color, idx) => {
                  const isActive = selectedColorIdx === idx
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedColorIdx(idx)
                        setSelectedAngleIdx(0)
                      }}
                      className="flex flex-col items-center cursor-pointer group"
                      title={`Switch to ${color.name}`}
                    >
                      <div className="hangtag-string group-hover:bg-aura-gold transition-colors" />
                      <div
                        style={{ backgroundColor: color.hex }}
                        className={`hangtag-body border ${
                          isActive
                            ? 'ring-2 ring-aura-gold ring-offset-2 scale-110 shadow-xl'
                            : 'border-black/30 opacity-80 group-hover:opacity-100'
                        }`}
                      >
                        <div className="hangtag-hole" />
                        <span className={`text-[8px] font-sans font-bold uppercase tracking-tighter text-center leading-none ${
                          color.hex === '#141414' || color.hex === '#232528' || color.hex === '#111215' || color.hex === '#5E1924' || color.hex === '#1E1E1E' || color.hex === '#1B263B'
                            ? 'text-cream-100'
                            : 'text-aura-dark'
                        }`}>
                          {color.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 4 Angle Thumbnails Rail Below */}
            {activeImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3 w-full mt-4">
                {activeImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAngleIdx(i)}
                    className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-cream-50 ${
                      selectedAngleIdx === i
                        ? 'border-aura-dark ring-2 ring-aura-gold shadow-md'
                        : 'border-aura-dark/15 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-sm" />
                    <span className="block text-[9px] font-sans font-medium uppercase tracking-wider text-aura-dark mt-1 text-center truncate">
                      {angles[i]?.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-aura-gold" />
              <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-aura-muted font-medium">
                {product.categories?.name || 'Curated Silhouette'}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-normal text-aura-dark leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-aura-dark/10">
              <span className="font-sans text-2xl font-semibold text-aura-dark">
                Rs. {Number(product.price).toLocaleString()}
              </span>
              {product.original_price && (
                <>
                  <span className="font-sans text-base text-aura-dark/40 line-through">
                    Rs. {Number(product.original_price).toLocaleString()}
                  </span>
                  <span className="bg-aura-dark text-cream-100 text-[10px] font-sans tracking-widest uppercase px-2 py-0.5 rounded-sm">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Color Swatch Selector Pill */}
            <div className="mb-6 p-4 rounded-xl bg-cream-100/90 border border-aura-dark/10">
              <div className="flex items-center justify-between text-xs font-sans mb-2">
                <span className="text-aura-muted uppercase tracking-wider text-[11px]">Selected Colorway:</span>
                <strong className="text-aura-dark font-medium">{activeColor.name}</strong>
              </div>
              <div className="flex gap-2">
                {colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColorIdx(idx)
                      setSelectedAngleIdx(0)
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-sans transition-all ${
                      selectedColorIdx === idx
                        ? 'border-aura-dark bg-cream-50 shadow-sm'
                        : 'border-aura-dark/15 text-aura-dark/60 hover:border-aura-dark'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: c.hex }}
                      className="w-3.5 h-3.5 rounded-full border border-black/25 shrink-0"
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="font-sans text-sm text-aura-dark/70 leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            {/* Condition Card */}
            <div className="glass-card p-4 rounded-xl border border-aura-gold/25 mb-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold uppercase tracking-wider text-aura-dark">Provenance & Grading</span>
                <span className="text-aura-warm font-medium">{product.condition}</span>
              </div>
              <p className="text-[11px] font-sans text-aura-muted leading-normal">
                Garment inspected by our archival curators. Professionally eco steam-sanitized, odor-free, with original stitching intact.
              </p>
            </div>

            {/* Sizing */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="font-sans text-[11px] uppercase tracking-widest text-aura-dark font-semibold">
                    Select Size
                  </span>
                  <span className="font-sans text-[11px] text-aura-muted">Vintage fit note: true to size</span>
                </div>
                <div className="flex gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] h-10 px-3.5 border rounded-md text-xs font-sans uppercase font-medium transition-all ${
                        selectedSize === s
                          ? 'border-aura-dark bg-aura-dark text-cream-100'
                          : 'border-aura-dark/20 text-aura-dark hover:border-aura-dark'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-md text-xs font-sans tracking-[0.25em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md ${
                  added
                    ? 'bg-aura-gold text-aura-dark'
                    : 'bg-aura-dark text-cream-100 hover:bg-aura-gold hover:text-aura-dark'
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added ({activeColor.name})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Bag • 1 Available</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setLiked(!liked)}
                className={`p-4 border rounded-md transition-all ${
                  liked
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-aura-dark/20 text-aura-dark hover:border-aura-dark'
                }`}
                title="Wishlist"
              >
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust Accordions */}
            <div className="space-y-3 pt-6 border-t border-aura-dark/10 text-xs font-sans text-aura-dark/70">
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-aura-gold shrink-0" />
                <span>Complimentary express delivery on orders over Rs. 3,000</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-aura-gold shrink-0" />
                <span>100% money-back authenticity guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw size={16} className="text-aura-gold shrink-0" />
                <span>Easy 7-day circular returns policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Curations */}
        <div className="mt-28 pt-16 border-t border-aura-dark/10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-muted font-medium mb-1 block">
                Complete The Silhouette
              </span>
              <h2 className="font-serif text-3xl font-normal text-aura-dark">
                You May Also <span className="italic text-aura-warm">Admire</span>
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-sans tracking-[0.2em] uppercase text-aura-dark hover:text-aura-warm font-semibold underline underline-offset-4"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
