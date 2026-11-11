import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Heart, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductCard({ product }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  // Color & Angle State
  const colors = product.colors || [
    {
      name: 'Default',
      hex: '#2d2d2d',
      images: product.images || [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&h=950&fit=crop&q=85',
      ],
    },
  ]
  const [activeColorIdx, setActiveColorIdx] = useState(0)
  const [activeAngleIdx, setActiveAngleIdx] = useState(0)

  const activeColor = colors[activeColorIdx] || colors[0]
  const currentImages = activeColor.images || []
  const displayImage = currentImages[activeAngleIdx] || currentImages[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&h=950&fit=crop&q=85'

  const { addItem } = useCart()

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -6, y: x * 6 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
    setActiveAngleIdx(0)
  }

  const handleSelectColor = (e, idx) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveColorIdx(idx)
    setActiveAngleIdx(0)
  }

  const handleNextAngle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveAngleIdx((prev) => (prev + 1) % currentImages.length)
  }

  const handlePrevAngle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveAngleIdx((prev) => (prev - 1 + currentImages.length) % currentImages.length)
  }

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(
      {
        ...product,
        selectedColor: activeColor.name,
      },
      product.sizes?.[0] || 'Standard'
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
  }

  const discount = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="product-card group relative flex flex-col justify-between"
    >
      <Link to={`/product/${product.id}`} className="block relative">
        {/* Main Image Container */}
        <div className="relative overflow-hidden bg-cream-200 aspect-[3/4] rounded-xl border border-aura-dark/10 shadow-sm transition-all duration-300 group-hover:shadow-2xl">
          <img
            src={displayImage}
            alt={`${product.name} - ${activeColor.name}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Vignette on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/75 via-aura-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {discount && (
              <span className="bg-aura-dark text-cream-100 text-[10px] font-sans font-semibold tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                -{discount}%
              </span>
            )}
            <span className="glass-card text-aura-dark text-[9px] font-sans font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm shadow-sm">
              {product.condition}
            </span>
          </div>

          {/* Top Right Wishlist Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-20 ${
              liked
                ? 'bg-red-50 text-red-500 scale-110 shadow-md'
                : 'glass-card text-aura-dark/70 hover:text-aura-dark hover:scale-105'
            }`}
            title="Save to Wishlist"
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          </button>

          {/* ─── Hanging Color Hangtags on the Right Edge (Video interaction!) ─── */}
          <div className="absolute top-12 right-2.5 flex flex-col gap-2 z-30">
            {colors.map((color, idx) => {
              const isSelected = activeColorIdx === idx
              return (
                <div
                  key={idx}
                  onClick={(e) => handleSelectColor(e, idx)}
                  onMouseEnter={(e) => handleSelectColor(e, idx)}
                  className="flex flex-col items-center cursor-pointer group/tag"
                  title={`Color: ${color.name}`}
                >
                  <div className="w-0.5 h-3 bg-stone-400 group-hover/tag:bg-aura-gold transition-colors" />
                  <div
                    style={{ backgroundColor: color.hex }}
                    className={`w-6 h-9 rounded-xs shadow-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'ring-2 ring-aura-gold scale-115 shadow-xl border-white'
                        : 'border-black/30 opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cream-100/60" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Angle Carousel Arrow Controls (Visible on hover when 4 images exist) */}
          {currentImages.length > 1 && isHovered && (
            <>
              <button
                onClick={handlePrevAngle}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full glass-card text-aura-dark hover:bg-cream-100 transition-colors z-20"
                title="Previous Angle"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleNextAngle}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full glass-card text-aura-dark hover:bg-cream-100 transition-colors z-20"
                title="Next Angle"
              >
                <ChevronRight size={14} />
              </button>
            </>
          )}

          {/* Angle Dots Indicator at Bottom */}
          {currentImages.length > 1 && (
            <div className="absolute bottom-16 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
              {currentImages.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeAngleIdx === i
                      ? 'bg-cream-100 w-3'
                      : 'bg-cream-100/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick Add Action Bar */}
          <div className="product-cta absolute bottom-3 inset-x-3 z-20">
            <button
              onClick={handleQuickAdd}
              className={`w-full py-2.5 px-3 text-[11px] font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 rounded-md shadow-lg ${
                added
                  ? 'bg-aura-gold text-aura-dark'
                  : 'bg-cream-100 text-aura-dark hover:bg-aura-dark hover:text-cream-100'
              }`}
            >
              {added ? (
                <>
                  <Check size={14} />
                  <span>Added ({activeColor.name})</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Info Section */}
      <div className="pt-3.5 flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px] font-sans text-aura-muted uppercase tracking-widest">
          <span>{product.categories?.name || 'Archive'}</span>
          <span className="text-aura-warm font-medium">{activeColor.name}</span>
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-serif text-lg font-normal text-aura-dark group-hover:text-aura-warm transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-base font-semibold text-aura-dark">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {product.original_price && (
              <span className="font-sans text-xs text-aura-dark/40 line-through">
                Rs. {Number(product.original_price).toLocaleString()}
              </span>
            )}
          </div>

          <span className="text-[10px] font-sans text-aura-muted uppercase tracking-wider">
            {colors.length} {colors.length === 1 ? 'Color' : 'Colors'} • 4 Angles
          </span>
        </div>
      </div>
    </motion.div>
  )
}
