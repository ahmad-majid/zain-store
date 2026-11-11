import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useStoreSettings } from '../context/StoreSettingsContext'
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Sparkles,
  ArrowRight, CheckCircle2, Tag, Printer, Copy, Check, MessageCircle, X,
  Truck, CreditCard, Banknote, User, MapPin, Phone, Mail
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { user } = useAuth()
  const { settings } = useStoreSettings()
  const navigate = useNavigate()

  // Coupon state
  const [promoCode, setPromoCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  // Checkout modal & state
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [copied, setCopied] = useState(false)

  // Customer shipping form
  const [form, setForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cod', // cod | card
  })
  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  // Calculate discount based on active CRM coupons
  let discountAmount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((total * appliedCoupon.value) / 100)
    } else {
      discountAmount = appliedCoupon.value
    }
  }

  const shipping = total > 3000 ? 0 : 250
  const finalTotal = Math.max(0, total - discountAmount + (items.length > 0 ? shipping : 0))

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setCouponError('')
    const inputCode = promoCode.trim().toUpperCase()

    const match = settings.coupons?.find(
      (c) => c.code.toUpperCase() === inputCode && c.active
    )

    if (!match) {
      setCouponError('Invalid or inactive discount code')
      setAppliedCoupon(null)
      return
    }

    if (match.minSpend && total < match.minSpend) {
      setCouponError(`This code requires a minimum spend of Rs. ${match.minSpend.toLocaleString()}`)
      setAppliedCoupon(null)
      return
    }

    setAppliedCoupon(match)
  }

  // Handle final order confirmation
  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      alert('Please fill out all required shipping fields.')
      return
    }

    // Generate real Order ID
    const randomNum = Math.floor(10000 + Math.random() * 90000)
    const orderId = `AUR-${randomNum}`

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...items],
      client: { ...form },
      paymentMethod: form.paymentMethod,
      subtotal: total,
      discount: discountAmount,
      couponCode: appliedCoupon?.code || null,
      shipping,
      total: finalTotal,
      status: 'Pending Atelier Prep',
    }

    // Persist to localStorage for Returns & Order Lookup integration
    try {
      const existing = JSON.parse(localStorage.getItem('thrift-aura-orders') || '[]')
      localStorage.setItem('thrift-aura-orders', JSON.stringify([newOrder, ...existing]))
    } catch (err) {
      console.warn('Failed saving order to local storage', err)
    }

    setConfirmedOrder(newOrder)
    setCheckoutOpen(false)
    clearCart()
  }

  const copyOrderId = () => {
    if (!confirmedOrder) return
    navigator.clipboard.writeText(confirmedOrder.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const sendOrderToWhatsApp = () => {
    if (!confirmedOrder) return
    const itemsSummary = confirmedOrder.items
      .map((it) => `• ${it.name} (${it.selectedColor || 'Standard'}, Size ${it.selectedSize || 'Std'}) x${it.quantity}`)
      .join('\n')

    const message = `*Thrift Aura — Order Confirmation*\n` +
      `*Order ID:* ${confirmedOrder.id}\n` +
      `*Client:* ${confirmedOrder.client.fullName} (${confirmedOrder.client.phone})\n` +
      `*Address:* ${confirmedOrder.client.address}, ${confirmedOrder.client.city}\n` +
      `*Payment:* ${confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / Bank'}\n\n` +
      `*Items:*\n${itemsSummary}\n\n` +
      `*Total Paid:* Rs. ${confirmedOrder.total.toLocaleString()}\n` +
      `Please confirm dispatch details!`

    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(message)}`, '_blank')
  }

  // ─── Order Confirmed & Printable Invoice View ───
  if (confirmedOrder) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-6 relative z-10 max-w-4xl mx-auto">
        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="bg-cream-50 rounded-3xl border border-aura-gold/40 p-6 sm:p-12 shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-aura-dark/10 gap-4">
            <div>
              <span className="font-serif text-3xl text-aura-dark block">Thrift</span>
              <span className="font-serif text-2xl text-aura-gold tracking-widest italic -mt-1 block">aura</span>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-aura-muted mt-1">
                Official Archival Acquisition Receipt
              </p>
            </div>

            <div className="sm:text-right">
              <span className="font-sans text-[11px] uppercase tracking-wider text-aura-muted block">Order Identifier</span>
              <div className="flex items-center sm:justify-end gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold text-aura-dark tracking-tight">
                  {confirmedOrder.id}
                </span>
                <button
                  onClick={copyOrderId}
                  className="p-1.5 rounded-md hover:bg-cream-200 text-aura-muted hover:text-aura-dark transition-colors"
                  title="Copy Order ID"
                >
                  {copied ? <Check size={16} className="text-emerald-700" /> : <Copy size={16} />}
                </button>
              </div>
              <span className="font-sans text-xs text-aura-muted block mt-0.5">
                {new Date(confirmedOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Success Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/5 border border-emerald-600/20 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-700 shrink-0" />
            <div>
              <h4 className="font-serif text-base font-bold text-aura-dark">Acquisition Reserved &amp; Authenticated</h4>
              <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
                Your archival piece is reserved. Our concierge is applying steam sanitization and archival tissue wrapping before insured courier dispatch.
              </p>
            </div>
          </div>

          {/* Client & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-white border border-aura-dark/10 text-xs font-sans">
            <div>
              <p className="font-semibold uppercase tracking-wider text-[10px] text-aura-gold mb-1">Delivering To:</p>
              <p className="font-bold text-aura-dark text-sm">{confirmedOrder.client.fullName}</p>
              <p className="text-aura-dark/80 mt-0.5">{confirmedOrder.client.address}</p>
              <p className="text-aura-dark/80">{confirmedOrder.client.city}</p>
              <p className="text-aura-muted mt-1 font-mono">{confirmedOrder.client.phone}</p>
              {confirmedOrder.client.email && (
                <p className="text-aura-muted font-mono">{confirmedOrder.client.email}</p>
              )}
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wider text-[10px] text-aura-gold mb-1">Dispatch Details:</p>
              <p className="font-bold text-aura-dark capitalize">
                {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Courier Handover)' : 'Direct Electronic Clearance'}
              </p>
              <p className="text-aura-dark/80 mt-1">Insured Express Courier (2–4 Business Days)</p>
              <div className="mt-2 inline-block px-2.5 py-1 rounded bg-aura-gold/15 text-aura-dark text-[10px] font-bold uppercase tracking-wider border border-aura-gold/30">
                Status: {confirmedOrder.status}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-aura-dark/10 text-aura-muted text-[10px] uppercase tracking-wider font-semibold">
                  <th className="pb-3">Archival Piece</th>
                  <th className="pb-3">Colorway &amp; Size</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-dark/8">
                {confirmedOrder.items.map((it, idx) => {
                  const img = it.colors?.[0]?.images?.[0] || it.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'
                  return (
                    <tr key={idx} className="py-3">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={img} alt="" className="w-10 h-12 rounded object-cover border border-aura-dark/10 shrink-0" />
                          <span className="font-serif font-bold text-aura-dark text-sm">{it.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-aura-dark/80">
                        {it.selectedColor || 'Standard'} · Size {it.selectedSize || 'M'}
                      </td>
                      <td className="py-3 text-center font-mono font-medium">{it.quantity}</td>
                      <td className="py-3 text-right font-bold text-aura-dark font-mono">
                        Rs. {(Number(it.price) * it.quantity).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="pt-4 border-t border-aura-dark/10 flex flex-col items-end space-y-1.5 text-xs font-sans">
            <div className="flex justify-between w-64 text-aura-dark/70">
              <span>Subtotal:</span>
              <span className="font-mono">Rs. {confirmedOrder.subtotal.toLocaleString()}</span>
            </div>
            {confirmedOrder.discount > 0 && (
              <div className="flex justify-between w-64 text-emerald-700 font-semibold">
                <span>Discount ({confirmedOrder.couponCode}):</span>
                <span className="font-mono">- Rs. {confirmedOrder.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between w-64 text-aura-dark/70">
              <span>Insured Transit:</span>
              <span className="font-mono">{confirmedOrder.shipping === 0 ? 'Complimentary' : `Rs. ${confirmedOrder.shipping}`}</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-aura-dark/10 text-base font-bold text-aura-dark">
              <span>Total Payable:</span>
              <span className="font-mono text-lg text-aura-gold font-bold">Rs. {confirmedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions & Lookup notice */}
          <div className="pt-6 border-t border-aura-dark/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePrint}
                className="btn-outline py-2.5 px-4 text-xs inline-flex items-center gap-2"
              >
                <Printer size={14} />
                <span>Print Archival Invoice</span>
              </button>

              <button
                onClick={sendOrderToWhatsApp}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-semibold tracking-wider uppercase inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle size={14} />
                <span>Confirm on WhatsApp</span>
              </button>
            </div>

            <Link
              to="/returns"
              className="font-sans text-xs text-aura-warm underline hover:text-aura-dark"
            >
              Track or Return via Concierge Portal →
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/shop" className="btn-primary py-3 px-8 text-xs inline-flex items-center gap-2">
            <span>Continue Curating</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    )
  }

  // ─── Empty Cart State ───
  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-6 flex flex-col items-center justify-center text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-aura-muted mb-6">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-serif text-3xl text-aura-dark mb-2">Your Bag is Empty</h2>
        <p className="font-sans text-sm text-aura-muted mb-8 max-w-sm">
          Discover one-of-a-kind vintage tailoring and archival luxury in our latest collection.
        </p>
        <Link to="/shop" className="btn-primary">
          Explore The Collection
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-aura-dark/10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-aura-muted hover:text-aura-dark transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            <span>Continue Curating</span>
          </Link>
          <span className="font-sans text-[11px] tracking-widest uppercase text-aura-gold font-semibold">
            {items.length} Archival Piece{items.length !== 1 ? 's' : ''} in Bag
          </span>
        </div>

        <h1 className="font-serif text-4xl text-aura-dark mb-10">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const itemImg = item.colors?.[0]?.images?.[0] || item.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'
              return (
                <motion.div
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 rounded-2xl bg-cream-100/90 border border-aura-gold/25 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-20 h-24 rounded-xl object-cover border border-aura-dark/10 shrink-0 shadow-sm"
                    />
                    <div>
                      <span className="font-sans text-[10px] tracking-widest uppercase text-aura-gold font-semibold">
                        {item.condition || 'Archival'}
                      </span>
                      <h3 className="font-serif text-lg text-aura-dark leading-tight mt-0.5">
                        {item.name}
                      </h3>
                      <p className="font-sans text-xs text-aura-muted mt-1">
                        Color: <span className="font-medium text-aura-dark">{item.selectedColor || 'Standard'}</span>
                        {' · '}
                        Size: <span className="font-medium text-aura-dark">{item.selectedSize || 'M'}</span>
                      </p>
                      <p className="font-sans text-sm font-bold text-aura-dark mt-2 font-mono">
                        Rs. {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-aura-dark/10">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-aura-dark/20 rounded-lg bg-cream-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        className="p-2 text-aura-muted hover:text-aura-dark transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-3 font-mono text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        className="p-2 text-aura-muted hover:text-aura-dark transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id, item.selectedSize)}
                      className="p-2 text-aura-muted hover:text-red-500 transition-colors"
                      title="Remove piece"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Order Summary & Coupon (4 cols) */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-2xl bg-cream-100/90 border border-aura-gold/30 shadow-lg space-y-6 backdrop-blur-sm sticky top-28">
              <h2 className="font-serif text-2xl text-aura-dark">Order Summary</h2>

              <div className="space-y-3 text-xs font-sans text-aura-dark/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-mono font-medium">Rs. {total.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-mono">- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Express Courier</span>
                  <span className="font-mono">
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-semibold uppercase tracking-wider text-[11px]">
                        Complimentary
                      </span>
                    ) : (
                      `Rs. ${shipping}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] text-aura-muted italic">
                    Add Rs. {(3000 - total).toLocaleString()} more for complimentary shipping
                  </p>
                )}
              </div>

              {/* Coupon Box */}
              <div>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (e.g. AURA10)"
                    className="flex-1 px-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-lg text-xs font-sans placeholder-aura-muted focus:outline-none focus:border-aura-gold uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-aura-dark text-cream-100 rounded-lg text-xs font-sans tracking-wider uppercase font-semibold hover:bg-aura-gold hover:text-aura-dark transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {couponError && (
                  <p className="text-[11px] font-sans text-red-600 mt-1.5">{couponError}</p>
                )}
                {appliedCoupon && (
                  <p className="text-[11px] font-sans text-emerald-700 mt-1.5">
                    ✓ {appliedCoupon.description}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-aura-dark/10 flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-xl font-normal text-aura-dark block">Estimated Total</span>
                  <span className="font-sans text-[10px] text-aura-muted">Includes all taxes &amp; duties</span>
                </div>
                <span className="font-sans text-2xl font-bold text-aura-dark font-mono">
                  Rs. {finalTotal.toLocaleString()}
                </span>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => setCheckoutOpen(true)}
                className="w-full py-4 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-lg text-xs font-sans tracking-[0.25em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-sans text-aura-muted pt-2">
                <ShieldCheck size={14} className="text-aura-gold" />
                <span>Encrypted 256-bit Checkout Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Boutique Checkout Drawer / Modal ─── */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-aura-dark/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-cream-50 rounded-3xl border border-aura-gold/40 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col my-auto overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-aura-dark/10 bg-white/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-aura-dark text-aura-gold flex items-center justify-center">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-aura-dark">Boutique Checkout</h3>
                    <p className="font-sans text-[10px] text-aura-muted tracking-wider">
                      Insured Courier Dispatch &amp; Handover
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-cream-200 text-aura-muted hover:text-aura-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handlePlaceOrder} className="overflow-y-auto p-6 space-y-6 text-xs font-sans">
                {/* Section 1: Client Delivery Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-aura-dark font-semibold uppercase tracking-wider text-[11px]">
                    <User size={13} className="text-aura-gold" />
                    <span>Recipient Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setField('fullName', e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold"
                      />
                    </div>

                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                        Phone Number (For Courier) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/15 rounded-xl font-mono focus:outline-none focus:border-aura-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                      Email Address (Optional for e-Receipt)
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      placeholder="collector@domain.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold"
                    />
                  </div>
                </div>

                {/* Section 2: Street Address */}
                <div className="space-y-4 pt-3 border-t border-aura-dark/10">
                  <div className="flex items-center gap-2 text-aura-dark font-semibold uppercase tracking-wider text-[11px]">
                    <MapPin size={13} className="text-aura-gold" />
                    <span>Delivery Address</span>
                  </div>

                  <div>
                    <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                      Street Address &amp; House/Apt # <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setField('address', e.target.value)}
                      placeholder="House 14-A, Street 7, Sector F-8"
                      className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setField('city', e.target.value)}
                        placeholder="Islamabad / Lahore / Karachi"
                        className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold"
                      />
                    </div>

                    <div>
                      <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                        Delivery Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.notes}
                        onChange={(e) => setField('notes', e.target.value)}
                        placeholder="Ring bell twice / leave with reception"
                        className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Payment Method */}
                <div className="space-y-3 pt-3 border-t border-aura-dark/10">
                  <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        form.paymentMethod === 'cod'
                          ? 'bg-white border-aura-dark ring-2 ring-aura-gold/40 shadow-sm'
                          : 'bg-cream-100 border-aura-dark/15 hover:border-aura-dark/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={form.paymentMethod === 'cod'}
                          onChange={() => setField('paymentMethod', 'cod')}
                          className="w-4 h-4 accent-aura-dark"
                        />
                        <div>
                          <p className="font-semibold text-aura-dark">Cash on Delivery</p>
                          <p className="text-[10px] text-aura-muted">Pay courier at your doorstep</p>
                        </div>
                      </div>
                      <Banknote size={18} className="text-aura-gold shrink-0" />
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        form.paymentMethod === 'card'
                          ? 'bg-white border-aura-dark ring-2 ring-aura-gold/40 shadow-sm'
                          : 'bg-cream-100 border-aura-dark/15 hover:border-aura-dark/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={form.paymentMethod === 'card'}
                          onChange={() => setField('paymentMethod', 'card')}
                          className="w-4 h-4 accent-aura-dark"
                        />
                        <div>
                          <p className="font-semibold text-aura-dark">Direct Wire / Card</p>
                          <p className="text-[10px] text-aura-muted">Electronic Clearance</p>
                        </div>
                      </div>
                      <CreditCard size={18} className="text-aura-gold shrink-0" />
                    </label>
                  </div>
                </div>

                {/* Section 4: Final Breakdown Bar */}
                <div className="p-4 rounded-xl bg-aura-dark text-cream-100 space-y-2">
                  <div className="flex justify-between text-cream-300/80 text-[11px]">
                    <span>Items Total ({items.length}):</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-aura-gold text-[11px]">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-cream-300/80 text-[11px]">
                    <span>Insured Transit:</span>
                    <span>{shipping === 0 ? 'Complimentary' : `Rs. ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-cream-100/10 text-sm font-bold">
                    <span>Payable Amount:</span>
                    <span className="font-serif text-lg text-aura-gold">Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(false)}
                    className="btn-outline py-2.5 px-5 text-xs"
                  >
                    Back to Bag
                  </button>
                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-6 text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-lg"
                  >
                    <span>Reserve &amp; Place Order</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
