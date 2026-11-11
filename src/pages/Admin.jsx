import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStoreSettings } from '../context/StoreSettingsContext'
import {
  Package, Megaphone, Sparkles, Navigation, Percent, Image, FolderTree, BookOpen,
  Plus, Trash2, Edit3, Save, RotateCcw, Check, Upload, ExternalLink, Video, Eye,
  CheckCircle2, Flame, Tag, Layers
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
  const [activeTab, setActiveTab] = useState('inventory') // inventory | announcement | hero | navigation | coupons | lookbook | categories | story
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
  const handleSaveHero = (e) => {
    e.preventDefault()
    const form = e.target
    updateHero({
      eyebrow: form.eyebrow.value,
      titleMain: form.titleMain.value,
      titleSub: form.titleSub.value,
      description: form.description.value,
      primaryBtnText: form.primaryBtnText.value,
      primaryBtnLink: form.primaryBtnLink.value,
      secondaryBtnText: form.secondaryBtnText.value,
      secondaryBtnLink: form.secondaryBtnLink.value,
      featuredProductId: form.featuredProductId.value,
    })
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

        {/* ═══════════════════════════════════════════════════════════════
            TAB 1: PRODUCTS INVENTORY & HOMEPAGE FEATURED SELECTION
           ═══════════════════════════════════════════════════════════════ */}
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
                onClick={() => {
                  setEditProduct(null)
                  setProductModal(true)
                }}
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
                              onClick={() => {
                                setEditProduct(p)
                                setProductModal(true)
                              }}
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

        {/* ═══════════════════════════════════════════════════════════════
            TAB 2: ANNOUNCEMENT BAR CRM (ON/OFF & ITEMS)
           ═══════════════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════════════
            TAB 3: HERO SECTION CRM (TEXT, CTAs, 3D FEATURED PIECE)
           ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHero} className="glass-card rounded-2xl p-6 sm:p-10 border border-aura-dark/10 space-y-6">
            <div className="pb-4 border-b border-aura-dark/10">
              <h2 className="font-serif text-2xl text-aura-dark">Hero Section Customizer</h2>
              <p className="font-sans text-xs text-aura-muted mt-1">
                Customize titles, description, CTA buttons, and select which archival piece shines on the 3D lookbook card.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Eyebrow Badge Text</label>
                <input
                  type="text"
                  name="eyebrow"
                  defaultValue={settings.hero?.eyebrow}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Featured 3D Hero Product</label>
                <select
                  name="featuredProductId"
                  defaultValue={settings.hero?.featuredProductId}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Rs. {Number(p.price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Main Title (e.g. Thrift)</label>
                <input
                  type="text"
                  name="titleMain"
                  defaultValue={settings.hero?.titleMain}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-serif text-base"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Subtitle Accent (e.g. aura)</label>
                <input
                  type="text"
                  name="titleSub"
                  defaultValue={settings.hero?.titleSub}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl font-serif italic text-base"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold uppercase tracking-wider block mb-1">Hero Description Paragraph</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={settings.hero?.description}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Primary CTA Button Text</label>
                <input
                  type="text"
                  name="primaryBtnText"
                  defaultValue={settings.hero?.primaryBtnText}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Primary Button Link</label>
                <input
                  type="text"
                  name="primaryBtnLink"
                  defaultValue={settings.hero?.primaryBtnLink}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Secondary Button Text</label>
                <input
                  type="text"
                  name="secondaryBtnText"
                  defaultValue={settings.hero?.secondaryBtnText}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Secondary Button Link</label>
                <input
                  type="text"
                  name="secondaryBtnLink"
                  defaultValue={settings.hero?.secondaryBtnLink}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-aura-dark/10">
              <button type="submit" className="btn-primary py-3 px-8 text-xs flex items-center gap-2">
                <Save size={15} />
                <span>Save Hero Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 4: NAVBAR BUTTONS & CUSTOM SALE CAMPAIGNS
           ═══════════════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════════════
            TAB 5: DISCOUNT COUPONS CRM
           ═══════════════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════════════
            TAB 6: LOOKBOOK MOODBOARD (IMAGE OR VIDEO)
           ═══════════════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════════════
            TAB 7: DEPARTMENTS & CATEGORIES CRM
           ═══════════════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════════════
            TAB 8: OUR STORY SECTION (TEXT, STATS, PIC OR VIDEO)
           ═══════════════════════════════════════════════════════════════ */}
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

        {/* ─── Add/Edit Product Modal ─── */}
        <AnimatePresence>
          {productModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aura-dark/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-cream-100 rounded-2xl border border-aura-gold/30 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8"
              >
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-aura-dark/10">
                  <h3 className="font-serif text-2xl text-aura-dark">
                    {editProduct ? 'Edit Archival Piece' : 'Add New Archival Garment'}
                  </h3>
                  <button onClick={() => setProductModal(false)} className="p-1 text-aura-muted hover:text-aura-dark">
                    <X size={20} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const form = e.target
                    const prodData = {
                      id: editProduct?.id || `sp-${Date.now()}`,
                      name: form.name.value,
                      description: form.description.value,
                      price: parseFloat(form.price.value),
                      original_price: form.original_price.value ? parseFloat(form.original_price.value) : null,
                      condition: form.condition.value,
                      sizes: form.sizes.value.split(',').map((s) => s.trim()),
                      featured: form.featured.checked,
                      category_id: form.category_id.value,
                      categories: { name: form.category_id.value },
                      colors: [
                        {
                          name: form.colorName.value || 'Original Shade',
                          hex: form.colorHex.value || '#222',
                          images: [
                            form.img1.value || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
                            form.img2.value || form.img1.value,
                            form.img3.value || form.img1.value,
                            form.img4.value || form.img1.value,
                          ],
                        },
                      ],
                    }
                    saveProduct(prodData)
                    setProductModal(false)
                    showSaveSuccess()
                  }}
                  className="space-y-4 text-xs font-sans"
                >
                  <div>
                    <label className="font-semibold uppercase tracking-wider block mb-1">Garment Title *</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editProduct?.name}
                      required
                      placeholder="e.g. Distressed Painted Logo Tank Top"
                      className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1">Price (Rs.) *</label>
                      <input
                        type="number"
                        name="price"
                        defaultValue={editProduct?.price}
                        required
                        className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1">Original Price (Rs.)</label>
                      <input
                        type="number"
                        name="original_price"
                        defaultValue={editProduct?.original_price}
                        className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1">Department</label>
                      <select
                        name="category_id"
                        defaultValue={editProduct?.category_id || 'outerwear'}
                        className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                      >
                        {settings.categories?.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1">Condition</label>
                      <select
                        name="condition"
                        defaultValue={editProduct?.condition || 'Like New'}
                        className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                      >
                        <option value="Like New">Like New</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold uppercase tracking-wider block mb-1">Sizes (comma separated)</label>
                    <input
                      type="text"
                      name="sizes"
                      defaultValue={editProduct?.sizes?.join(', ') || 'S, M, L'}
                      className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                    />
                  </div>

                  {/* Color Hangtag & 4 Angle Images */}
                  <div className="p-4 rounded-xl bg-cream-200/60 border border-aura-dark/10 space-y-3">
                    <p className="font-semibold text-aura-dark text-[11px] uppercase tracking-wider">
                      Primary Colorway & 4 Photography Angles
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-aura-muted uppercase tracking-wider block mb-1">Color Name</label>
                        <input
                          type="text"
                          name="colorName"
                          defaultValue={editProduct?.colors?.[0]?.name || 'Vintage Sand'}
                          className="w-full px-3 py-2 bg-cream-50 border border-aura-dark/20 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-aura-muted uppercase tracking-wider block mb-1">Hangtag Color Hex</label>
                        <input
                          type="color"
                          name="colorHex"
                          defaultValue={editProduct?.colors?.[0]?.hex || '#b8860b'}
                          className="w-full h-9 rounded border border-aura-dark/20 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] text-aura-muted uppercase tracking-wider">Angle 1 (Front View URL):</p>
                      <input type="text" name="img1" defaultValue={editProduct?.colors?.[0]?.images?.[0]} placeholder="Front image URL" className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-md font-mono text-[11px]" />

                      <p className="text-[10px] text-aura-muted uppercase tracking-wider">Angle 2 (Profile View URL):</p>
                      <input type="text" name="img2" defaultValue={editProduct?.colors?.[0]?.images?.[1]} placeholder="Profile image URL" className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-md font-mono text-[11px]" />

                      <p className="text-[10px] text-aura-muted uppercase tracking-wider">Angle 3 (Fabric Texture URL):</p>
                      <input type="text" name="img3" defaultValue={editProduct?.colors?.[0]?.images?.[2]} placeholder="Texture image URL" className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-md font-mono text-[11px]" />

                      <p className="text-[10px] text-aura-muted uppercase tracking-wider">Angle 4 (Back / Silhouette URL):</p>
                      <input type="text" name="img4" defaultValue={editProduct?.colors?.[0]?.images?.[3]} placeholder="Back image URL" className="w-full px-3 py-1.5 bg-cream-50 border border-aura-dark/20 rounded-md font-mono text-[11px]" />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold uppercase tracking-wider block mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={editProduct?.description}
                      className="w-full px-4 py-2.5 bg-cream-50 border border-aura-dark/20 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      defaultChecked={editProduct?.featured}
                      className="w-4 h-4 accent-aura-dark"
                    />
                    <label htmlFor="featured" className="font-semibold cursor-pointer">
                      Feature on Homepage Highlights
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-aura-dark/10">
                    <button type="button" onClick={() => setProductModal(false)} className="btn-outline py-2.5 px-5 text-xs">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary py-2.5 px-6 text-xs">
                      Save to Store
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ─── Create Coupon Modal ─── */}
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
