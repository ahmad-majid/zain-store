import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { sampleProducts } from '../../data/sampleProducts'
import { useCart } from '../../context/CartContext'
import { Sparkles, ChevronLeft, ChevronRight, ShoppingBag, Check, Eye } from 'lucide-react'

export default function ClothingRackShowcase() {
  const [selectedProduct, setSelectedProduct] = useState(sampleProducts[0])
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [selectedAngleIdx, setSelectedAngleIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const rackRef = useRef(null)
  const { addItem } = useCart()

  const currentColors = selectedProduct?.colors || []
  const activeColor = currentColors[selectedColorIdx] || currentColors[0]
  const activeImages = activeColor?.images || []
  const currentImage = activeImages[selectedAngleIdx] || activeImages[0]

  const angles = [
    { label: 'FRONT', idx: 0 },
    { label: 'PROFILE', idx: 1 },
    { label: 'TEXTURE', idx: 2 },
    { label: 'BACK', idx: 3 },
  ]

  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    setSelectedColorIdx(0)
    setSelectedAngleIdx(0)
  }

  const handleSelectColor = (idx) => {
    setSelectedColorIdx(idx)
    setSelectedAngleIdx(0)
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return
    addItem(selectedProduct, selectedProduct.sizes?.[0] || 'Standard')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const scrollRack = (direction) => {
    if (!rackRef.current) return
    const offset = direction === 'left' ? -350 : 350
    rackRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section className="py-24 px-4 sm:px-8 lg:px-12 relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-100 border-b border-aura-dark/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-aura-gold" />
              <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-muted font-medium">
                Interactive Virtual Archive • Direct from Rack
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-aura-dark leading-tight">
              The Curated <span className="italic text-aura-warm">Hanger Rack</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-aura-dark/60 mt-2 max-w-lg font-light">
              Hover along the rail to inspect each one-of-a-kind garment. Choose hanging color tags on the side to preview all 4 angles in real-time.
            </p>
          </div>

          {/* Rack Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollRack('left')}
              className="p-3 border border-aura-dark/20 rounded-full hover:bg-aura-dark hover:text-cream-100 transition-colors"
              title="Slide Left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollRack('right')}
              className="p-3 border border-aura-dark/20 rounded-full hover:bg-aura-dark hover:text-cream-100 transition-colors"
              title="Slide Right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ─── 1. The Horizontal Steel Clothing Rack Bar ─── */}
        <div className="relative mb-16 pt-10">
          {/* Steel Pipe Bar & Wall Mounts */}
          <div className="relative w-full h-3 bg-gradient-to-b from-stone-400 via-stone-200 to-stone-500 rounded-full shadow-md z-10 flex items-center justify-between px-2">
            <div className="w-4 h-8 bg-stone-700 rounded-sm -mt-2.5 shadow-inner" />
            <div className="w-4 h-8 bg-stone-700 rounded-sm -mt-2.5 shadow-inner" />
          </div>

          {/* Garments on Rack (Horizontally Scrollable) */}
          <div
            ref={rackRef}
            className="rack-scroll-track gap-8 sm:gap-12 pt-0 pb-8 items-start select-none"
          >
            {sampleProducts.map((p) => {
              const isSelected = selectedProduct?.id === p.id
              const firstColor = p.colors?.[0]
              const previewImg = firstColor?.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=80'

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className={`group relative flex flex-col items-center shrink-0 cursor-pointer transition-all duration-500 ${
                    isSelected
                      ? 'scale-105 z-20 opacity-100'
                      : 'opacity-70 hover:opacity-100 hover:scale-102 z-10'
                  }`}
                  style={{ width: '220px' }}
                >
                  {/* Wooden Hanger Hook */}
                  <div className="hanger-hook border-stone-600 group-hover:border-aura-gold transition-colors" />
                  <div className="hanger-bar mb-1 group-hover:scale-105 transition-transform" />

                  {/* Hanging Garment Preview */}
                  <div className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden border transition-all duration-300 shadow-md ${
                    isSelected
                      ? 'ring-2 ring-aura-gold shadow-2xl'
                      : 'border-aura-dark/10 group-hover:shadow-xl'
                  }`}>
                    <img
                      src={previewImg}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Active Indicator Pin */}
                    {isSelected && (
                      <div className="absolute top-2.5 left-2.5 bg-aura-dark text-cream-100 text-[9px] font-sans tracking-widest uppercase px-2 py-0.5 rounded-sm font-semibold">
                        On Inspection
                      </div>
                    )}

                    <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-aura-dark/85 to-transparent text-cream-100">
                      <p className="font-serif text-xs truncate font-medium text-cream-50">{p.name}</p>
                      <p className="font-sans text-[11px] font-medium text-aura-gold">Rs. {p.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Color dots available count */}
                  <div className="flex gap-1.5 mt-2">
                    {p.colors?.map((c, i) => (
                      <span
                        key={i}
                        style={{ backgroundColor: c.hex }}
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── 2. Signature Focus Inspection Stage (As in Video) ─── */}
        <AnimatePresence mode="wait">
          {selectedProduct && (
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6 sm:p-10 border border-aura-gold/30 shadow-2xl relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Stage: The Garment with wooden hanger + Side Hangtags */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  {/* Wooden Hanger Assembly */}
                  <div className="hanger-hook mb-0.5" />
                  <div className="hanger-bar w-52 sm:w-64 h-3.5 mb-2 rounded-md" />

                  {/* Center Garment Display with Hanging Tags on Right */}
                  <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-aura-dark/15 bg-cream-200">
                    <img
                      src={currentImage}
                      alt={`${selectedProduct.name} - ${activeColor.name}`}
                      className="w-full h-full object-cover transition-all duration-500"
                    />

                    {/* Gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/40 via-transparent to-transparent pointer-events-none" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 glass-card px-3 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase font-semibold text-aura-dark">
                      {activeColor.name} • {angles[selectedAngleIdx].label}
                    </div>

                    {/* ─── Hanging Color Tags on the Right Edge (Just like in Video!) ─── */}
                    <div className="absolute top-6 right-4 flex flex-col gap-3 z-30">
                      {currentColors.map((color, idx) => {
                        const isActive = selectedColorIdx === idx
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectColor(idx)}
                            className="flex flex-col items-center cursor-pointer group"
                            title={`Switch to ${color.name}`}
                          >
                            {/* String hanging the tag */}
                            <div className="hangtag-string group-hover:bg-aura-gold transition-colors" />

                            {/* Tag Body */}
                            <div
                              style={{ backgroundColor: color.hex }}
                              className={`hangtag-body border ${
                                isActive
                                  ? 'ring-2 ring-aura-gold ring-offset-2 scale-110 shadow-xl'
                                  : 'border-black/30 opacity-85 group-hover:opacity-100'
                              }`}
                            >
                              <div className="hangtag-hole" />
                              <span className={`text-[7px] font-sans font-bold uppercase tracking-tighter text-center leading-none ${
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

                  {/* ─── 4-Angle View Switcher (FRONT, PROFILE, TEXTURE, BACK) ─── */}
                  <div className="flex items-center gap-2 mt-6 p-1.5 bg-cream-200/80 rounded-full border border-aura-dark/15">
                    {angles.map((ang) => (
                      <button
                        key={ang.idx}
                        onClick={() => setSelectedAngleIdx(ang.idx)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-sans tracking-[0.2em] uppercase font-semibold transition-all ${
                          selectedAngleIdx === ang.idx
                            ? 'bg-aura-dark text-cream-100 shadow-sm'
                            : 'text-aura-dark/70 hover:text-aura-dark hover:bg-cream-100'
                        }`}
                      >
                        {ang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Stage: Garment Details, Pricing & Action */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-px bg-aura-gold" />
                    <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-aura-muted font-medium">
                      {selectedProduct.categories?.name} • Archival Grade
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl font-normal text-aura-dark leading-tight mb-3">
                    {selectedProduct.name}
                  </h3>

                  <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-aura-dark/10">
                    <span className="font-sans text-2xl font-bold text-aura-dark">
                      Rs. {selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.original_price && (
                      <span className="font-sans text-sm text-aura-dark/40 line-through">
                        Rs. {selectedProduct.original_price.toLocaleString()}
                      </span>
                    )}
                    <span className="bg-aura-gold/25 text-aura-dark text-[10px] font-sans font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                      {selectedProduct.condition}
                    </span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-aura-dark/75 leading-relaxed font-light mb-6">
                    {selectedProduct.description}
                  </p>

                  {/* Active Color Info */}
                  <div className="mb-6 p-4 rounded-xl bg-cream-100/90 border border-aura-dark/10">
                    <div className="flex items-center justify-between text-xs font-sans mb-1">
                      <span className="text-aura-muted uppercase tracking-wider text-[11px]">Selected Colorway:</span>
                      <strong className="text-aura-dark font-medium">{activeColor.name}</strong>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        style={{ backgroundColor: activeColor.hex }}
                        className="w-4 h-4 rounded-full border border-black/30"
                      />
                      <span className="text-[11px] font-sans text-aura-muted">
                        Includes 4 curated high-res photography angles for this shade.
                      </span>
                    </div>
                  </div>

                  {/* Size Choices */}
                  {selectedProduct.sizes?.length > 0 && (
                    <div className="mb-6">
                      <span className="font-sans text-[11px] uppercase tracking-widest text-aura-dark font-semibold block mb-2">
                        Available Sizes
                      </span>
                      <div className="flex gap-2">
                        {selectedProduct.sizes.map((s) => (
                          <span
                            key={s}
                            className="min-w-[38px] h-9 px-3 border border-aura-dark/25 rounded-md text-xs font-sans font-medium flex items-center justify-center text-aura-dark bg-cream-50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
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
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Add to Bag • Rs. {selectedProduct.price.toLocaleString()}</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/product/${selectedProduct.id}`}
                      className="px-6 py-4 border border-aura-dark/30 hover:border-aura-dark text-aura-dark rounded-md text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={15} />
                      <span>Full Page</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
