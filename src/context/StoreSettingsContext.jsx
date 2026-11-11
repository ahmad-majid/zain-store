import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { sampleProducts } from '../data/sampleProducts'

const defaultSettings = {
  // Announcement Bar
  announcement: {
    enabled: true,
    speed: 28,
    items: [
      'DROP 04 IS LIVE',
      'HAND-PICKED ARCHIVAL VINTAGE',
      'COMPLIMENTARY SHIPPING OVER RS. 3,000',
      'AUTHENTICITY 100% VERIFIED',
      'EACH PIECE IS ONE OF ONE',
      'SUSTAINABLE CIRCULAR LUXURY',
    ],
  },

  // Hero Section
  hero: {
    eyebrow: 'Editorial Thrift Archive • Drop 04',
    titleMain: 'Thrift',
    titleSub: 'aura',
    description:
      'One-of-a-kind vintage tailoring, archival luxury outerwear, and timeless silhouettes. Meticulously sourced, certified authentic, and ready for a second lifetime.',
    primaryBtnText: 'Explore The Drop',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'Featured Pieces',
    secondaryBtnLink: '#featured',
    featuredProductId: 'sp-01', // ID of product showcased in 3D lookbook card
  },

  // Dynamic Navigation Bar Links
  navigation: [
    { id: 'nav-1', label: 'Shop All', to: '/shop', isSale: false },
    { id: 'nav-2', label: 'Outerwear', to: '/shop?category=outerwear', isSale: false },
    { id: 'nav-3', label: 'Dresses', to: '/shop?category=dresses', isSale: false },
    { id: 'nav-4', label: 'About', to: '/#about', isSale: false },
    { id: 'nav-5', label: '🔥 ARCHIVE SALE 30% OFF', to: '/campaign/archive-sale', isSale: true },
  ],

  // Custom Campaigns / Sale Pages
  campaigns: [
    {
      id: 'archive-sale',
      slug: 'archive-sale',
      title: 'Mid-Season Archival Sale',
      subtitle: 'Up to 50% off select curated designer pieces',
      bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=600&fit=crop&q=85',
      productIds: ['sp-01', 'sp-02', 'sp-03', 'sp-05'],
    },
  ],

  // Discount Coupons
  coupons: [
    {
      id: 'c-1',
      code: 'AURA10',
      discountType: 'percentage', // percentage | fixed
      value: 10, // 10%
      minSpend: 0,
      active: true,
      description: 'Welcome 10% off entire order',
    },
    {
      id: 'c-2',
      code: 'VINTAGE500',
      discountType: 'fixed',
      value: 500, // Rs. 500 off
      minSpend: 3000,
      active: true,
      description: 'Rs. 500 off on orders over Rs. 3,000',
    },
    {
      id: 'c-3',
      code: 'ARCHIVE20',
      discountType: 'percentage',
      value: 20, // 20%
      minSpend: 5000,
      active: true,
      description: '20% VIP collector discount on orders over Rs. 5,000',
    },
  ],

  // Custom Lookbook
  lookbook: [
    {
      id: 'lb-1',
      title: 'Monochrome Tailoring',
      sub: '90s Minimalist Architecture',
      tag: 'Look 01',
      mediaType: 'image', // image | video
      mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1100&fit=crop&q=85',
      link: '/shop?category=outerwear',
      colSpan: 'md:col-span-4',
    },
    {
      id: 'lb-2',
      title: 'The Italian Trench',
      sub: 'Archival Gabardine & Heavy Wool',
      tag: 'Look 02',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1100&fit=crop&q=85',
      link: '/shop?category=outerwear',
      colSpan: 'md:col-span-4',
    },
    {
      id: 'lb-3',
      title: 'Effortless Eveningwear',
      sub: 'Pure Silk & Bias Drape',
      tag: 'Look 03',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1562813731-e2fc35f74a4a?w=800&h=1100&fit=crop&q=85',
      link: '/shop?category=dresses',
      colSpan: 'md:col-span-4',
    },
  ],

  // Categories
  categories: [
    {
      id: 'outerwear',
      name: 'Outerwear & Coats',
      slug: 'outerwear',
      desc: 'Wool trench coats, structured blazers & leather',
      count: '14 Pieces',
      img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=700&h=900&fit=crop&q=85',
    },
    {
      id: 'dresses',
      name: 'Dresses & Gowns',
      slug: 'dresses',
      desc: 'Bias silk slips, tea dresses & formal archives',
      count: '9 Pieces',
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&h=900&fit=crop&q=85',
    },
    {
      id: 'tops',
      name: 'Tailored Tops',
      slug: 'tops',
      desc: 'Pure crisp linen shirts, knits & vintage tees',
      count: '18 Pieces',
      img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=700&h=900&fit=crop&q=85',
    },
    {
      id: 'bottoms',
      name: 'Trousers & Skirts',
      slug: 'bottoms',
      desc: 'Wide-leg wool pleats & premium heritage denim',
      count: '12 Pieces',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1cde3?w=700&h=900&fit=crop&q=85',
    },
  ],

  // Our Story / About Section
  story: {
    label: 'Our Story & Philosophy',
    title: 'Fashion with a',
    titleItalic: 'Conscience',
    p1: 'Thrift Aura was born from a love of archival craftsmanship and a deep commitment to environmental stewardship. We believe that style and conscience can coexist beautifully.',
    p2: 'Every garment in our catalog is hand-sourced from private European and Japanese collections, ecologically sanitized, and certified authentic. We are not just recirculating garments — we are celebrating history.',
    stat1Number: '500+',
    stat1Label: 'Pieces Found New Homes',
    stat2Number: '100%',
    stat2Label: 'Circular Sustainability',
    mediaType: 'image', // image | video
    mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&q=85',
  },
}

const StoreSettingsContext = createContext({})

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('thrift-aura-settings')
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
    } catch (e) {
      return defaultSettings
    }
  })

  // Products state (can be edited/curated dynamically in CRM)
  const [products, setProducts] = useState(() => {
    try {
      const savedProds = localStorage.getItem('thrift-aura-products')
      return savedProds ? JSON.parse(savedProds) : sampleProducts
    } catch (e) {
      return sampleProducts
    }
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem('thrift-aura-settings', JSON.stringify(settings))
    } catch (e) {}
  }, [settings])

  // Save products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('thrift-aura-products', JSON.stringify(products))
    } catch (e) {}
  }, [products])

  // Helpers to update specific sections
  const updateAnnouncement = (announcement) => {
    setSettings((prev) => ({ ...prev, announcement: { ...prev.announcement, ...announcement } }))
  }

  const updateHero = (hero) => {
    setSettings((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }))
  }

  const updateNavigation = (navigation) => {
    setSettings((prev) => ({ ...prev, navigation }))
  }

  const updateCampaigns = (campaigns) => {
    setSettings((prev) => ({ ...prev, campaigns }))
  }

  const updateCoupons = (coupons) => {
    setSettings((prev) => ({ ...prev, coupons }))
  }

  const updateLookbook = (lookbook) => {
    setSettings((prev) => ({ ...prev, lookbook }))
  }

  const updateCategories = (categories) => {
    setSettings((prev) => ({ ...prev, categories }))
  }

  const updateStory = (story) => {
    setSettings((prev) => ({ ...prev, story: { ...prev.story, ...story } }))
  }

  const toggleFeaturedProduct = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, featured: !p.featured } : p))
    )
  }

  const saveProduct = (productData) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === productData.id)
      if (exists) {
        return prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p))
      }
      return [productData, ...prev]
    })
  }

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const resetAllSettings = () => {
    setSettings(defaultSettings)
    setProducts(sampleProducts)
    localStorage.removeItem('thrift-aura-settings')
    localStorage.removeItem('thrift-aura-products')
  }

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        products,
        updateAnnouncement,
        updateHero,
        updateNavigation,
        updateCampaigns,
        updateCoupons,
        updateLookbook,
        updateCategories,
        updateStory,
        toggleFeaturedProduct,
        saveProduct,
        deleteProduct,
        resetAllSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  )
}

export const useStoreSettings = () => useContext(StoreSettingsContext)
