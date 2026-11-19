import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package, Truck, CheckCircle2, Clock, ShieldCheck, ArrowRight,
  Printer, MessageCircle, RotateCcw, Copy, Check, Search, Sparkles, MapPin, Mail, Phone
} from 'lucide-react'

const PIPELINE_STEPS = [
  { key: 'placed', label: 'Order Confirmed', desc: 'Acquisition registered in atelier records' },
  { key: 'prep', label: 'Atelier Preparation', desc: 'Museum eco-sanitization & garment grading' },
  { key: 'dispatched', label: 'Courier Handover', desc: 'Sealed in wax garment archival packaging' },
  { key: 'transit', label: 'In Transit', desc: 'Express courier transit with insured custody' },
  { key: 'delivered', label: 'Delivered', desc: 'Handover complete & collector verified' },
]

export default function TrackOrder() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [searchId, setSearchId] = useState(orderId || '')
  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)
  const [hasSearched, setHasSearched] = useState(Boolean(orderId))

  const loadOrder = (idToSearch) => {
    if (!idToSearch) return
    const cleanId = idToSearch.trim().toUpperCase()
    try {
      const all = JSON.parse(localStorage.getItem('thrift-aura-orders') || '[]')
      const found = all.find((o) => o.id?.toUpperCase() === cleanId)
      setOrder(found || null)
    } catch {
      setOrder(null)
    }
    setHasSearched(true)
  }

  useEffect(() => {
    if (orderId) {
      setSearchId(orderId)
      loadOrder(orderId)
    }
  }, [orderId])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchId.trim()) return
    navigate(`/track/${searchId.trim().toUpperCase()}`)
    loadOrder(searchId)
  }

  const copyTracking = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  // Determine current active step index
  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'Pending Atelier Prep':
        return 1
      case 'Processing':
        return 2
      case 'Dispatched via Courier':
        return 3
      case 'Delivered':
        return 5
      case 'Cancelled':
        return -1
      default:
        return 1
    }
  }

  const activeStepIdx = order ? getActiveStepIndex(order.status) : 0

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 mb-3 text-aura-gold">
          <Truck size={14} />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-aura-dark/70 font-semibold">
            Courier Logistics
          </span>
          <Truck size={14} />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-aura-dark mb-4">
          Track Your Archival Piece
        </h1>
        <p className="font-sans text-xs sm:text-sm text-aura-dark/70 leading-relaxed">
          Monitor your insured courier transit and real-time atelier handling.
        </p>
      </div>

      {/* Order Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            required
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g. AUR-89421)"
            className="w-full pl-5 pr-28 py-3.5 bg-white border border-aura-gold/40 rounded-2xl font-mono text-sm uppercase focus:outline-none focus:border-aura-gold shadow-md"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-xl text-xs font-sans uppercase tracking-wider font-semibold transition-all"
          >
            Track
          </button>
        </div>
      </form>

      {/* Order Details Result */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-aura-gold/30 rounded-3xl shadow-2xl overflow-hidden space-y-8 p-6 sm:p-10"
        >
          {/* Top Identifier & Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-aura-dark/10 gap-4">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-aura-gold font-bold block mb-1">
                Archival Consignment
              </span>
              <div className="flex items-center gap-3">
                <h2 className="font-mono text-2xl sm:text-3xl font-bold text-aura-dark">{order.id}</h2>
                <button
                  onClick={() => copyTracking(order.id)}
                  className="p-1.5 rounded-lg hover:bg-cream-100 text-aura-muted hover:text-aura-dark transition-colors"
                  title="Copy Order ID"
                >
                  {copied ? <Check size={16} className="text-emerald-700" /> : <Copy size={16} />}
                </button>
              </div>
              <p className="font-sans text-xs text-aura-muted mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-sans uppercase font-bold tracking-wider bg-aura-dark text-cream-100 shadow-sm">
                Status: {order.status}
              </span>
              {order.courier && (
                <span className="text-[11px] font-sans text-aura-dark/80 font-medium">
                  Carrier: <strong className="text-aura-gold">{order.courier}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Real-time Courier Waybill Card (if dispatched) */}
          {order.trackingNumber && (
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                  <Truck size={22} />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-blue-950 font-bold">
                    Courier Partner: {order.courier || 'TCS Express'}
                  </p>
                  <p className="font-mono text-base font-bold text-blue-950 mt-0.5">
                    Waybill #{order.trackingNumber}
                  </p>
                  <p className="font-sans text-xs text-blue-900/70">
                    Insured express transit active
                  </p>
                </div>
              </div>

              <button
                onClick={() => copyTracking(order.trackingNumber)}
                className="btn-outline py-2 px-4 text-xs bg-white self-start sm:self-auto flex items-center gap-1.5"
              >
                <Copy size={13} />
                <span>{copied ? 'Copied Waybill' : 'Copy Tracking #'}</span>
              </button>
            </div>
          )}

          {/* Visual Progress Timeline */}
          <div className="py-6">
            <h3 className="font-serif text-xl text-aura-dark mb-6">Fulfillment Progress</h3>
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-aura-dark/15">
              {PIPELINE_STEPS.map((step, idx) => {
                const isPassed = activeStepIdx >= idx + 1
                const isCurrent = activeStepIdx === idx + 1
                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                        isPassed
                          ? 'bg-aura-dark border-aura-dark text-cream-100 shadow-sm'
                          : 'bg-white border-aura-dark/30 text-aura-dark/40'
                      } ${isCurrent ? 'ring-4 ring-aura-gold/30 scale-110' : ''}`}
                    >
                      {isPassed ? <Check size={12} /> : idx + 1}
                    </div>

                    <div>
                      <h4 className={`font-serif text-base leading-none ${isPassed ? 'text-aura-dark font-bold' : 'text-aura-dark/50'}`}>
                        {step.label}
                      </h4>
                      <p className="font-sans text-xs text-aura-muted mt-1">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Handwritten Gift Note (if present) */}
          {order.giftNote && (
            <div className="p-5 rounded-2xl bg-aura-gold/10 border border-aura-gold/30 space-y-1">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-aura-gold font-bold flex items-center gap-1.5">
                <Sparkles size={12} /> Handwritten Atelier Gift Note
              </span>
              <p className="font-serif text-base text-aura-dark italic pt-1">
                "{order.giftNote}"
              </p>
            </div>
          )}

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-cream-50 border border-aura-dark/10 text-xs font-sans">
            <div>
              <p className="font-semibold uppercase tracking-wider text-[10px] text-aura-gold mb-1">
                Recipient &amp; Destination
              </p>
              <p className="font-bold text-aura-dark text-sm">{order.client?.fullName}</p>
              <p className="text-aura-dark/80 mt-0.5">{order.client?.address}</p>
              <p className="text-aura-dark/80">{order.client?.city}</p>
              <p className="text-aura-muted font-mono mt-1">{order.client?.phone}</p>
              <p className="text-aura-muted font-mono">{order.client?.email}</p>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wider text-[10px] text-aura-gold mb-1">
                Financial Summary
              </p>
              <p className="font-bold text-aura-dark capitalize">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Electronic Payment'}
              </p>
              {order.couponCode && (
                <p className="text-emerald-700 mt-1">Coupon Savings: {order.couponCode}</p>
              )}
              <p className="text-base font-bold text-aura-dark font-mono mt-2">
                Total: Rs. {Number(order.total).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-aura-dark/10">
            <button
              onClick={handlePrint}
              className="btn-outline py-2.5 px-5 text-xs flex items-center gap-2"
            >
              <Printer size={14} />
              <span>Print Archival Slip</span>
            </button>

            <div className="flex items-center gap-3">
              <Link
                to="/returns"
                className="text-xs font-sans text-aura-muted hover:text-aura-dark underline flex items-center gap-1"
              >
                <RotateCcw size={13} />
                <span>Return / Exchange</span>
              </Link>
              <Link to="/shop" className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2">
                <span>Continue Shopping</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Not Found state */}
      {hasSearched && !order && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-3xl border border-aura-dark/10 p-8 max-w-md mx-auto"
        >
          <div className="w-14 h-14 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4 text-aura-muted">
            <Search size={24} />
          </div>
          <h3 className="font-serif text-2xl text-aura-dark mb-2">Order Not Located</h3>
          <p className="font-sans text-xs text-aura-muted mb-6">
            We couldn't locate order <strong>{searchId}</strong> in our archival records. Please re-check your order number or consult your confirmation email.
          </p>
          <Link to="/my-orders" className="btn-primary inline-flex items-center gap-2 text-xs">
            <span>View My Saved Orders</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}
    </main>
  )
}
