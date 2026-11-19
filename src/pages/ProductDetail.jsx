import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { sampleProducts } from '../data/sampleProducts'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ui/ProductCard'
import {
  ShoppingBag, ArrowLeft, Heart, ShieldCheck, Sparkles, Truck, RefreshCw, Check,
  Maximize2, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Share2, Copy, MessageCircle, Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // Color & Angle Selection
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [selectedAngleIdx, setSelectedAngleIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const liked = isWishlisted(product?.id)

  // Social Share & Recently Viewed
  const [copiedLink, setCopiedLink] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, author: user?.user_metadata?.full_name || '', comment: '' })

  // Lightbox Zoom Inspection
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      setSelectedQuantity(1)

      // Check stored custom products from Admin CRM first, then sampleProducts
      let localMatch = null
      try {
        const storedProducts = JSON.parse(localStorage.getItem('thrift-aura-products') || '[]')
        localMatch = storedProducts.find((p) => p.id === id)
      } catch {}
      if (!localMatch) {
        localMatch = sampleProducts.find((p) => p.id === id)
      }

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

  // Dynamic Document Title
  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | Thrift Aura Archival Boutique`
    } else {
      document.title = 'Thrift Aura | Archival Vintage Luxury'
    }
    return () => {
      document.title = 'Thrift Aura | Archival Vintage Luxury'
    }
  }, [product])

  // Track & Load Recently Viewed
  useEffect(() => {
    if (!product) return
    try {
      const stored = JSON.parse(localStorage.getItem('thrift-aura-recently-viewed') || '[]')
      const updated = [
        product,
        ...stored.filter((p) => p.id !== product.id),
      ].slice(0, 6)
      localStorage.setItem('thrift-aura-recently-viewed', JSON.stringify(updated))
      setRecentlyViewed(updated.filter((p) => p.id !== product.id))
    } catch (e) {
      console.warn('Failed tracking recently viewed', e)
    }
  }, [product])

  // Load Reviews for this Product
  useEffect(() => {
    if (!id) return
    try {
      const allReviews = JSON.parse(localStorage.getItem('thrift-aura-reviews') || '{}')
      const defaultSampleReviews = [
        {
          id: 'rev-1',
          author: 'Julian Vane',
          rating: 5,
          date: 'Nov 12, 2026',
          comment: 'Historical drape is immaculate. The wool weave matches museum archive references exactly. Packaged with museum-grade tissue.',
          verified: true,
        },
        {
          id: 'rev-2',
          author: 'Sophia Chen',
          rating: 5,
          date: 'Nov 04, 2026',
          comment: 'Authenticated hardware and impeccable stitch density. Arrived in pristine condition within 48 hours.',
          verified: true,
        },
      ]
      setReviews(allReviews[id] || defaultSampleReviews)
    } catch {
      setReviews([])
    }
  }, [id])

  // Save new review
  const handleAddReview = (e) => {
    e.preventDefault()
    if (!newReview.comment.trim()) return
    const reviewObj = {
      id: `rev-${Date.now()}`,
      author: newReview.author.trim() || user?.user_metadata?.full_name || 'Archival Collector',
      rating: Number(newReview.rating) || 5,
      date: 'Just now',
      comment: newReview.comment.trim(),
      verified: Boolean(user),
    }
    const updated = [reviewObj, ...reviews]
    setReviews(updated)
    try {
      const allReviews = JSON.parse(localStorage.getItem('thrift-aura-reviews') || '{}')
      allReviews[id] = updated
      localStorage.setItem('thrift-aura-reviews', JSON.stringify(allReviews))
    } catch (err) {
      console.warn('Failed saving review', err)
    }
    setReviewModalOpen(false)
    setNewReview({ rating: 5, author: user?.user_metadata?.full_name || '', comment: '' })
    showToast({
      name: 'Review Published',
      color: 'Collector Authenticated',
      size: `${newReview.rating} Stars`,
      image: currentImage,
    })
  }

  // Social Share Handlers
  const shareUrl = window.location.href
  const shareTitle = product ? `${product.name} at Thrift Aura Archival Boutique` : 'Thrift Aura'

  const handleShareWhatsApp = () => {
    const text = `Take a look at this one-of-a-kind piece from Thrift Aura:\n*${product?.name}*\nPrice: Rs. ${Number(product?.price).toLocaleString()}\n${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `One-of-a-kind vintage archival piece: ${product?.name}`,
          url: shareUrl,
        })
      } catch (err) {
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  const colors = product?.colors || []
  const activeColor = colors[selectedColorIdx] || colors[0] || { name: 'Standard', hex: '#000', images: [] }
  const activeImages = activeColor.images || []
  const currentImage = activeImages[selectedAngleIdx] || activeImages[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) {
      document.body.style.overflow = 'unset'
      return
    }
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
        setIsZoomed(false)
      } else if (e.key === 'ArrowRight') {
        setSelectedAngleIdx((prev) => (prev + 1) % (activeImages.length || 1))
      } else if (e.key === 'ArrowLeft') {
        setSelectedAngleIdx((prev) => (prev - 1 + (activeImages.length || 1)) % (activeImages.length || 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxOpen, activeImages.length])

  const angles = [
    { label: 'Front Angle', idx: 0 },
    { label: 'Profile View', idx: 1 },
    { label: 'Fabric Texture', idx: 2 },
    { label: 'Styled Silhouette', idx: 3 },
  ]

  const productStock = typeof product?.stock === 'number' ? product.stock : 1
  const isSoldOut = productStock <= 0

  const handleAddToCart = () => {
    if (!product || isSoldOut) return
    const qtyToAdd = Math.min(productStock, Math.max(1, selectedQuantity))
    addItem(
      {
        ...product,
        selectedColor: activeColor.name,
      },
      selectedSize || 'Standard',
      qtyToAdd
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
    showToast({
      name: qtyToAdd > 1 ? `${product.name} (×${qtyToAdd})` : product.name,
      color: activeColor.name,
      size: selectedSize || 'Standard',
      image: activeImages[0] || currentImage,
    })
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
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-cream-200 border border-cream-300 shadow-xl group">
              <img
                src={currentImage}
                alt={`${product.name} - ${activeColor.name}`}
                onClick={() => {
                  setIsZoomed(false)
                  setLightboxOpen(true)
                }}
                className="w-full h-full object-cover transition-all duration-500 cursor-zoom-in"
              />

              {/* Inspect / Zoom Button */}
              <button
                type="button"
                onClick={() => {
                  setIsZoomed(false)
                  setLightboxOpen(true)
                }}
                className="absolute bottom-4 left-4 glass-card px-3 py-1.5 rounded-full text-aura-dark hover:bg-aura-gold hover:text-aura-dark shadow-md transition-all flex items-center gap-1.5 z-20 text-[10px] font-sans uppercase font-bold tracking-wider"
                title="Inspect Archival Detail"
              >
                <Maximize2 size={12} />
                <span>Zoom &amp; Inspect</span>
              </button>

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
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {isSoldOut ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-200 border border-stone-300 text-stone-700 text-[10px] font-sans font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                  Archival Piece Sold Out / In Vault
                </span>
              ) : productStock === 1 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-700 text-[10px] font-sans font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  Only 1 in Archive • Unique Piece
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/10 border border-emerald-600/30 text-emerald-800 text-[10px] font-sans font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {productStock} Available in Archive Stock
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-aura-gold/15 border border-aura-gold/30 text-aura-dark text-[10px] font-sans font-semibold">
                <Star size={11} className="fill-aura-gold text-aura-gold" />
                <span>4.9 ({reviews.length + 12} Verified Reviews)</span>
              </span>
            </div>

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

            {/* Quantity Selector */}
            {!isSoldOut && (
              <div className="flex items-center justify-between mb-5 p-3.5 rounded-xl bg-cream-100/70 border border-aura-dark/10">
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-aura-dark font-semibold">
                    Acquisition Quantity
                  </span>
                  <span className="font-sans text-[10px] text-aura-muted">
                    {productStock > 1 ? `${productStock} curated units available in current archive stock` : 'Rare 1-of-1 singular archival acquisition'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {productStock > 1 ? (
                    <div className="inline-flex items-center border border-aura-dark/20 rounded-lg bg-white overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                        disabled={selectedQuantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-aura-dark hover:bg-cream-100 transition-colors disabled:opacity-30 font-mono text-sm font-bold"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 font-mono text-xs font-bold text-aura-dark min-w-[32px] text-center">
                        {selectedQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity((q) => Math.min(productStock, q + 1))}
                        disabled={selectedQuantity >= productStock}
                        className="w-8 h-8 flex items-center justify-center text-aura-dark hover:bg-cream-100 transition-colors disabled:opacity-30 font-mono text-sm font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="px-3 py-1 rounded-md bg-white border border-aura-dark/15 font-mono text-xs font-bold text-aura-dark shadow-xs">
                      1 Piece (1 of 1)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`flex-1 py-4 px-6 rounded-md text-xs font-sans tracking-[0.25em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md ${
                  isSoldOut
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : added
                    ? 'bg-aura-gold text-aura-dark'
                    : 'bg-aura-dark text-cream-100 hover:bg-aura-gold hover:text-aura-dark'
                }`}
              >
                {isSoldOut ? (
                  <span>Archival Piece Sold Out</span>
                ) : added ? (
                  <>
                    <Check size={16} />
                    <span>Added {selectedQuantity > 1 ? `(${selectedQuantity}× ${activeColor.name})` : `(${activeColor.name})`}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>
                      Add to Bag • {productStock > 1 ? `${selectedQuantity} of ${productStock} Available` : '1 Available'}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => product && toggleWishlist(product.id)}
                className={`p-4 border rounded-md transition-all ${
                  liked
                    ? 'bg-red-50 border-red-200 text-red-500 scale-105'
                    : 'border-aura-dark/20 text-aura-dark hover:border-aura-dark'
                }`}
                title="Wishlist"
              >
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Social Share Row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-aura-dark/10 mb-6 text-xs font-sans shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-aura-muted font-semibold flex items-center gap-1.5">
                <Share2 size={13} className="text-aura-gold" />
                Share Piece:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 text-[11px] font-medium"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="px-3 py-1.5 rounded-lg bg-cream-100 text-aura-dark hover:bg-cream-200 border border-aura-dark/15 transition-colors flex items-center gap-1.5 text-[11px] font-medium"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>
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

        {/* ─── Collector Testimonials & Provenance Reviews ─── */}
        <div className="mt-24 pt-16 border-t border-aura-dark/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2 text-aura-gold">
                <Sparkles size={13} />
                <span className="font-sans text-[11px] uppercase tracking-[0.3em] font-semibold text-aura-dark/60">
                  Client Provenance
                </span>
              </div>
              <h2 className="font-serif text-3xl font-normal text-aura-dark">
                Collector Authentications &amp; Reviews
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-aura-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-aura-gold" />
                  ))}
                </div>
                <span className="font-sans text-xs font-bold text-aura-dark">4.9 / 5.0</span>
                <span className="font-sans text-xs text-aura-muted">({reviews.length} Collector Verified)</span>
              </div>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="btn-outline py-2.5 px-6 text-xs flex items-center gap-2 self-start md:self-auto"
            >
              <Star size={13} />
              <span>Submit Archival Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl bg-white border border-aura-gold/20 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-aura-dark">{rev.author}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-sans font-bold uppercase tracking-wider border border-emerald-200">
                        <Check size={10} /> Verified Collector
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-sans text-aura-muted">{rev.date}</span>
                </div>
                <div className="flex items-center text-aura-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-aura-gold" />
                  ))}
                </div>
                <p className="font-sans text-xs text-aura-dark/80 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Recently Examined in the Archive ─── */}
        {recentlyViewed.length > 0 && (
          <div className="mt-24 pt-16 border-t border-aura-dark/10">
            <div className="mb-10">
              <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-muted font-medium mb-1 block">
                Your Browsing Log
              </span>
              <h2 className="font-serif text-3xl font-normal text-aura-dark">
                Recently Examined <span className="italic text-aura-warm">Pieces</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentlyViewed.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Review Modal ─── */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aura-dark/80 backdrop-blur-sm overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) setReviewModalOpen(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-aura-gold/40 shadow-2xl w-full max-w-md p-6 sm:p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-aura-dark/10">
                <h3 className="font-serif text-2xl text-aura-dark">Collector Review</h3>
                <button onClick={() => setReviewModalOpen(false)} className="p-1 text-aura-muted hover:text-aura-dark">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddReview} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.author}
                    onChange={(e) => setNewReview((p) => ({ ...p, author: e.target.value }))}
                    placeholder="e.g. Julian Vane"
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview((p) => ({ ...p, rating: star }))}
                        className="p-1 text-aura-gold"
                      >
                        <Star size={22} className={star <= newReview.rating ? 'fill-aura-gold' : 'text-stone-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Archival Experience &amp; Garment Fit</label>
                  <textarea
                    required
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview((p) => ({ ...p, comment: e.target.value }))}
                    placeholder="Describe the fabric weave, fit, and condition upon arrival..."
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setReviewModalOpen(false)} className="btn-outline py-2.5 px-5">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary py-2.5 px-6">
                    Publish Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── High-Resolution Lightbox & Studio Inspector ─── */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-dark/95 backdrop-blur-md p-4 sm:p-8">
            {/* Top Bar with Title, Angle indicator & Close */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-50 text-cream-100 bg-gradient-to-b from-black/60 to-transparent">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-cream-50 font-normal">
                  {product.name}
                </h3>
                <p className="font-sans text-[11px] text-cream-300/70 tracking-widest uppercase">
                  {activeColor.name} · {angles[selectedAngleIdx]?.label} ({selectedAngleIdx + 1} of {activeImages.length})
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* 2x Magnify toggle */}
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-all ${
                    isZoomed
                      ? 'bg-aura-gold text-aura-dark shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-cream-100'
                  }`}
                  title={isZoomed ? 'Reset zoom' : 'Magnify 2x texture inspection'}
                >
                  {isZoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
                  <span className="hidden sm:inline">{isZoomed ? 'Zoom 1x' : 'Inspect 2x'}</span>
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => {
                    setLightboxOpen(false)
                    setIsZoomed(false)
                  }}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-aura-gold hover:text-aura-dark text-cream-100 flex items-center justify-center transition-colors"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Previous Arrow */}
            {activeImages.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedAngleIdx((prev) => (prev - 1 + activeImages.length) % activeImages.length)}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/10 hover:bg-aura-gold hover:text-aura-dark text-cream-100 flex items-center justify-center transition-colors shadow-xl"
                title="Previous Angle (Left Arrow)"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next Arrow */}
            {activeImages.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedAngleIdx((prev) => (prev + 1) % activeImages.length)}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/10 hover:bg-aura-gold hover:text-aura-dark text-cream-100 flex items-center justify-center transition-colors shadow-xl"
                title="Next Angle (Right Arrow)"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Main Stage Image in Lightbox */}
            <div className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center overflow-hidden my-auto select-none">
              <motion.img
                key={`${selectedColorIdx}-${selectedAngleIdx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: isZoomed ? 1.7 : 1,
                }}
                transition={{ duration: 0.25 }}
                src={currentImage}
                alt=""
                onClick={() => setIsZoomed(!isZoomed)}
                className={`max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform ${
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              />
            </div>

            {/* Bottom Angle Rail & Color Indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2.5 z-40 px-4">
              <div className="flex gap-2 p-1.5 bg-black/50 backdrop-blur-md rounded-xl border border-white/10">
                {activeImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedAngleIdx(i)
                      setIsZoomed(false)
                    }}
                    className={`w-12 h-14 rounded-md overflow-hidden border-2 transition-all p-0.5 ${
                      selectedAngleIdx === i
                        ? 'border-aura-gold ring-2 ring-aura-gold/50 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-xs" />
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-sans tracking-widest uppercase text-cream-300/50">
                Click photo or press Esc to close • Use ← / → arrows
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
