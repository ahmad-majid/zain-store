import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStoreSettings } from '../context/StoreSettingsContext'
import ProductCard from '../components/ui/ProductCard'
import { SlidersHorizontal, X, Search, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CONDITIONS = ['All', 'Like New', 'Excellent', 'Good']
const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL']
const SORT_OPTIONS = [
  { label: 'Curated (Newest)', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, settings } = useStoreSettings()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const initialCat = searchParams.get('category') || 'all'
  const [selectedCategory, setSelectedCategory] = useState(initialCat)
  const [selectedCondition, setSelectedCondition] = useState('All')
  const [selectedSize, setSelectedSize] = useState('All')
  const [maxPrice, setMaxPrice] = useState(25000)
  const [sortBy, setSortBy] = useState('newest')

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'all') {
        const catSlug = p.categories?.slug || p.category_id
        if (catSlug !== selectedCategory) return false
      }
      // Condition
      if (selectedCondition !== 'All' && p.condition !== selectedCondition) {
        return false
      }
      // Size
      if (selectedSize !== 'All' && (!p.sizes || !p.sizes.includes(selectedSize))) {
        return false
      }
      // Price
      if (Number(p.price) > maxPrice) {
        return false
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = p.name?.toLowerCase().includes(q)
        const matchesDesc = p.description?.toLowerCase().includes(q)
        if (!matchesName && !matchesDesc) return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price)
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price)
      return 0
    })
  }, [products, selectedCategory, selectedCondition, selectedSize, maxPrice, searchQuery, sortBy])

  const categories = [
    { label: 'All Silhouettes', value: 'all' },
    ...settings.categories.map((c) => ({ label: c.name, value: c.slug })),
  ]

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) +
    (selectedCondition !== 'All' ? 1 : 0) +
    (selectedSize !== 'All' ? 1 : 0) +
    (maxPrice < 25000 ? 1 : 0)

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedCondition('All')
    setSelectedSize('All')
    setMaxPrice(25000)
    setSearchQuery('')
    setSearchParams({})
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-aura-dark/10 pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-aura-gold" />
                <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-aura-muted font-medium">
                  The Full Collection
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-normal text-aura-dark">
                Archival <span className="italic text-aura-warm">Boutique</span>
              </h1>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cashmere, blazer, silk..."
                className="w-full pl-10 pr-4 py-2.5 bg-cream-100 border border-aura-dark/15 rounded-lg text-xs font-sans placeholder-aura-muted focus:outline-none focus:border-aura-gold transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-dark"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-aura-dark/10">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scroll-row py-1">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setSelectedCategory(c.value)
                    if (c.value === 'all') setSearchParams({})
                    else setSearchParams({ category: c.value })
                  }}
                  className={`chip rounded-full text-[11px] whitespace-nowrap ${
                    selectedCategory === c.value ? 'active shadow-sm' : ''
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Filter Toggle & Sort */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-sans tracking-wider uppercase font-medium transition-all ${
                  filtersOpen || activeFilterCount > 0
                    ? 'border-aura-dark bg-aura-dark text-cream-100'
                    : 'border-aura-dark/20 text-aura-dark hover:border-aura-dark'
                }`}
              >
                <SlidersHorizontal size={13} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-aura-gold text-aura-dark text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 bg-cream-100 border border-aura-dark/20 rounded-full text-xs font-sans text-aura-dark focus:outline-none focus:border-aura-gold"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Drawer Filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-aura-gold/20 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Condition */}
                <div>
                  <h4 className="font-sans text-[11px] uppercase tracking-widest text-aura-muted mb-3 font-semibold">
                    Condition Grading
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCondition(c)}
                        className={`chip text-[11px] rounded-md ${
                          selectedCondition === c ? 'active' : ''
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h4 className="font-sans text-[11px] uppercase tracking-widest text-aura-muted mb-3 font-semibold">
                    Garment Size
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`chip text-[11px] rounded-md ${
                          selectedSize === s ? 'active' : ''
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-sans text-[11px] uppercase tracking-widest text-aura-muted font-semibold">
                      Max Price
                    </h4>
                    <span className="font-sans text-xs font-semibold text-aura-dark">
                      Rs. {maxPrice.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="25000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-aura-dark"
                  />
                  <div className="flex justify-between text-[10px] font-sans text-aura-muted mt-1">
                    <span>Rs. 1,000</span>
                    <span>Rs. 25,000</span>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="md:col-span-3 flex justify-end pt-2 border-t border-aura-dark/10">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1.5 text-xs font-sans text-aura-warm hover:text-aura-dark font-medium underline"
                    >
                      <X size={13} />
                      <span>Reset all filters</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Catalog Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="font-sans text-xs text-aura-muted tracking-wider uppercase">
            Showing <strong className="text-aura-dark">{filteredProducts.length}</strong> authenticated pieces
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs font-sans text-aura-muted hover:text-aura-dark underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl max-w-lg mx-auto p-12">
            <h3 className="font-serif text-3xl font-normal text-aura-dark mb-2">No Archives Match</h3>
            <p className="font-sans text-sm text-aura-muted mb-6">
              Try adjusting your size, price or category filters to explore more of our collection.
            </p>
            <button onClick={clearFilters} className="btn-primary">
              View All Curations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
