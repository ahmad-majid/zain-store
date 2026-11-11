import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStoreSettings } from '../context/StoreSettingsContext'
import {
  Package, Megaphone, Sparkles, Navigation, Percent, Image, FolderTree, BookOpen,
  Plus, Trash2, Edit3, Save, RotateCcw, Check, Upload, ExternalLink, Video, Eye,
  CheckCircle2, Flame, Tag, Layers, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Admin() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const {
    settings, products, updateAnnouncement, updateHero, updateNavigation,
    updateCampaigns, updateCoupons, updateLookbook, updateCategories, updateStory,
    toggleFeaturedProduct, saveProduct, deleteProduct, resetAllSettings
  } = useStoreSettings()

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('inventory')
  const [savedNotice, setSavedNotice] = useState(false)

  // Guard: only admins may access this page
  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      navigate('/admin-access', { replace: true })
    }
  }, [user, profile, authLoading, navigate])

  // Modals
  const [productModal, setProductModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [campaignModal, setCampaignModal] = useState(false)
  const [couponModal, setCouponModal] = useState(false)
  const [lookbookModal, setLookbookModal] = useState(false)
  const [categoryModal, setCategoryModal] = useState(false)

  // â”€â”€ Product form state (fully controlled, supports N colorways Ã— 4 images) â”€â”€
  const BLANK_COLOR = () => ({ name: '', hex: '#b8860b', images: ['', '', '', ''] })
  const BLANK_PRODUCT_FORM = {
    name: '', description: '', price: '', original_price: '',
    condition: 'Like New', category_id: '', sizes: 'XS, S, M, L, XL',
    featured: false, colors: [BLANK_COLOR()],
  }
  const [productForm, setProductForm] = useState(BLANK_PRODUCT_FORM)
  const [activeColorIdx, setActiveColorIdx] = useState(0)

  const openAddProduct = () => {
    setEditProduct(null)
    setProductForm(BLANK_PRODUCT_FORM)
    setActiveColorIdx(0)
    setProductModal(true)
  }

  const openEditProduct = (p) => {
    setEditProduct(p)
    setProductForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? '',
      original_price: p.original_price ?? '',
      condition: p.condition || 'Like New',
      category_id: p.category_id || '',
      sizes: p.sizes?.join(', ') || 'XS, S, M, L, XL',
      featured: p.featured || false,
      colors: p.colors?.length
        ? p.colors.map((c) => ({
            name: c.name || '',
            hex: c.hex || '#b8860b',
            images: [
              c.images?.[0] || '',
              c.images?.[1] || '',
              c.images?.[2] || '',
              c.images?.[3] || '',
            ],
          }))
        : [BLANK_COLOR()],
    })
    setActiveColorIdx(0)
    setProductModal(true)
  }

  const closeProductModal = () => {
    setProductModal(false)
    setEditProduct(null)
  }

  // Form field helpers
  const setPF = (key, val) => setProductForm((p) => ({ ...p, [key]: val }))
  const setColorField = (idx, key, val) =>
    setProductForm((p) => ({
      ...p,
      colors: p.colors.map((c, i) => (i === idx ? { ...c, [key]: val } : c)),
    }))
  const setColorImage = (colorIdx, imgIdx, val) =>
    setProductForm((p) => ({
      ...p,
      colors: p.colors.map((c, i) =>
        i === colorIdx
          ? { ...c, images: c.images.map((img, j) => (j === imgIdx ? val : img)) }
          : c
      ),
    }))
  const addColor = () => {
    setProductForm((p) => ({ ...p, colors: [...p.colors, BLANK_COLOR()] }))
    setActiveColorIdx(productForm.colors.length)
  }
  const removeColor = (idx) => {
    if (productForm.colors.length === 1) return
    setProductForm((p) => ({ ...p, colors: p.colors.filter((_, i) => i !== idx) }))
    setActiveColorIdx((prev) => Math.max(0, prev - (idx <= prev ? 1 : 0)))
  }

  const handleSaveProduct = () => {
    const pf = productForm
    if (!pf.name.trim() || !pf.price) return
    const prodData = {
      id: editProduct?.id || `sp-${Date.now()}`,
      name: pf.name.trim(),
      description: pf.description.trim(),
      price: parseFloat(pf.price),
      original_price: pf.original_price ? parseFloat(pf.original_price) : null,
      condition: pf.condition,
      sizes: pf.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      featured: pf.featured,
      category_id: pf.category_id,
      categories: { name: pf.category_id },
      colors: pf.colors.map((c) => ({
        name: c.name || 'Original',
        hex: c.hex || '#222',
        images: [
          c.images[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
          c.images[1] || c.images[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
          c.images[2] || c.images[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
          c.images[3] || c.images[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
        ],
      })),
    }
    saveProduct(prodData)
    closeProductModal()
    showSaveSuccess()
  }

  const showSaveSuccess = () => {
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2200)
  }

  // --- Handlers for Announcement ---
  const handleToggleAnnouncement = () => {
    updateAnnouncement({ enabled: !settings.announcement?.enabled })
    showSaveSuccess()
  }

  const handleAddAnnouncementItem = (e) => {
    e.preventDefault()
    const text = e.target.itemText.value.trim()
    if (!text) return
    const current = settings.announcement?.items || []
    updateAnnouncement({ items: [...current, text] })
    e.target.reset()
    showSaveSuccess()
  }

  const handleRemoveAnnouncementItem = (idx) => {
    const current = settings.announcement?.items || []
    updateAnnouncement({ items: current.filter((_, i) => i !== idx) })
    showSaveSuccess()
  }

  // --- Handlers for Hero ---
  const [heroForm, setHeroForm] = useState({
    eyebrow: settings.hero?.eyebrow || '',
    titleMain: settings.hero?.titleMain || '',
    titleSub: settings.hero?.titleSub || '',
    description: settings.hero?.description || '',
    primaryBtnText: settings.hero?.primaryBtnText || '',
    primaryBtnLink: settings.hero?.primaryBtnLink || '',
    secondaryBtnText: settings.hero?.secondaryBtnText || '',
    secondaryBtnLink: settings.hero?.secondaryBtnLink || '',
    featuredProductId: settings.hero?.featuredProductId || products[0]?.id || '',
  })

  useEffect(() => {
    if (settings.hero) {
      setHeroForm({
        eyebrow: settings.hero.eyebrow || '',
        titleMain: settings.hero.titleMain || '',
        titleSub: settings.hero.titleSub || '',
        description: settings.hero.description || '',
        primaryBtnText: settings.hero.primaryBtnText || '',
        primaryBtnLink: settings.hero.primaryBtnLink || '',
        secondaryBtnText: settings.hero.secondaryBtnText || '',
        secondaryBtnLink: settings.hero.secondaryBtnLink || '',
        featuredProductId: settings.hero.featuredProductId || products[0]?.id || '',
      })
    }
  }, [settings.hero, products])

  const setHF = (key, val) => setHeroForm((p) => ({ ...p, [key]: val }))
  const heroProduct = products.find((p) => p.id === heroForm.featuredProductId) || products[0]

  const handleSaveHero = (e) => {
    e.preventDefault()
    updateHero(heroForm)
    showSaveSuccess()
  }

  // --- Handlers for Dynamic Navigation & Campaigns ---
  const handleAddNavItem = (e) => {
    e.preventDefault()
    const form = e.target
    const newItem = {
      id: `nav-${Date.now()}`,
      label: form.label.value,
      to: form.to.value,
      isSale: form.isSale.checked,
    }
    updateNavigation([...settings.navigation, newItem])
    form.reset()
    showSaveSuccess()
  }

  const handleRemoveNavItem = (id) => {
    updateNavigation(settings.navigation.filter((n) => n.id !== id))
    showSaveSuccess()
  }

  // --- Handlers for Coupons ---
  const handleAddCoupon = (e) => {
    e.preventDefault()
    const form = e.target
    const newCoupon = {
      id: `c-${Date.now()}`,
      code: form.code.value.trim().toUpperCase(),
      discountType: form.discountType.value,
      value: Number(form.value.value),
      minSpend: Number(form.minSpend.value) || 0,
      active: true,
      description: form.description.value,
    }
    updateCoupons([...(settings.coupons || []), newCoupon])
    setCouponModal(false)
    showSaveSuccess()
  }

  const handleToggleCoupon = (id) => {
    const updated = settings.coupons.map((c) =>
      c.id === id ? { ...c, active: !c.active } : c
    )
    updateCoupons(updated)
    showSaveSuccess()
  }

  const handleDeleteCoupon = (id) => {
    updateCoupons(settings.coupons.filter((c) => c.id !== id))
    showSaveSuccess()
  }

  // --- Handlers for Story ---
  const handleSaveStory = (e) => {
    e.preventDefault()
    const form = e.target
    updateStory({
      label: form.label.value,
      title: form.title.value,
      titleItalic: form.titleItalic.value,
      p1: form.p1.value,
      p2: form.p2.value,
      stat1Number: form.stat1Number.value,
      stat1Label: form.stat1Label.value,
      stat2Number: form.stat2Number.value,
      stat2Label: form.stat2Label.value,
      mediaType: form.mediaType.value,
      mediaUrl: form.mediaUrl.value,
    })
    showSaveSuccess()
  }

  // Media File to Data URL helper
  const handleMediaUpload = (e, callback) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      callback(reader.result)
      showSaveSuccess()
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="min-h-screen pt-20 pb-28 px-4 sm:px-8 lg:px-12 relative z-10 bg-cream-50/70">
      <div className="max-w-7xl mx-auto">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-aura-dark/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-aura-muted font-bold">
                Thrift Aura Store CRM Suite
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-aura-dark font-normal">
              Store Control <span className="italic text-aura-warm">& Content Management</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="btn-outline py-2.5 px-4 text-xs inline-flex items-center gap-1.5">
              <span>View Live Store</span>
              <ExternalLink size={13} />
            </Link>
            <button
              onClick={() => {
                if (confirm('Reset all CRM customizations to factory defaults?')) {
                  resetAllSettings()
                  showSaveSuccess()
                }
              }}
              className="px-3.5 py-2.5 border border-aura-dark/20 text-aura-dark/60 hover:text-aura-dark rounded-md text-xs font-sans transition-colors"
              title="Reset Settings to Default"
            >
              <RotateCcw size={15} />
            </button>
            <button onClick={signOut} className="btn-outline py-2.5 px-4 text-xs">
              Sign Out
            </button>
          </div>
        </div>

        {/* Save Notification Toast */}
        <AnimatePresence>
          {savedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-8 z-50 glass-card bg-emerald-50/95 border border-emerald-300 text-emerald-800 px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-sans font-semibold"
            >
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>CRM Changes Updated Live Across Storefront!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Selector Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scroll-row border-b border-aura-dark/10">
          {[
            { id: 'inventory', label: 'Archival Products', icon: Package, count: products.length },
            { id: 'announcement', label: 'Announcement Bar', icon: Megaphone, badge: settings.announcement?.enabled ? 'ON' : 'OFF' },
            { id: 'hero', label: 'Hero Showcase', icon: Sparkles },
            { id: 'navigation', label: 'Navbar & Sales', icon: Navigation, count: settings.navigation?.length },
            { id: 'coupons', label: 'Coupons & Discounts', icon: Percent, count: settings.coupons?.length },
            { id: 'lookbook', label: 'Lookbook Moodboard', icon: Image, count: settings.lookbook?.length },
            { id: 'categories', label: 'Departments', icon: FolderTree, count: settings.categories?.length },
            { id: 'story', label: 'Our Story (About)', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-xs tracking-wider uppercase font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-aura-dark text-cream-100 shadow-md'
                    : 'glass-card text-aura-dark/70 hover:text-aura-dark hover:border-aura-dark'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-aura-gold' : 'text-aura-muted'} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-cream-100/20 text-cream-50' : 'bg-aura-dark/10 text-aura-dark'}`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${tab.badge === 'ON' ? 'bg-emerald-500 text-cream-100' : 'bg-stone-300 text-stone-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB 1: PRODUCTS INVENTORY & HOMEPAGE FEATURED SELECTION
           â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl text-aura-dark">Product Catalog & Featured Picks</h2>
                <p className="font-sans text-xs text-aura-muted">
                  Toggle the star icon to feature or unfeature any piece on the homepage in real-time.
                </p>
              </div>
              <button
                onClick={openAddProduct}
                className="btn-primary"
              >
                <Plus size={15} />
                <span>Add New Piece</span>
              </button>
            </div>

            <div className="glass-card rounded-2xl border border-aura-dark/10 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-cream-200/80 border-b border-aura-dark/10 tracking-[0.2em] uppercase text-aura-muted text-[10px]">
                  <tr>
                    <th className="py-4 px-6">Featured</th>
                    <th className="py-4 px-6">Garment</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Condition</th>
                    <th className="py-4 px-6">Colorways</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aura-dark/5">
                  {products.map((p) => {
                    const firstImg = p.colors?.[0]?.images?.[0] || p.images?.[0]
                    return (
                      <tr key={p.id} className="hover:bg-cream-200/40 transition-colors">
                        <td className="py-3 px-6">
                          <button
                            onClick={() => {
                              toggleFeaturedProduct(p.id)
                              showSaveSuccess()
                            }}
                            className={`p-1.5 rounded-lg border transition-all ${
                              p.featured
                                ? 'bg-amber-100 border-amber-300 text-amber-600'
                                : 'border-aura-dark/15 text-aura-dark/30 hover:text-aura-dark'
                            }`}
                            title={p.featured ? 'Featured on Homepage (Click to remove)' : 'Click to Feature on Homepage'}
                          >
                            <Sparkles size={16} fill={p.featured ? 'currentColor' : 'none'} />
                          </button>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <img src={firstImg} alt="" className="w-12 h-16 rounded-md object-cover border border-aura-dark/10 shrink-0" />
                            <div>
                              <p className="font-serif text-base text-aura-dark font-medium leading-snug">{p.name}</p>
                              <p className="text-[10px] text-aura-muted">ID: {p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 font-medium text-aura-dark/80">
                          {p.categories?.name || p.category_id}
                        </td>
                        <td className="py-3 px-6 font-semibold text-aura-dark">
                          Rs. {Number(p.price).toLocaleString()}
                        </td>
                        <td className="py-3 px-6">
                          <span className="px-2 py-0.5 rounded-sm bg-aura-gold/20 text-aura-dark text-[10px] font-semibold">
                            {p.condition}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-aura-dark/80">
                          {p.colors?.length || 1} Colorways
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="p-1.5 hover:bg-cream-200 rounded-md text-aura-dark/70 hover:text-aura-dark"
                              title="Edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${p.name}?`)) {
                                  deleteProduct(p.id)
                                  showSaveSuccess()
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 rounded-md text-aura-dark/70 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB 2: ANNOUNCEMENT BAR CRM (ON/OFF & ITEMS)
           â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'announcement' && (
          <div className="glass-card rounded-2xl p-6 sm:p-10 border border-aura-dark/10 space-y-8">
            <div className="flex items-center justify-between pb-6 border-b border-aura-dark/10">
              <div>
                <h2 className="font-serif text-2xl text-aura-dark">Announcement Banner Control</h2>
                <p className="font-sans text-xs text-aura-muted mt-1">
                  Toggle the top announcement ticker visibility and manage continuous marquee messages.
                </p>
              </div>
              <button
                onClick={handleToggleAnnouncement}
                className={`px-5 py-2.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all shadow-md ${
                  settings.announcement?.enabled
                    ? 'bg-emerald-600 text-cream-100 hover:bg-emerald-700'
                    : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
                }`}
              >
                Banner: {settings.announcement?.enabled ? 'ACTIVE (ON)' : 'DISABLED (OFF)'}
              </button>
            </div>

            {/* Marquee Speed Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-sans text-xs font-semibold uppercase tracking-wider text-aura-dark">
                  Marquee Animation Speed: {settings.announcement?.speed || 28} seconds
                </label>
                <span className="text-[11px] font-sans text-aura-muted">Lower = Faster</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={settings.announcement?.speed || 28}
                onChange={(e) => {
                  updateAnnouncement({ speed: Number(e.target.value) })
                  showSaveSuccess()
                }}
                className="w-full accent-aura-dark"
              />
            </div>

            {/* Current Ticker Messages */}
            <div>
              <label className="font-sans text-xs font-semibold uppercase tracking-wider text-aura-dark block mb-3">
                Active Marquee Messages ({settings.announcement?.items?.length || 0})
              </label>
              <div className="space-y-2 mb-6">
                {settings.announcement?.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-cream-100/90 rounded-xl border border-aura-dark/10 text-xs font-sans">
                    <span className="font-medium text-aura-dark">{item}</span>
                    <button
                      onClick={() => handleRemoveAnnouncementItem(i)}
                      className="p-1 hover:text-red-500 text-aura-muted"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Message */}
              <form onSubmit={handleAddAnnouncementItem} className="flex gap-3">
                <input
                  type="text"
                  name="itemText"
                  placeholder="e.g. FLASH SALE 20% OFF THIS WEEKEND ONLY"
                  required
                  className="flex-1 px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl text-xs font-sans focus:outline-none focus:border-aura-gold"
                />
                <button type="submit" className="btn-primary py-2.5 px-6 text-xs whitespace-nowrap">
                  Add Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB 3: HERO SECTION CRM (TEXT, CTAs, 3D FEATURED PIECE)
           â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHero} className="glass-card rounded-2xl p-6 sm:p-10 border border-aura-dark/10 space-y-8">
            <div className="pb-4 border-b border-aura-dark/10">
              <h2 className="font-serif text-2xl text-aura-dark">Hero Section Customizer</h2>
              <p className="font-sans text-xs text-aura-muted mt-1">
                Customize headlines, description, CTA buttons, and designate which archival garment is showcased on the homepage 3D card.
              </p>
            </div>

            {/* ─── Hero Product Spotlight Card ─── */}
            <div className="p-5 rounded-2xl bg-cream-50 border border-aura-gold/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-semibold uppercase tracking-[0.2em] text-[10px] text-aura-gold flex items-center gap-1.5">
                    <Sparkles size={12} /> Spotlighted 3D Hero Product
                  </label>
                  <p className="text-[11px] text-aura-muted font-sans mt-0.5">
                    This exact piece appears on the interactive floating lookbook card in the hero section.
                  </p>
                </div>
                {heroProduct && (
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-aura-gold/20 text-aura-dark border border-aura-gold/30">
                    Live On Hero
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-7">
                  <label className="font-semibold uppercase tracking-wider block mb-1.5 text-xs text-aura-dark/80">
                    Select Product From Inventory:
                  </label>
                  <select
                    value={heroForm.featuredProductId}
                    onChange={(e) => setHF('featuredProductId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-aura-dark/20 rounded-xl font-medium text-xs text-aura-dark focus:outline-none focus:border-aura-gold shadow-sm"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — Rs. {Number(p.price).toLocaleString()} ({p.colors?.length || 1} colors)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview Thumbnail & Details */}
                {heroProduct && (
                  <div className="md:col-span-5 flex items-center gap-3.5 p-3 bg-white/80 rounded-xl border border-aura-dark/10 shadow-inner">
                    <img
                      src={heroProduct.colors?.[0]?.images?.[0] || heroProduct.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'}
                      alt={heroProduct.name}
                      className="w-16 h-20 rounded-lg object-cover border border-aura-dark/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm text-aura-dark truncate font-bold">{heroProduct.name}</p>
                      <p className="text-xs font-semibold text-aura-gold mt-0.5">Rs. {Number(heroProduct.price).toLocaleString()}</p>
                      <p className="text-[10px] text-aura-muted mt-0.5 capitalize">{heroProduct.category_id || heroProduct.categories?.name} · {heroProduct.condition}</p>
                      <div className="flex gap-1 mt-1.5">
                        {heroProduct.colors?.slice(0, 4).map((c, i) => (
                          <span
                            key={i}
                            title={c.name}
                            className="w-3 h-3 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Hero Text & CTA Customization ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Eyebrow Badge Text</label>
                <input
                  type="text"
                  value={heroForm.eyebrow}
                  onChange={(e) => setHF('eyebrow', e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold"
                  placeholder="e.g. AUTUMN / WINTER 2026 ARCHIVES"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Main Brand Word</label>
                <input
                  type="text"
                  value={heroForm.titleMain}
                  onChange={(e) => setHF('titleMain', e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-serif text-base focus:outline-none focus:border-aura-gold"
                  placeholder="Thrift"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Subtitle Accent (Italic)</label>
                <input
                  type="text"
                  value={heroForm.titleSub}
                  onChange={(e) => setHF('titleSub', e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-serif italic text-base focus:outline-none focus:border-aura-gold"
                  placeholder="aura"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold uppercase tracking-wider block mb-1">Hero Description Paragraph</label>
                <textarea
                  value={heroForm.description}
                  onChange={(e) => setHF('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold"
                  placeholder="Handpicked luxury archives..."
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Primary CTA Button Text</label>
                <input
                  type="text"
                  value={heroForm.primaryBtnText}
                  onChange={(e) => setHF('primaryBtnText', e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={heroForm.primaryBtnLink}
                  onChange={(e) => setHF('primaryBtnLink', e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Secondary Button Text</label>
                <input
                  type="text"
                  value={heroForm.secondaryBtnText}
                  onChange={(e) => setHF('secondaryBtnText', e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Secondary Button Link</label>
                <input
                  type="text"
                  value={heroForm.secondaryBtnLink}
                  onChange={(e) => setHF('secondaryBtnLink', e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-aura-dark/10">
              <button type="submit" className="btn-primary py-3 px-8 text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                <Save size={15} />
                <span>Save Hero Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB 4: NAVBAR BUTTONS & CUSTOM SALE CAMPAIGNS
           â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'navigation' && (
          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-6 sm:p-10 border border-aura-dark/10 space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-aura-dark">Navbar Navigation Builder</h2>
                <p className="font-sans text-xs text-aura-muted mt-1">
                  Add links or special Sale buttons to your header bar. Sale buttons get an eye-catching pulsating badge.
                </p>
              </div>

              <div className="space-y-3">
                {settings.navigation?.map((nav) => (
                  <div key={nav.id} className="flex items-center justify-between p-3.5 bg-cream-100 rounded-xl border border-aura-dark/10 text-xs font-sans">
                    <div className="flex items-center gap-3">
                      {nav.isSale ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-cream-100 text-[10px] font-bold flex items-center gap-1">
                          <Flame size={11} /> SALE BUTTON
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-aura-dark/10 text-aura-dark text-[10px] font-semibold">
                          STANDARD
                        </span>
                      )}
                      <span className="font-semibold text-aura-dark">{nav.label}</span>
                      <span className="text-aura-muted font-mono">{nav.to}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveNavItem(nav.id)}
                      className="p-1 hover:text-red-500 text-aura-muted"
                      title="Delete nav item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Nav Item */}
              <form onSubmit={handleAddNavItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-aura-dark/10 text-xs font-sans items-end">
                <div className="sm:col-span-5">
                  <label className="font-semibold uppercase tracking-wider block mb-1">Button Title</label>
                  <input
                    type="text"
                    name="label"
                    required
                    placeholder="e.g. FLASH SALE 40% OFF"
                    className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="font-semibold uppercase tracking-wider block mb-1">Destination URL / Route</label>
                  <input
                    type="text"
                    name="to"
                    required
                    placeholder="e.g. /campaign/archive-sale"
                    className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-3 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer py-2.5">
                    <input type="checkbox" name="isSale" className="w-4 h-4 accent-red-600" />
                    <span className="font-semibold text-red-600">Sale Badge</span>
                  </label>
                  <button type="submit" className="btn-primary py-2.5 px-4 text-xs shrink-0">
                    Add Button
                  </button>
                </div>
              </form>
            </div>

            {/* Campaign / Sale Page Product Selection */}
            <div className="glass-card rounded-2xl p-6 sm:p-10 border border-aura-dark/10 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-xl text-aura-dark">Configured Campaign & Sale Pages</h3>
                  <p className="font-sans text-xs text-aura-muted">
                    Assign specific products from your catalog that display on custom sale landing pages.
                  </p>
                </div>
              </div>

              {settings.campaigns?.map((camp) => (
                <div key={camp.id} className="p-5 rounded-xl border border-aura-gold/25 bg-cream-100/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg text-aura-dark">{camp.title}</h4>
                      <p className="text-xs font-sans text-aura-muted">Route: /campaign/{camp.slug}</p>
                    </div>
                    <Link
                      to={`/campaign/${camp.slug}`}
                      target="_blank"
                      className="text-xs font-sans tracking-wider uppercase font-semibold text-aura-warm hover:underline flex items-center gap-1"
                    >
                      <span>Preview Sale Page</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>

                  {/* Product assignment checklist */}
                  <div>
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-aura-dark block mb-2">
                      Products Included in this Sale ({camp.productIds?.length || 0})
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {products.map((p) => {
                        const isIncluded = camp.productIds?.includes(p.id)
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-sans cursor-pointer transition-colors ${
                              isIncluded ? 'bg-cream-50 border-aura-dark font-medium' : 'border-aura-dark/10 hover:border-aura-dark/30'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={() => {
                                const newIds = isIncluded
                                  ? camp.productIds.filter((id) => id !== p.id)
                                  : [...(camp.productIds || []), p.id]
                                updateCampaigns(
                                  settings.campaigns.map((c) =>
                                    c.id === camp.id ? { ...c, productIds: newIds } : c
                                  )
                                )
                                showSaveSuccess()
                              }}
                              className="w-3.5 h-3.5 accent-aura-dark"
                            />
                            <span className="truncate">{p.name} (Rs. {p.price})</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB 5: DISCOUNT COUPONS CRM
           â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl text-aura-dark">Coupons & Promotional Codes</h2>
                <p className="font-sans text-xs text-aura-muted">
                  Create discount codes that customers can apply directly in the bag / cart for instant deduction.
                </p>
              </div>
              <button onClick={() => setCouponModal(true)} className="btn-primary">
                <Plus size={15} />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {settings.coupons?.map((coup) => (
                <div
                  key={coup.id}
                  className={`glass-card p-6 rounded-2xl border transition-all ${
                    coup.active ? 'border-aura-gold/30 shadow-md' : 'border-aura-dark/10 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 rounded-md bg-aura-dark text-cream-100 font-mono text-sm font-bold tracking-widest">
                      {coup.code}
                    </span>
                    <button
                      onClick={() => handleToggleCoupon(coup.id)}
                      className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        coup.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {coup.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="font-serif text-2xl text-aura-dark mb-1">
                    {coup.discountType === 'percentage' ? `${coup.value}% OFF` : `Rs. ${coup.value} OFF`}
                  </p>
                  <p className="font-sans text-xs text-aura-dark/70 mb-3">{coup.description}</p>
                  <p className="font-sans text-[11px] text-aura-muted">
                    Min spend: Rs. {coup.minSpend ? coup.minSpend.toLocaleString() : '0'}
                  </p>

                  <div className="flex justify-end pt-4 mt-4 border-t border-aura-dark/10">
                    <button
                      onClick={() => handleDeleteCoupon(coup.id)}
                      className="text-xs text-aura-muted hover:text-red-500 flex items-center gap-1 font-sans"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB 6: LOOKBOOK MOODBOARD (IMAGE OR VIDEO)
           â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'lookbook' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl text-aura-dark">Lookbook Editorial Showcase</h2>
                <p className="font-sans text-xs text-aura-muted">
                  Curate the homepage editorial moodboard. Supports both high-res photos and looping MP4 videos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {settings.lookbook?.map((look, i) => (
                <div key={look.id || i} className="glass-card rounded-2xl p-5 border border-aura-dark/10 space-y-4 shadow-sm">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-cream-200 border border-aura-dark/10 relative">
                    {look.mediaType === 'video' ? (
                      <video src={look.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={look.mediaUrl} alt="" className="w-full h-full object-cover" />
                    )}
                    <span className="absolute top-3 left-3 glass-card px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans uppercase">
                      {look.tag}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-sans">
                    <div>
                      <label className="text-[10px] text-aura-muted uppercase tracking-wider block">Title</label>
                      <input
                        type="text"
                        value={look.title}
                        onChange={(e) => {
                          const updated = settings.lookbook.map((l, idx) =>
                            idx === i ? { ...l, title: e.target.value } : l
                          )
                          updateLookbook(updated)
                        }}
                        className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-aura-muted uppercase tracking-wider block">Subtitle / Era</label>
                      <input
                        type="text"
                        value={look.sub}
                        onChange={(e) => {
                          const updated = settings.lookbook.map((l, idx) =>
                            idx === i ? { ...l, sub: e.target.value } : l
                          )
                          updateLookbook(updated)
                        }}
                        className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-lg text-xs"
                      />
                    </div>

                    {/* Media Type & URL / File */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-aura-muted uppercase tracking-wider block">Type</label>
                        <select
                          value={look.mediaType}
                          onChange={(e) => {
                            const updated = settings.lookbook.map((l, idx) =>
                              idx === i ? { ...l, mediaType: e.target.value } : l
                            )
                            updateLookbook(updated)
                          }}
                          className="w-full px-2 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-lg text-xs"
                        >
                          <option value="image">Picture (Image)</option>
                          <option value="video">Motion (Video)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-aura-muted uppercase tracking-wider block">Upload File</label>
                        <label className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-cream-100 hover:bg-cream-200 border border-aura-dark/20 rounded-lg cursor-pointer text-xs">
                          <Upload size={12} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept={look.mediaType === 'video' ? 'video/*' : 'image/*'}
                            className="hidden"
                            onChange={(e) =>
                              handleMediaUpload(e, (dataUrl) => {
                                const updated = settings.lookbook.map((l, idx) =>
                                  idx === i ? { ...l, mediaUrl: dataUrl } : l
                                )
                                updateLookbook(updated)
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-aura-muted uppercase tracking-wider block">Media URL Link</label>
                      <input
                        type="text"
                        value={look.mediaUrl}
                        onChange={(e) => {
                          const updated = settings.lookbook.map((l, idx) =>
                            idx === i ? { ...l, mediaUrl: e.target.value } : l
                          )
                          updateLookbook(updated)
                        }}
                        placeholder="https://... image or .mp4 video link"
                        className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB 7: DEPARTMENTS & CATEGORIES CRM
           â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl text-aura-dark">Store Categories & Departments</h2>
                <p className="font-sans text-xs text-aura-muted">
                  Manage departments displayed in "Shop by Silhouette" and shop filters.
                </p>
              </div>
              <button
                onClick={() => {
                  const name = prompt('Category Name (e.g. Vintage Knitwear):')
                  if (!name) return
                  const slug = name.toLowerCase().replace(/\s+/g, '-')
                  updateCategories([
                    ...settings.categories,
                    {
                      id: slug,
                      name,
                      slug,
                      desc: 'Curated specialty archive collection',
                      count: '0 Pieces',
                      img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403825?w=700&h=900&fit=crop&q=85',
                    },
                  ])
                  showSaveSuccess()
                }}
                className="btn-primary"
              >
                <Plus size={15} />
                <span>Add Department</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {settings.categories?.map((cat, i) => (
                <div key={cat.id || i} className="glass-card rounded-2xl p-5 border border-aura-dark/10 space-y-3 shadow-sm">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-cream-200 border border-aura-dark/10 relative">
                    <img src={cat.img} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 glass-card px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {cat.count}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-sans">
                    <div>
                      <label className="text-[10px] text-aura-muted uppercase tracking-wider block">Category Name</label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => {
                          const updated = settings.categories.map((c, idx) =>
                            idx === i ? { ...c, name: e.target.value } : c
                          )
                          updateCategories(updated)
                        }}
                        className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-aura-muted uppercase tracking-wider block">Description</label>
                      <input
                        type="text"
                        value={cat.desc}
                        onChange={(e) => {
                          const updated = settings.categories.map((c, idx) =>
                            idx === i ? { ...c, desc: e.target.value } : c
                          )
                          updateCategories(updated)
                        }}
                        className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cat.img}
                        onChange={(e) => {
                          const updated = settings.categories.map((c, idx) =>
                            idx === i ? { ...c, img: e.target.value } : c
                          )
                          updateCategories(updated)
                        }}
                        placeholder="Image URL link"
                        className="flex-1 px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-lg text-xs font-mono"
                      />
                      <label className="p-1.5 bg-cream-100 hover:bg-cream-200 border border-aura-dark/20 rounded-lg cursor-pointer">
                        <Upload size={14} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleMediaUpload(e, (dataUrl) => {
                              const updated = settings.categories.map((c, idx) =>
                                idx === i ? { ...c, img: dataUrl } : c
                              )
                              updateCategories(updated)
                            })
                          }
                        />
                      </label>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${cat.name}?`)) {
                            updateCategories(settings.categories.filter((_, idx) => idx !== i))
                            showSaveSuccess()
                          }
                        }}
                        className="text-xs text-aura-muted hover:text-red-500 flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB 8: OUR STORY SECTION (TEXT, STATS, PIC OR VIDEO)
           â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'story' && (
          <form onSubmit={handleSaveStory} className="glass-card rounded-2xl p-6 sm:p-10 border border-aura-dark/10 space-y-6">
            <div className="pb-4 border-b border-aura-dark/10">
              <h2 className="font-serif text-2xl text-aura-dark">"Our Story" / About Us Customizer</h2>
              <p className="font-sans text-xs text-aura-muted mt-1">
                Customize your brand heritage text, circular fashion stats, and feature an editorial picture or atelier video.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Eyebrow Label</label>
                <input
                  type="text"
                  name="label"
                  defaultValue={settings.story?.label}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Heading Prefix</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={settings.story?.title}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-serif text-base"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold uppercase tracking-wider block mb-1">Heading Italic Accent</label>
                <input
                  type="text"
                  name="titleItalic"
                  defaultValue={settings.story?.titleItalic}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-serif italic text-base"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold uppercase tracking-wider block mb-1">Paragraph 1</label>
                <textarea
                  name="p1"
                  rows={3}
                  defaultValue={settings.story?.p1}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold uppercase tracking-wider block mb-1">Paragraph 2</label>
                <textarea
                  name="p2"
                  rows={3}
                  defaultValue={settings.story?.p2}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              {/* Stats */}
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Stat 1 Number</label>
                <input
                  type="text"
                  name="stat1Number"
                  defaultValue={settings.story?.stat1Number}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-serif text-base"
                />
              </div>
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Stat 1 Label</label>
                <input
                  type="text"
                  name="stat1Label"
                  defaultValue={settings.story?.stat1Label}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Stat 2 Number</label>
                <input
                  type="text"
                  name="stat2Number"
                  defaultValue={settings.story?.stat2Number}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-serif text-base"
                />
              </div>
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Stat 2 Label</label>
                <input
                  type="text"
                  name="stat2Label"
                  defaultValue={settings.story?.stat2Label}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              {/* Media Mode: Picture OR Video */}
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Media Type</label>
                <select
                  name="mediaType"
                  defaultValue={settings.story?.mediaType || 'image'}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-medium"
                >
                  <option value="image">Picture / Editorial Photograph</option>
                  <option value="video">Motion Video (.mp4)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Media URL Link or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="mediaUrl"
                    id="storyMediaUrl"
                    defaultValue={settings.story?.mediaUrl}
                    placeholder="https://... or upload below"
                    className="flex-1 px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-mono text-xs"
                  />
                  <label className="btn-outline px-4 py-2 text-xs flex items-center gap-1 cursor-pointer">
                    <Upload size={14} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) =>
                        handleMediaUpload(e, (dataUrl) => {
                          const input = document.getElementById('storyMediaUrl')
                          if (input) input.value = dataUrl
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-aura-dark/10">
              <button type="submit" className="btn-primary py-3 px-8 text-xs flex items-center gap-2">
                <Save size={15} />
                <span>Save Story & Atelier Content</span>
              </button>
            </div>
          </form>
        )}

        {/* ─── Add/Edit Product Modal (Multi-Colorway) ─── */}
        <AnimatePresence>
          {productModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-aura-dark/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-cream-50 rounded-2xl border border-aura-gold/30 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-aura-dark/10 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-aura-dark flex items-center justify-center">
                      <Package size={15} className="text-aura-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-aura-dark leading-none">
                        {editProduct ? 'Edit Archival Piece' : 'Add New Archival Garment'}
                      </h3>
                      <p className="font-sans text-[10px] text-aura-muted tracking-wider mt-0.5">
                        {productForm.colors.length} colorway{productForm.colors.length !== 1 ? 's' : ''} · 4 angles each
                      </p>
                    </div>
                  </div>
                  <button onClick={closeProductModal} className="p-1.5 rounded-lg hover:bg-cream-200 text-aura-muted hover:text-aura-dark transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5 font-sans text-xs">

                  {/* ── Section 1: Basic Info ── */}
                  <div className="rounded-xl bg-white border border-aura-dark/8 p-4 space-y-4">
                    <p className="font-semibold text-[10px] uppercase tracking-[0.2em] text-aura-gold flex items-center gap-1.5">
                      <Tag size={11} /> Basic Information
                    </p>

                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">
                        Garment Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setPF('name', e.target.value)}
                        placeholder="e.g. Archival Tailored Blazer"
                        className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg focus:outline-none focus:border-aura-gold transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">
                          Price (Rs.) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setPF('price', e.target.value)}
                          placeholder="3400"
                          className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg focus:outline-none focus:border-aura-gold transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">Original Price (Rs.)</label>
                        <input
                          type="number"
                          value={productForm.original_price}
                          onChange={(e) => setPF('original_price', e.target.value)}
                          placeholder="9200"
                          className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg focus:outline-none focus:border-aura-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">Department</label>
                        <select
                          value={productForm.category_id}
                          onChange={(e) => setPF('category_id', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg focus:outline-none focus:border-aura-gold transition-colors"
                        >
                          <option value="">Select category…</option>
                          {settings.categories?.map((c) => (
                            <option key={c.slug} value={c.slug}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">Condition</label>
                        <select
                          value={productForm.condition}
                          onChange={(e) => setPF('condition', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg focus:outline-none focus:border-aura-gold transition-colors"
                        >
                          <option value="Like New">Like New</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">
                        Available Sizes <span className="text-aura-muted font-normal normal-case">(comma separated)</span>
                      </label>
                      <input
                        type="text"
                        value={productForm.sizes}
                        onChange={(e) => setPF('sizes', e.target.value)}
                        placeholder="XS, S, M, L, XL"
                        className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg focus:outline-none focus:border-aura-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setPF('description', e.target.value)}
                        rows={3}
                        placeholder="Describe the garment — fabric, era, styling notes…"
                        className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg focus:outline-none focus:border-aura-gold transition-colors resize-none"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setPF('featured', e.target.checked)}
                        className="w-4 h-4 accent-aura-dark rounded"
                      />
                      <span className="font-semibold text-aura-dark">Feature this piece on the homepage</span>
                    </label>
                  </div>

                  {/* ── Section 2: Colorways ── */}
                  <div className="rounded-xl bg-white border border-aura-dark/8 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[10px] uppercase tracking-[0.2em] text-aura-gold flex items-center gap-1.5">
                        <Layers size={11} /> Colorways &amp; Photography Angles
                      </p>
                      <button
                        type="button"
                        onClick={addColor}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-aura-dark text-cream-50 rounded-lg text-[10px] font-semibold tracking-wider uppercase hover:bg-aura-gold hover:text-aura-dark transition-colors"
                      >
                        <Plus size={11} /> Add Colorway
                      </button>
                    </div>

                    {/* Color tabs */}
                    <div className="flex flex-wrap gap-2">
                      {productForm.colors.map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveColorIdx(idx)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                            activeColorIdx === idx
                              ? 'bg-aura-dark text-cream-50 border-aura-dark shadow-md'
                              : 'bg-cream-100 text-aura-dark/70 border-aura-dark/15 hover:border-aura-dark/40'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ background: c.hex || '#ccc' }}
                          />
                          {c.name || `Color ${idx + 1}`}
                          {productForm.colors.length > 1 && (
                            <span
                              onClick={(e) => { e.stopPropagation(); removeColor(idx) }}
                              className="ml-1 opacity-50 hover:opacity-100 hover:text-red-500 transition-opacity cursor-pointer"
                            >
                              <X size={10} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Active color editor */}
                    {productForm.colors[activeColorIdx] && (
                      <motion.div
                        key={activeColorIdx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-2"
                      >
                        {/* Color name + hex */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">Color Name</label>
                            <input
                              type="text"
                              value={productForm.colors[activeColorIdx].name}
                              onChange={(e) => setColorField(activeColorIdx, 'name', e.target.value)}
                              placeholder="e.g. Vintage Camel"
                              className="w-full px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg focus:outline-none focus:border-aura-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="font-semibold uppercase tracking-wider block mb-1.5 text-aura-dark/80">Hangtag Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={productForm.colors[activeColorIdx].hex}
                                onChange={(e) => setColorField(activeColorIdx, 'hex', e.target.value)}
                                className="h-10 w-14 rounded-lg border border-aura-dark/15 cursor-pointer p-0.5 bg-cream-50"
                              />
                              <input
                                type="text"
                                value={productForm.colors[activeColorIdx].hex}
                                onChange={(e) => setColorField(activeColorIdx, 'hex', e.target.value)}
                                placeholder="#b8860b"
                                className="flex-1 px-3 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg font-mono text-[11px] focus:outline-none focus:border-aura-gold transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 4 image slots */}
                        <div>
                          <p className="font-semibold uppercase tracking-wider mb-2 text-aura-dark/80">
                            4 Photography Angles
                            <span className="ml-2 font-normal text-aura-muted normal-case tracking-normal">— paste image URLs</span>
                          </p>
                          <div className="space-y-2.5">
                            {[
                              { label: 'Front / Hero', emoji: '📸' },
                              { label: 'Side / Profile', emoji: '👤' },
                              { label: 'Fabric / Detail', emoji: '🔍' },
                              { label: 'Back / Styled', emoji: '✨' },
                            ].map(({ label, emoji }, imgIdx) => (
                              <div key={imgIdx} className="flex items-center gap-2.5">
                                <span className="text-sm shrink-0 w-6 text-center">{emoji}</span>
                                <div className="flex-1 relative">
                                  <input
                                    type="url"
                                    value={productForm.colors[activeColorIdx].images[imgIdx]}
                                    onChange={(e) => setColorImage(activeColorIdx, imgIdx, e.target.value)}
                                    placeholder={`https://…${label.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                                    className="w-full px-3 py-2 bg-cream-50 border border-aura-dark/15 rounded-lg font-mono text-[10px] text-aura-dark focus:outline-none focus:border-aura-gold transition-colors pr-10"
                                  />
                                  {productForm.colors[activeColorIdx].images[imgIdx] && (
                                    <a
                                      href={productForm.colors[activeColorIdx].images[imgIdx]}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-gold"
                                    >
                                      <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                                {productForm.colors[activeColorIdx].images[imgIdx] ? (
                                  <img
                                    src={productForm.colors[activeColorIdx].images[imgIdx]}
                                    alt=""
                                    className="w-10 h-10 rounded-md object-cover border border-aura-dark/15 shrink-0"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-md border border-dashed border-aura-dark/20 bg-cream-100 shrink-0 flex items-center justify-center text-aura-muted/40 text-[10px]">
                                    {imgIdx + 1}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Visual color summary dots */}
                        <div className="flex gap-1.5 pt-1">
                          {productForm.colors.map((c, i) => (
                            <div
                              key={i}
                              title={c.name || `Color ${i + 1}`}
                              onClick={() => setActiveColorIdx(i)}
                              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${i === activeColorIdx ? 'border-aura-dark scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                              style={{ background: c.hex || '#ccc' }}
                            />
                          ))}
                          <button
                            type="button"
                            onClick={addColor}
                            className="w-6 h-6 rounded-full border-2 border-dashed border-aura-dark/30 flex items-center justify-center hover:border-aura-dark text-aura-muted hover:text-aura-dark transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-aura-dark/10 bg-cream-100/80 rounded-b-2xl shrink-0">
                  <p className="font-sans text-[10px] text-aura-muted">
                    {productForm.colors.length} colorway{productForm.colors.length !== 1 ? 's' : ''} ·{' '}
                    {productForm.colors.reduce((acc, c) => acc + c.images.filter(Boolean).length, 0)} images added
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeProductModal}
                      className="btn-outline py-2 px-5 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProduct}
                      disabled={!productForm.name.trim() || !productForm.price}
                      className="btn-primary py-2 px-6 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Save size={13} />
                      <span>{editProduct ? 'Save Changes' : 'Add to Store'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* â”€â”€â”€ Create Coupon Modal â”€â”€â”€ */}
        <AnimatePresence>
          {couponModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aura-dark/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-cream-100 rounded-2xl border border-aura-gold/30 shadow-2xl w-full max-w-md p-6 sm:p-8"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-aura-dark/10">
                  <h3 className="font-serif text-2xl text-aura-dark">Create Coupon</h3>
                  <button onClick={() => setCouponModal(false)} className="p-1 text-aura-muted hover:text-aura-dark">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddCoupon} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="font-semibold uppercase tracking-wider block mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      name="code"
                      required
                      placeholder="e.g. SUMMER25"
                      className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl uppercase font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1">Discount Type</label>
                      <select name="discountType" className="w-full px-3 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (Rs.)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1">Value *</label>
                      <input
                        type="number"
                        name="value"
                        required
                        placeholder="25"
                        className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold uppercase tracking-wider block mb-1">Minimum Spend (Rs.)</label>
                    <input
                      type="number"
                      name="minSpend"
                      defaultValue={0}
                      className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold uppercase tracking-wider block mb-1">Customer Description</label>
                    <input
                      type="text"
                      name="description"
                      placeholder="e.g. 25% Summer Archival Savings"
                      className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-aura-dark/10">
                    <button type="button" onClick={() => setCouponModal(false)} className="btn-outline py-2.5 px-5 text-xs">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary py-2.5 px-6 text-xs">
                      Create Coupon
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
