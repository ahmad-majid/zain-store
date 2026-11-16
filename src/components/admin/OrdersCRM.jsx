import { useState, useEffect } from 'react'
import {
  ShoppingBag, Truck, Mail, Search, Printer, Copy, Check, Clock,
  CheckCircle2, AlertCircle, X, ChevronRight, Phone, MapPin, User,
  Calendar, Tag, ExternalLink, RefreshCw, Send, Trash2, ArrowUpRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendOrderStatusUpdateEmail } from '../../lib/emailService'

const OWNER_EMAIL = 'u06626982@gmail.com'

const COURIER_PRESETS = [
  'TCS Express',
  'Leopard Courier',
  'DHL Express',
  'M&P Logistics',
  'Trax Logistics',
  'Call Courier',
  'PostEx',
]

export default function OrdersCRM({ onNotify }) {
  const [orders, setOrders] = useState([])
  const [orderFilter, setOrderFilter] = useState('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusModalOrder, setStatusModalOrder] = useState(null)
  const [statusForm, setStatusForm] = useState({
    newStatus: 'Dispatched via Courier',
    courier: 'TCS Express',
    trackingNumber: '',
    notes: '',
  })
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('thrift-aura-orders') || '[]')
      if (stored.length > 0) {
        setOrders(stored)
      } else {
        // Initial sample orders so store owner immediately sees the working CRM pipeline
        const initialSampleOrders = [
          {
            id: 'AUR-89421',
            createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
            items: [
              {
                id: 'sp-01',
                name: 'Archival Tailored Blazer in Oatmeal Linen',
                price: 18500,
                quantity: 1,
                selectedColor: 'Oatmeal Natural',
                selectedSize: 'M',
                images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85'],
              },
            ],
            client: {
              fullName: 'Elena Rostova',
              phone: '+92 300 8472910',
              email: 'u06626982@gmail.com',
              address: 'House 42, Street 11, Sector F-7/2',
              city: 'Islamabad',
              notes: 'Please ring bell and leave with concierge.',
            },
            paymentMethod: 'cod',
            subtotal: 18500,
            discount: 0,
            couponCode: null,
            shipping: 0,
            total: 18500,
            status: 'Pending Atelier Prep',
          },
          {
            id: 'AUR-74193',
            createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
            items: [
              {
                id: 'sp-02',
                name: 'Silk Double-Breasted Trench in Sand',
                price: 24500,
                quantity: 1,
                selectedColor: 'Sand Khaki',
                selectedSize: 'L',
                images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=900&h=1200&fit=crop&q=85'],
              },
            ],
            client: {
              fullName: 'Tariq Mansoor',
              phone: '+92 321 4455667',
              email: 'tariq.mansoor@example.com',
              address: 'Apt 502, Creek Vistas Tower 3',
              city: 'Karachi',
              notes: 'Call before delivery.',
            },
            paymentMethod: 'cod',
            subtotal: 24500,
            discount: 0,
            couponCode: null,
            shipping: 0,
            total: 24500,
            status: 'Dispatched via Courier',
            courier: 'TCS Express',
            trackingNumber: 'TCS-78492019',
            dispatchedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          },
        ]
        localStorage.setItem('thrift-aura-orders', JSON.stringify(initialSampleOrders))
        setOrders(initialSampleOrders)
      }
    } catch (e) {
      console.warn('Failed loading orders:', e)
    }
  }

  useEffect(() => {
    loadOrders()
    window.addEventListener('focus', loadOrders)
    return () => window.removeEventListener('focus', loadOrders)
  }, [])

  // KPI Metrics
  const totalRevenue = orders
    .filter((o) => !o.status?.toLowerCase().includes('cancel'))
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const pendingCount = orders.filter((o) => o.status === 'Pending Atelier Prep').length
  const dispatchedCount = orders.filter((o) => o.status?.includes('Dispatched')).length
  const deliveredCount = orders.filter((o) => o.status?.includes('Delivered')).length
  const cancelledCount = orders.filter((o) => o.status?.includes('Cancel')).length

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    if (orderFilter !== 'all') {
      if (orderFilter === 'pending' && order.status !== 'Pending Atelier Prep') return false
      if (orderFilter === 'dispatched' && !order.status?.includes('Dispatched')) return false
      if (orderFilter === 'delivered' && !order.status?.includes('Delivered')) return false
      if (orderFilter === 'cancelled' && !order.status?.includes('Cancel')) return false
    }

    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim()
      const matchId = order.id?.toLowerCase().includes(q)
      const matchClient = order.client?.fullName?.toLowerCase().includes(q)
      const matchPhone = order.client?.phone?.toLowerCase().includes(q)
      const matchEmail = order.client?.email?.toLowerCase().includes(q)
      const matchCity = order.client?.city?.toLowerCase().includes(q)
      const matchItem = order.items?.some((it) => it.name?.toLowerCase().includes(q))
      return matchId || matchClient || matchPhone || matchEmail || matchCity || matchItem
    }

    return true
  })

  // Open status progression modal
  const openStatusModal = (order) => {
    setStatusModalOrder(order)
    const nextStatus =
      order.status === 'Pending Atelier Prep'
        ? 'Dispatched via Courier'
        : order.status === 'Dispatched via Courier'
        ? 'Delivered'
        : order.status

    setStatusForm({
      newStatus: nextStatus,
      courier: order.courier || 'TCS Express',
      trackingNumber: order.trackingNumber || `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      notes: order.fulfillmentNotes || 'Archival tissue wrapping inspected and handed to courier.',
    })
  }

  // Submit status advance & trigger real-time Gmail dispatch
  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault()
    if (!statusModalOrder) return
    setIsUpdatingStatus(true)

    const updated = orders.map((o) => {
      if (o.id === statusModalOrder.id) {
        return {
          ...o,
          status: statusForm.newStatus,
          courier: statusForm.courier,
          trackingNumber: statusForm.trackingNumber || o.trackingNumber,
          fulfillmentNotes: statusForm.notes,
          dispatchedAt: statusForm.newStatus.includes('Dispatched') ? new Date().toISOString() : o.dispatchedAt,
          deliveredAt: statusForm.newStatus.includes('Delivered') ? new Date().toISOString() : o.deliveredAt,
        }
      }
      return o
    })

    try {
      localStorage.setItem('thrift-aura-orders', JSON.stringify(updated))
      setOrders(updated)
    } catch (err) {
      console.error('Failed to save updated orders', err)
    }

    const updatedOrder = updated.find((o) => o.id === statusModalOrder.id)

    // Trigger Real-Time Gmail Dispatch
    const trackingPayload = {
      courier: statusForm.courier,
      trackingNumber: statusForm.trackingNumber,
      notes: statusForm.notes,
    }

    const emailResult = await sendOrderStatusUpdateEmail(updatedOrder, statusForm.newStatus, trackingPayload)

    setIsUpdatingStatus(false)
    setStatusModalOrder(null)

    const clientEmail = updatedOrder.client?.email
    if (onNotify) {
      if (emailResult.success) {
        onNotify(`✓ Order #${updatedOrder.id} updated to "${statusForm.newStatus}" & Gmail notification delivered to ${clientEmail || OWNER_EMAIL}!`)
      } else {
        onNotify(`Order #${updatedOrder.id} status updated to "${statusForm.newStatus}"!`)
      }
    }
  }

  const handleDeleteOrder = (id) => {
    if (!confirm(`Are you sure you want to permanently delete order #${id} from the CRM?`)) return
    const updated = orders.filter((o) => o.id !== id)
    localStorage.setItem('thrift-aura-orders', JSON.stringify(updated))
    setOrders(updated)
    if (onNotify) onNotify(`Order #${id} deleted from CRM.`)
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* ─── Top Section: Header & Live Metrics ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-aura-gold font-bold">
              Real-Time Order Fulfillment
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-aura-dark font-normal">
            Orders, Courier Dispatch &amp; <span className="italic text-aura-warm">Client CRM</span>
          </h2>
          <p className="font-sans text-xs text-aura-muted mt-0.5">
            Manage archival acquisitions, advance courier dispatch with tracking waybills, and trigger automated Gmail alerts.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="btn-outline py-2.5 px-4 text-xs inline-flex items-center gap-2 self-start lg:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* ─── Analytics Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="glass-card rounded-2xl p-5 border border-aura-dark/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-aura-muted text-xs font-sans uppercase tracking-wider mb-2">
            <span>Gross Acquisition Value</span>
            <div className="w-8 h-8 rounded-full bg-aura-gold/15 text-aura-dark flex items-center justify-center">
              <Tag size={15} />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-aura-dark">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <p className="font-sans text-[11px] text-aura-muted mt-1">
            Across {orders.length} lifetime client orders
          </p>
        </div>

        {/* Pending Atelier Prep */}
        <div className="glass-card rounded-2xl p-5 border border-aura-dark/10 relative overflow-hidden bg-amber-500/5">
          <div className="flex items-center justify-between text-amber-800 text-xs font-sans uppercase tracking-wider mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
              Pending Atelier Prep
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-900 flex items-center justify-center">
              <Clock size={15} />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-amber-950">
            {pendingCount}
          </div>
          <p className="font-sans text-[11px] text-amber-800/80 mt-1">
            Requires packaging &amp; courier handover
          </p>
        </div>

        {/* Dispatched via Courier */}
        <div className="glass-card rounded-2xl p-5 border border-aura-dark/10 relative overflow-hidden bg-blue-500/5">
          <div className="flex items-center justify-between text-blue-800 text-xs font-sans uppercase tracking-wider mb-2">
            <span className="font-semibold">Dispatched / In Transit</span>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-900 flex items-center justify-center">
              <Truck size={15} />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-blue-950">
            {dispatchedCount}
          </div>
          <p className="font-sans text-[11px] text-blue-800/80 mt-1">
            Active parcels with courier waybills
          </p>
        </div>

        {/* Delivered & Authenticated */}
        <div className="glass-card rounded-2xl p-5 border border-aura-dark/10 relative overflow-hidden bg-emerald-500/5">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-sans uppercase tracking-wider mb-2">
            <span className="font-semibold">Delivered to Clients</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-900 flex items-center justify-center">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-950">
            {deliveredCount}
          </div>
          <p className="font-sans text-[11px] text-emerald-800/80 mt-1">
            Successfully delivered acquisitions
          </p>
        </div>
      </div>

      {/* ─── Search & Status Filter Row ─── */}
      <div className="glass-card rounded-2xl p-4 border border-aura-dark/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scroll-row">
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'pending', label: 'Pending Atelier', count: pendingCount, highlight: pendingCount > 0 },
            { id: 'dispatched', label: 'Dispatched', count: dispatchedCount },
            { id: 'delivered', label: 'Delivered', count: deliveredCount },
            { id: 'cancelled', label: 'Cancelled', count: cancelledCount },
          ].map((tab) => {
            const isActive = orderFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setOrderFilter(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans tracking-wider uppercase font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-aura-dark text-cream-100 shadow-sm'
                    : 'bg-cream-100/60 text-aura-dark/70 hover:text-aura-dark hover:bg-cream-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive
                      ? 'bg-cream-100/20 text-cream-50'
                      : tab.highlight
                      ? 'bg-amber-500 text-cream-100'
                      : 'bg-aura-dark/10 text-aura-dark'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[280px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search Order ID, Client, Phone, City..."
            className="w-full pl-9 pr-4 py-2 bg-cream-50 border border-aura-dark/15 rounded-xl text-xs font-sans placeholder-aura-muted focus:outline-none focus:border-aura-gold transition-colors"
          />
          {orderSearch && (
            <button
              onClick={() => setOrderSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-dark"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ─── Orders Table ─── */}
      <div className="glass-card rounded-2xl border border-aura-dark/10 overflow-hidden shadow-md">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-aura-dark/5 text-aura-muted flex items-center justify-center mx-auto">
              <ShoppingBag size={24} />
            </div>
            <h3 className="font-serif text-lg text-aura-dark">No Client Orders Found</h3>
            <p className="font-sans text-xs text-aura-muted max-w-md mx-auto">
              {orderSearch
                ? `No orders match your search "${orderSearch}". Try a different keyword or clear your filter.`
                : 'There are currently no orders in this fulfillment category.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-cream-200/80 border-b border-aura-dark/10 tracking-[0.2em] uppercase text-aura-muted text-[10px]">
                <tr>
                  <th className="py-4 px-5">Order Identifier</th>
                  <th className="py-4 px-5">Client &amp; Destination</th>
                  <th className="py-4 px-5">Pieces Ordered</th>
                  <th className="py-4 px-5">Total &amp; Payment</th>
                  <th className="py-4 px-5">Fulfillment Status</th>
                  <th className="py-4 px-5 text-right">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-dark/5">
                {filteredOrders.map((order) => {
                  const isPending = order.status === 'Pending Atelier Prep'
                  const isDispatched = order.status?.includes('Dispatched')
                  const isDelivered = order.status?.includes('Delivered')
                  const isCancelled = order.status?.includes('Cancel')

                  return (
                    <tr key={order.id} className="hover:bg-cream-200/40 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-aura-dark tracking-tight">
                            {order.id}
                          </span>
                          <button
                            onClick={() => copyToClipboard(order.id, order.id)}
                            className="p-1 rounded hover:bg-cream-300 text-aura-muted hover:text-aura-dark transition-colors"
                            title="Copy Order ID"
                          >
                            {copiedId === order.id ? (
                              <Check size={13} className="text-emerald-700" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                        <span className="font-sans text-[11px] text-aura-muted block mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Client Details */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-aura-dark text-sm">
                          {order.client?.fullName || 'Collector'}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-aura-muted">
                          <span className="font-mono text-aura-dark/80">{order.client?.phone}</span>
                          <span>&bull;</span>
                          <span>{order.client?.city}</span>
                        </div>
                        <div className="text-[11px] text-aura-muted/80 truncate max-w-[200px]" title={order.client?.address}>
                          {order.client?.address}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-3 overflow-hidden">
                            {order.items?.map((it, idx) => {
                              const img =
                                it.colors?.[0]?.images?.[0] ||
                                it.images?.[0] ||
                                'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop'
                              return (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={it.name}
                                  title={`${it.name} (${it.selectedColor || 'Std'}, ${it.selectedSize || 'Std'}) x${it.quantity}`}
                                  className="inline-block h-10 w-9 rounded-md object-cover ring-2 ring-cream-100 border border-aura-dark/10 shadow-sm"
                                />
                              )
                            })}
                          </div>
                          <div className="text-[11px]">
                            <span className="font-bold text-aura-dark block">
                              {order.items?.length} {order.items?.length === 1 ? 'Piece' : 'Pieces'}
                            </span>
                            <span className="text-aura-muted truncate max-w-[150px] block">
                              {order.items?.[0]?.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-4 px-5">
                        <div className="font-mono text-sm font-bold text-aura-dark">
                          Rs. {Number(order.total || 0).toLocaleString()}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              order.paymentMethod === 'cod'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Electronic'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${
                              isPending
                                ? 'bg-amber-500/15 text-amber-900 border-amber-500/30'
                                : isDispatched
                                ? 'bg-blue-500/15 text-blue-900 border-blue-500/30'
                                : isDelivered
                                ? 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30'
                                : 'bg-stone-200 text-stone-800 border-stone-300'
                            }`}
                          >
                            {isPending && <Clock size={12} className="text-amber-700" />}
                            {isDispatched && <Truck size={12} className="text-blue-700" />}
                            {isDelivered && <CheckCircle2 size={12} className="text-emerald-700" />}
                            {order.status}
                          </span>

                          {/* Courier tracking pill */}
                          {order.trackingNumber && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-aura-muted font-mono">
                              <span className="font-semibold text-aura-dark">{order.courier}:</span>
                              <span>{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openStatusModal(order)}
                            className="px-3 py-1.5 rounded-lg bg-aura-dark text-cream-100 text-[11px] font-semibold uppercase tracking-wider hover:bg-aura-gold hover:text-aura-dark transition-colors inline-flex items-center gap-1 shadow-sm"
                            title="Advance order status & trigger Gmail notifications"
                          >
                            <Send size={12} />
                            <span>Advance Status</span>
                          </button>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-cream-300 text-aura-dark/70 hover:text-aura-dark transition-colors border border-aura-dark/15"
                            title="Inspect Order Details & Slip"
                          >
                            <Printer size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-700 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL 1: Advance Order Status & Send Gmail Notification ─── */}
      <AnimatePresence>
        {statusModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aura-dark/65 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-cream-50 rounded-3xl border border-aura-gold/40 shadow-2xl w-full max-w-xl overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-aura-dark/10 bg-white/70">
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-aura-gold font-bold block">
                    Fulfillment Pipeline
                  </span>
                  <h3 className="font-serif text-xl text-aura-dark">
                    Advance Status &bull; Order #{statusModalOrder.id}
                  </h3>
                </div>
                <button
                  onClick={() => setStatusModalOrder(null)}
                  className="p-1.5 rounded-lg hover:bg-cream-200 text-aura-muted hover:text-aura-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleUpdateOrderStatus} className="p-6 space-y-5 text-xs font-sans">
                {/* Order Summary Recap */}
                <div className="p-3.5 rounded-xl bg-cream-100 border border-aura-dark/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-aura-muted uppercase tracking-wider block">Recipient Client</span>
                    <span className="font-bold text-aura-dark text-sm">{statusModalOrder.client?.fullName}</span>
                    <span className="text-aura-muted block text-[11px]">{statusModalOrder.client?.city} &bull; {statusModalOrder.client?.phone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-aura-muted uppercase tracking-wider block">Current Status</span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-aura-gold/20 text-aura-dark font-bold text-[10px] uppercase border border-aura-gold/30">
                      {statusModalOrder.status}
                    </span>
                  </div>
                </div>

                {/* Target Status Dropdown */}
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                    New Fulfillment Stage *
                  </label>
                  <select
                    value={statusForm.newStatus}
                    onChange={(e) => setStatusForm((p) => ({ ...p, newStatus: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold font-semibold text-aura-dark"
                  >
                    <option value="Pending Atelier Prep">Pending Atelier Prep (In Workshop)</option>
                    <option value="Dispatched via Courier">Dispatched via Courier (In Transit with Rider)</option>
                    <option value="Delivered">Delivered &amp; Authenticated (Client Received)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Courier Fields (Active when Dispatched is chosen) */}
                {statusForm.newStatus === 'Dispatched via Courier' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-900 font-bold uppercase tracking-wider text-[11px]">
                      <Truck size={14} className="text-blue-700" />
                      <span>Courier Partner &amp; Waybill Consignment</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                          Courier Partner
                        </label>
                        <select
                          value={statusForm.courier}
                          onChange={(e) => setStatusForm((p) => ({ ...p, courier: e.target.value }))}
                          className="w-full px-3.5 py-2 bg-white border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold"
                        >
                          {COURIER_PRESETS.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                          Tracking / Waybill Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={statusForm.trackingNumber}
                          onChange={(e) => setStatusForm((p) => ({ ...p, trackingNumber: e.target.value }))}
                          placeholder="e.g. TCS-8492019"
                          className="w-full px-3.5 py-2 bg-white border border-aura-dark/20 rounded-xl font-mono focus:outline-none focus:border-aura-gold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Concierge Notes */}
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                    Atelier Concierge Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={statusForm.notes}
                    onChange={(e) => setStatusForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="e.g. Steam sanitization complete, packaged in archival cedar box."
                    className="w-full px-3.5 py-2 bg-white border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold"
                  />
                </div>

                {/* ─── Real-Time Gmail Dispatch Notice ─── */}
                <div className="p-4 rounded-2xl bg-emerald-950/5 border border-emerald-600/25 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold uppercase tracking-wider text-[11px]">
                    <Mail size={14} className="text-emerald-700" />
                    <span>Real-Time Gmail Dispatch Active</span>
                  </div>
                  <ul className="text-[11px] text-aura-dark/80 space-y-1 list-disc list-inside">
                    <li>
                      Client notification will be emailed to:{' '}
                      <strong className="text-aura-dark font-mono">{statusModalOrder.client?.email || 'client'}</strong>
                    </li>
                    <li>
                      Store owner confirmation copy will be emailed to:{' '}
                      <strong className="text-aura-dark font-mono">{OWNER_EMAIL}</strong>
                    </li>
                  </ul>
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-aura-dark/10">
                  <button
                    type="button"
                    onClick={() => setStatusModalOrder(null)}
                    className="btn-outline py-2.5 px-5 text-xs"
                    disabled={isUpdatingStatus}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingStatus}
                    className="py-2.5 px-6 rounded-xl bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 text-xs font-sans tracking-wider uppercase font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Sending Gmail Alerts...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Update Status &amp; Dispatch Gmail</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 2: Order Details & Printable Archival Slip ─── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-aura-dark/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-cream-50 rounded-3xl border border-aura-gold/40 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col my-auto overflow-hidden"
            >
              {/* Slip Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-aura-dark/10 bg-white/70">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-serif text-xl text-aura-dark">Archival Acquisition Slip</h3>
                    <p className="font-sans text-[10px] text-aura-muted uppercase tracking-wider">
                      Thrift Aura Atelier &bull; Order #{selectedOrder.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg hover:bg-cream-200 text-aura-muted hover:text-aura-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Slip Body */}
              <div className="overflow-y-auto p-6 space-y-6 text-xs font-sans">
                {/* Client & Dispatch Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-aura-dark/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-aura-gold font-bold block mb-1">
                      Client Recipient:
                    </span>
                    <p className="font-bold text-aura-dark text-sm">{selectedOrder.client?.fullName}</p>
                    <p className="text-aura-dark/80 mt-0.5">{selectedOrder.client?.address}</p>
                    <p className="text-aura-dark/80">{selectedOrder.client?.city}</p>
                    <p className="text-aura-muted font-mono mt-1">{selectedOrder.client?.phone}</p>
                    <p className="text-aura-muted font-mono">{selectedOrder.client?.email}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-aura-gold font-bold block mb-1">
                      Fulfillment Particulars:
                    </span>
                    <p className="font-bold text-aura-dark">
                      Status: <span className="text-aura-gold">{selectedOrder.status}</span>
                    </p>
                    <p className="text-aura-dark/80 mt-1 capitalize">
                      Payment Mode: {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Courier)' : 'Electronic'}
                    </p>
                    {selectedOrder.trackingNumber && (
                      <p className="text-aura-dark/80 mt-1">
                        Courier: <strong>{selectedOrder.courier}</strong> &bull; Tracking: <span className="font-mono">{selectedOrder.trackingNumber}</span>
                      </p>
                    )}
                    <p className="text-aura-muted mt-1 text-[11px]">
                      Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-aura-dark/10 text-aura-muted text-[10px] uppercase tracking-wider font-semibold">
                        <th className="pb-2.5">Piece</th>
                        <th className="pb-2.5">Color &amp; Size</th>
                        <th className="pb-2.5 text-center">Qty</th>
                        <th className="pb-2.5 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-aura-dark/8">
                      {selectedOrder.items?.map((it, idx) => {
                        const img =
                          it.colors?.[0]?.images?.[0] ||
                          it.images?.[0] ||
                          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop'
                        return (
                          <tr key={idx} className="py-2.5">
                            <td className="py-2.5 pr-3">
                              <div className="flex items-center gap-2.5">
                                <img src={img} alt="" className="w-9 h-11 rounded object-cover border border-aura-dark/10" />
                                <span className="font-serif font-bold text-aura-dark text-xs">{it.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 text-aura-dark/80">
                              {it.selectedColor || 'Standard'} &bull; Size {it.selectedSize || 'Std'}
                            </td>
                            <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                            <td className="py-2.5 text-right font-bold text-aura-dark font-mono">
                              Rs. {(Number(it.price) * it.quantity).toLocaleString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="pt-3 border-t border-aura-dark/10 flex flex-col items-end space-y-1 text-xs font-sans">
                  <div className="flex justify-between w-60 text-aura-dark/70">
                    <span>Subtotal:</span>
                    <span className="font-mono">Rs. {Number(selectedOrder.subtotal || 0).toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between w-60 text-emerald-700 font-semibold">
                      <span>Discount ({selectedOrder.couponCode || 'Promo'}):</span>
                      <span className="font-mono">- Rs. {Number(selectedOrder.discount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between w-60 text-aura-dark/70">
                    <span>Courier Transit:</span>
                    <span className="font-mono">
                      {selectedOrder.shipping === 0 ? 'Complimentary' : `Rs. ${selectedOrder.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between w-60 pt-2 border-t border-aura-dark/10 text-base font-bold text-aura-dark">
                    <span>Grand Total:</span>
                    <span className="font-mono text-aura-gold">Rs. {Number(selectedOrder.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Slip Footer Actions */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-aura-dark/10 bg-white/70">
                <button
                  onClick={() => window.print()}
                  className="btn-outline py-2 px-4 text-xs inline-flex items-center gap-2"
                >
                  <Printer size={13} />
                  <span>Print Slip</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const o = selectedOrder
                      setSelectedOrder(null)
                      openStatusModal(o)
                    }}
                    className="py-2 px-4 rounded-xl bg-aura-dark text-cream-100 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-aura-gold hover:text-aura-dark transition-colors inline-flex items-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>Advance Status</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="py-2 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-sans font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
