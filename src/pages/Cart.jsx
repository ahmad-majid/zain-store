import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useStoreSettings } from '../context/StoreSettingsContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { user } = useAuth()
  const { settings } = useStoreSettings()
  const navigate = useNavigate()

  const [promoCode, setPromoCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [checkedOut, setCheckedOut] = useState(false)

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

    // Find coupon in CRM settings
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

  const handleCheckout = () => {
    setCheckedOut(true)
    clearCart()
  }

  if (checkedOut) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-6 flex flex-col items-center justify-center text-center relative z-10">
        <div className="w-16 h-16 bg-aura-gold/20 text-aura-gold rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={36} />
        </div>
        <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-aura-muted mb-2 block font-semibold">
          Order Confirmed • Drop 04
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-aura-dark mb-3">
          Your Archival Pieces are Reserved
        </h2>
        <p className="font-sans text-sm text-aura-dark/70 max-w-md leading-relaxed mb-8">
          We've received your request. Our styling concierge is preparing your garment with archival tissue wrap and eco steam-sanitization.
        </p>
        <Link to="/shop" className="btn-primary">
          Continue Browsing
        </Link>
      </main>
    )
  }

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
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-aura-dark/10">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-aura-dark font-normal">
              Shopping <span className="italic text-aura-warm">Bag</span>
            </h1>
            <p className="font-sans text-xs text-aura-muted mt-1 uppercase tracking-widest">
              {items.length} Archival {items.length === 1 ? 'Piece' : 'Pieces'}
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wider uppercase text-aura-muted hover:text-aura-dark transition-colors font-medium"
          >
            <ArrowLeft size={13} />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-5 p-5 bg-cream-100/80 rounded-xl border border-aura-dark/10 shadow-sm"
                >
                  <div className="w-24 sm:w-28 aspect-[3/4] bg-cream-200 rounded-lg overflow-hidden shrink-0 border border-aura-dark/10">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.id}`}
                          className="font-serif text-lg text-aura-dark hover:text-aura-warm transition-colors leading-snug"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id, item.selectedSize)}
                          className="text-aura-muted hover:text-red-500 transition-colors p-1"
                          title="Remove piece"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-xs font-sans text-aura-muted">
                        <span>Size: <strong className="text-aura-dark font-medium">{item.selectedSize}</strong></span>
                        {item.selectedColor && (
                          <>
                            <span>•</span>
                            <span className="text-aura-dark font-medium">{item.selectedColor}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="text-aura-warm font-medium">{item.condition}</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-4 pt-3 border-t border-aura-dark/5">
                      <div className="flex items-center border border-aura-dark/20 rounded-md bg-cream-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="p-1.5 text-aura-dark/70 hover:text-aura-dark transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 font-sans text-xs font-medium text-aura-dark">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="p-1.5 text-aura-dark/70 hover:text-aura-dark transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="font-sans text-base font-semibold text-aura-dark">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={clearCart}
              className="text-[11px] font-sans tracking-widest uppercase text-aura-muted hover:text-aura-dark underline"
            >
              Empty Bag
            </button>
          </div>

          {/* Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-aura-gold/25 shadow-lg sticky top-28 space-y-6">
              <h3 className="font-serif text-2xl font-normal text-aura-dark pb-4 border-b border-aura-dark/10">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between text-aura-dark/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-aura-dark">Rs. {total.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} />
                      <span>{appliedCoupon.code} applied</span>
                    </span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-aura-dark/70">
                  <span>Express Courier Delivery</span>
                  <span>{shipping === 0 ? <strong className="text-aura-warm font-semibold">Complimentary</strong> : `Rs. ${shipping}`}</span>
                </div>
              </div>

              {/* Dynamic Coupon Input */}
              <div>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter coupon code (e.g. AURA10)"
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
                  <span className="font-sans text-[10px] text-aura-muted">Includes all taxes & duties</span>
                </div>
                <span className="font-sans text-2xl font-bold text-aura-dark">
                  Rs. {finalTotal.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
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
    </main>
  )
}
