import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import {
  Package, ShieldCheck, ArrowRight, ChevronDown, ChevronUp,
  RotateCcw, Clock, Truck, CheckCircle2, Sparkles, LogIn, Printer,
  Copy, Check, Hash
} from 'lucide-react'

const STATUS_CONFIG = {
  'Pending Atelier Prep': { color: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Pending' },
  'Processing': { color: 'text-blue-700 bg-blue-50 border-blue-200', label: 'Processing' },
  'Dispatched via Courier': { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Dispatched' },
  'Delivered': { color: 'text-green-800 bg-green-50 border-green-200', label: 'Delivered' },
  'Cancelled': { color: 'text-red-700 bg-red-50 border-red-200', label: 'Cancelled' },
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyId = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(order.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusCfg = STATUS_CONFIG[order.status] || { color: 'text-aura-muted bg-cream-100 border-cream-200', label: order.status }
  const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
  const firstItem = order.items?.[0]
  const itemImg = firstItem?.colors?.[0]?.images?.[0] || firstItem?.images?.[0]
    || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&fit=crop&q=80'

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-aura-gold/25 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <img src={itemImg} alt={firstItem?.name} className="w-16 h-20 rounded-xl object-cover border border-aura-dark/10 shrink-0 shadow-xs" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <div className="inline-flex items-center gap-1.5 bg-cream-100/90 border border-aura-gold/30 rounded-lg px-2.5 py-1 shadow-xs">
                <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-aura-gold">Order #</span>
                <span className="font-mono text-sm font-bold text-aura-dark tracking-wide">{order.id}</span>
                <button
                  onClick={handleCopyId}
                  type="button"
                  title="Copy Order ID"
                  className="text-aura-muted hover:text-aura-dark transition-colors p-0.5 ml-0.5 rounded hover:bg-white"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                </button>
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border font-sans ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
            </div>
            <p className="font-sans text-xs text-aura-muted flex items-center gap-1.5">
              <Clock size={12} className="text-aura-gold/80" />
              <span>Placed on {dateFormatted}</span>
            </p>
            <p className="font-sans text-xs text-aura-dark/80">
              <span className="font-medium">{order.items?.length} piece{order.items?.length !== 1 ? 's' : ''}</span> ·{' '}
              <span className="font-semibold text-aura-dark font-mono">Rs. {Number(order.total).toLocaleString()}</span>
            </p>
            {firstItem && (
              <p className="font-sans text-xs text-aura-muted italic line-clamp-1">
                {firstItem.name} {order.items?.length > 1 && `+ ${order.items.length - 1} more`}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-aura-dark/10">
          <Link
            to={`/track/${order.id}`}
            className="text-xs font-sans font-semibold text-aura-gold hover:text-aura-dark flex items-center gap-1.5 uppercase tracking-wider bg-aura-gold/10 hover:bg-aura-gold/20 px-3 py-1.5 rounded-lg border border-aura-gold/25 transition-colors"
          >
            <Truck size={13} /> Track Courier
          </Link>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-aura-dark hover:text-aura-gold transition-colors font-sans uppercase tracking-wider py-1 px-2"
          >
            {expanded ? 'Hide Details' : 'View Slip'} {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="border-t border-aura-dark/10 p-5 bg-cream-50/60 space-y-4 text-xs font-sans">
          {/* Order Header Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-aura-gold/25 shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-aura-gold block">Official Order Reference / ID</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-base font-bold text-aura-dark">#{order.id}</span>
                <button
                  onClick={handleCopyId}
                  type="button"
                  className="text-[11px] font-sans font-normal text-aura-muted hover:text-aura-dark underline flex items-center gap-1"
                >
                  {copied ? <span className="text-emerald-700 flex items-center gap-1 font-medium"><Check size={11} /> Copied</span> : <span className="flex items-center gap-1"><Copy size={11} /> Copy ID</span>}
                </button>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-aura-gold block">Atelier Order Status</span>
              <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-sans mt-0.5 ${statusCfg.color}`}>
                {order.status}
              </span>
            </div>
          </div>
          {/* Items */}
          <div>
            <p className="font-semibold uppercase tracking-[0.15em] text-[10px] text-aura-gold mb-2">Order Items</p>
            <div className="space-y-2">
              {order.items?.map((it, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-aura-dark">{it.name}</span>
                    <span className="text-aura-muted ml-1">({it.selectedColor || 'Std'}, Size {it.selectedSize || 'Std'}) ×{it.quantity}</span>
                  </div>
                  <span className="font-mono font-semibold">Rs. {(Number(it.price) * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold uppercase tracking-[0.15em] text-[10px] text-aura-gold mb-1">Delivering To</p>
              <p className="font-medium text-aura-dark">{order.client?.fullName}</p>
              <p className="text-aura-muted">{order.client?.address}, {order.client?.city}</p>
              <p className="text-aura-muted font-mono mt-0.5">{order.client?.phone}</p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-[0.15em] text-[10px] text-aura-gold mb-1">Payment</p>
              <p className="font-medium text-aura-dark capitalize">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / Bank'}
              </p>
              {order.couponCode && <p className="text-emerald-700 mt-1">Coupon: {order.couponCode}</p>}
              <p className="font-semibold text-aura-dark mt-1 font-mono">Total: Rs. {Number(order.total).toLocaleString()}</p>
            </div>
          </div>

          {order.giftNote && (
            <div className="p-3.5 rounded-xl bg-aura-gold/10 border border-aura-gold/25">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-aura-gold block mb-1">
                Handwritten Wax-Sealed Gift Note
              </span>
              <p className="italic text-aura-dark font-serif text-sm">"{order.giftNote}"</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-aura-dark/10">
            <button
              onClick={() => window.print()}
              className="btn-outline py-2 px-4 text-xs flex items-center gap-1.5"
            >
              <Printer size={13} />
              <span>Print Archival Slip</span>
            </button>
            <Link to="/returns" className="text-aura-muted hover:text-aura-dark underline flex items-center gap-1">
              <RotateCcw size={11} /> Return / Exchange Policy
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!user) return
    try {
      const all = JSON.parse(localStorage.getItem('thrift-aura-orders') || '[]')
      const mine = all.filter(
        (o) => o.client?.email?.toLowerCase() === user.email?.toLowerCase()
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrders(mine)
    } catch {
      setOrders([])
    }
  }, [user])

  if (!user) {
    return (
      <main className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-aura-gold/10 border border-aura-gold/30 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={28} className="text-aura-gold" />
          </div>
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-aura-gold font-semibold block mb-2">My Account</span>
          <h2 className="font-serif text-3xl text-aura-dark mb-3">Sign In to View Your Orders</h2>
          <p className="font-sans text-sm text-aura-dark/60 leading-relaxed mb-8">
            Access your complete order history, tracking details, and archival acquisition receipts.
          </p>
          <Link to="/auth?redirect=/my-orders" className="btn-primary inline-flex items-center gap-2">
            <LogIn size={15} /> <span>Sign In with Gmail</span>
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-aura-gold mb-3">
            <Sparkles size={13} />
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] font-semibold text-aura-dark/60">My Account</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-aura-dark mb-3">My Archival Orders</h1>
          <div className="flex items-center gap-2 font-sans text-xs text-aura-muted">
            <ShieldCheck size={14} className="text-aura-gold" />
            <span className="font-mono">{user.email}</span>
            <span className="text-aura-gold font-semibold">· Verified</span>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-aura-muted" />
            </div>
            <h3 className="font-serif text-2xl text-aura-dark mb-2">No Orders Yet</h3>
            <p className="font-sans text-sm text-aura-dark/60 mb-8 max-w-xs mx-auto">
              Your archival acquisition history will appear here once you place your first order.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              <span>Browse Archival Collection</span><ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <p className="font-sans text-xs text-aura-muted mb-6">
              {orders.length} order{orders.length !== 1 ? 's' : ''} in your acquisition history
            </p>
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </main>
  )
}
