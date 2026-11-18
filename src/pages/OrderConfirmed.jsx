import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, Truck, ArrowRight, Mail, Copy, Check } from 'lucide-react'

export default function OrderConfirmed() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('thrift-aura-orders') || '[]')
      const found = all.find((o) => o.id.toUpperCase() === orderId?.toUpperCase())
      setOrder(found || null)
    } catch {
      setOrder(null)
    }
  }, [orderId])

  const copyId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!order) {
    return (
      <main className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <Package size={40} className="text-aura-muted mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-aura-dark mb-2">Order Not Found</h2>
          <p className="font-sans text-sm text-aura-dark/60 mb-6">We couldn't locate order <strong>{orderId}</strong>. It may have been placed in a different session.</p>
          <Link to="/my-orders" className="btn-primary inline-flex items-center gap-2">
            <span>View My Orders</span><ArrowRight size={14} />
          </Link>
        </motion.div>
      </main>
    )
  }

  const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* Success Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} />
          </div>
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-aura-gold font-semibold block mb-2">Order Confirmed</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-aura-dark mb-3">Acquisition Reserved!</h1>
          <p className="font-sans text-sm text-aura-dark/60 leading-relaxed max-w-sm mx-auto">
            Your archival piece is reserved and authenticated. Our atelier team will begin preparation shortly.
          </p>
        </motion.div>

        {/* Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white border border-aura-gold/30 rounded-3xl shadow-xl overflow-hidden mb-6"
        >
          {/* Top Gold Bar */}
          <div className="h-1.5 bg-gradient-to-r from-aura-gold/40 via-aura-gold to-aura-gold/40" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Order ID */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-wider text-aura-muted mb-0.5">Order Identifier</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-bold text-aura-dark">{order.id}</span>
                  <button onClick={copyId} className="p-1.5 rounded-md hover:bg-cream-200 text-aura-muted hover:text-aura-dark transition-colors" title="Copy">
                    {copied ? <Check size={15} className="text-emerald-700" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-sans text-[10px] uppercase tracking-wider text-aura-muted mb-0.5">Placed On</p>
                <p className="font-sans text-xs text-aura-dark">{dateFormatted}</p>
              </div>
            </div>

            {/* Email confirmation notice */}
            <div className="p-4 rounded-2xl bg-emerald-950/5 border border-emerald-600/20 flex items-start gap-3">
              <Mail size={18} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-xs font-semibold text-aura-dark">Confirmation email dispatched</p>
                <p className="font-sans text-[11px] text-aura-dark/70 mt-0.5">
                  An official receipt has been sent to <strong className="font-mono">{order.client?.email}</strong>
                </p>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="p-4 rounded-2xl bg-aura-gold/5 border border-aura-gold/20">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={15} className="text-aura-gold" />
                <p className="font-sans text-[11px] uppercase tracking-wider font-semibold text-aura-dark">Estimated Timeline</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-sans text-aura-dark/80">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-aura-gold" />
                  <div className="w-px h-6 bg-aura-gold/30" />
                </div>
                <div>
                  <p className="font-semibold">Order Confirmed</p>
                  <p className="text-aura-muted text-[10px]">Today</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-sans text-aura-dark/80 mt-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cream-300" />
                  <div className="w-px h-6 bg-cream-300" />
                </div>
                <div>
                  <p className="font-semibold">Atelier Preparation</p>
                  <p className="text-aura-muted text-[10px]">1–2 Business Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-sans text-aura-dark/80 mt-1">
                <div className="w-2 h-2 rounded-full bg-cream-300 ml-0" />
                <div>
                  <p className="font-semibold">Courier Dispatch & Delivery</p>
                  <p className="text-aura-muted text-[10px]">2–4 Business Days</p>
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-aura-gold font-semibold mb-3">Order Items</p>
              <div className="space-y-3">
                {order.items?.map((it, i) => {
                  const img = it.colors?.[0]?.images?.[0] || it.images?.[0]
                    || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&fit=crop&q=80'
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <img src={img} alt={it.name} className="w-12 h-14 rounded-lg object-cover border border-aura-dark/10 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm text-aura-dark line-clamp-1">{it.name}</p>
                        <p className="font-sans text-[11px] text-aura-muted">{it.selectedColor || 'Std'} · Size {it.selectedSize || 'Std'} × {it.quantity}</p>
                      </div>
                      <p className="font-mono text-sm font-semibold text-aura-dark shrink-0">
                        Rs. {(Number(it.price) * it.quantity).toLocaleString()}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-4 border-t border-aura-dark/10">
              <div>
                <p className="font-semibold uppercase tracking-wider text-[10px] text-aura-gold mb-1">Delivering To</p>
                <p className="font-medium text-aura-dark">{order.client?.fullName}</p>
                <p className="text-aura-muted mt-0.5">{order.client?.address}</p>
                <p className="text-aura-muted">{order.client?.city}</p>
                <p className="text-aura-muted font-mono mt-1">{order.client?.phone}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-[10px] text-aura-gold mb-1">Payment Method</p>
                <p className="font-medium text-aura-dark">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / Bank Transfer'}
                </p>
                {order.couponCode && <p className="text-emerald-700 mt-1 text-[11px]">Coupon: {order.couponCode} applied</p>}
                <p className="font-semibold text-aura-dark mt-2 font-mono text-base">Rs. {Number(order.total).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/my-orders" className="flex-1 py-3.5 border-2 border-aura-dark text-aura-dark hover:bg-aura-dark hover:text-cream-100 rounded-xl text-xs font-sans tracking-wider uppercase font-semibold transition-all flex items-center justify-center gap-2">
            <Package size={15} /> View All My Orders
          </Link>
          <Link to="/shop" className="flex-1 btn-primary flex items-center justify-center gap-2">
            <span>Continue Shopping</span> <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
