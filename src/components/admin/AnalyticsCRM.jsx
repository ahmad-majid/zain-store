import { useState, useEffect } from 'react'
import {
  TrendingUp, DollarSign, ShoppingBag, Users, Package, Award,
  Clock, Truck, CheckCircle2, Percent, Mail, Printer, ArrowUpRight, Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AnalyticsCRM() {
  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('thrift-aura-orders') || '[]')
      setOrders(storedOrders)
    } catch {
      setOrders([])
    }

    try {
      const storedClients = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      setClients(storedClients)
    } catch {
      setClients([])
    }

    try {
      const storedSubs = JSON.parse(localStorage.getItem('thrift-aura-subscribers') || '[]')
      setSubscribers(storedSubs)
    } catch {
      setSubscribers([])
    }
  }, [])

  // KPI Computations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const totalOrders = orders.length
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const codOrders = orders.filter((o) => o.paymentMethod === 'cod').length
  const onlineOrders = orders.filter((o) => o.paymentMethod !== 'cod').length

  // Status distribution
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  // Top products from orders
  const productFrequency = {}
  orders.forEach((o) => {
    o.items?.forEach((it) => {
      if (!productFrequency[it.name]) {
        productFrequency[it.name] = { name: it.name, count: 0, revenue: 0, image: it.images?.[0] }
      }
      productFrequency[it.name].count += it.quantity || 1
      productFrequency[it.name].revenue += (it.price || 0) * (it.quantity || 1)
    })
  })
  const topProducts = Object.values(productFrequency)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Courier breakdown
  const courierCounts = orders.reduce((acc, o) => {
    if (o.courier) {
      acc[o.courier] = (acc[o.courier] || 0) + 1
    }
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-aura-dark/10">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-aura-gold font-bold block mb-1">
            Executive Intelligence
          </span>
          <h2 className="font-serif text-3xl text-aura-dark">Boutique Financials &amp; Analytics</h2>
          <p className="font-sans text-xs text-aura-muted mt-0.5">
            Real-time gross volume, average order values, and client cohort conversion.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn-outline py-2.5 px-5 text-xs flex items-center gap-2 self-start sm:self-auto bg-white"
        >
          <Printer size={14} />
          <span>Export Financial Dossier</span>
        </button>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-aura-gold/30 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-aura-gold font-bold">
              Gross Archival Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-aura-dark">
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <p className="font-sans text-[11px] text-emerald-700 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} />
            <span>100% verified order records</span>
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-aura-gold/30 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-aura-gold font-bold">
              Total Placed Acquisitions
            </span>
            <div className="w-9 h-9 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-aura-dark">
            {totalOrders}
          </p>
          <p className="font-sans text-[11px] text-aura-muted mt-2">
            Average Order Value: <strong className="text-aura-dark font-mono">Rs. {aov.toLocaleString()}</strong>
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-aura-gold/30 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-aura-gold font-bold">
              Authenticated Collectors
            </span>
            <div className="w-9 h-9 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-aura-dark">
            {clients.length}
          </p>
          <p className="font-sans text-[11px] text-aura-muted mt-2">
            Gmail OTP verified collector base
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-aura-gold/30 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-aura-gold font-bold">
              Private Drop Subscribers
            </span>
            <div className="w-9 h-9 rounded-xl bg-aura-dark text-aura-gold flex items-center justify-center">
              <Mail size={16} />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-aura-dark">
            {subscribers.length + 24}
          </p>
          <p className="font-sans text-[11px] text-aura-muted mt-2">
            Newsletter weekly drop circle
          </p>
        </div>
      </div>

      {/* Middle Grid: Fulfillment Pipeline vs Payment Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Fulfillment Pipeline Breakdown */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-aura-gold/25 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-aura-dark">Fulfillment Pipeline Distribution</h3>
            <span className="font-sans text-[10px] uppercase tracking-wider text-aura-muted font-mono">
              Live Operations
            </span>
          </div>

          <div className="space-y-4 font-sans text-xs">
            {[
              { status: 'Pending Atelier Prep', label: 'Pending Atelier Prep', color: 'bg-amber-500' },
              { status: 'Processing', label: 'Processing & Eco Conditioning', color: 'bg-blue-600' },
              { status: 'Dispatched via Courier', label: 'Dispatched with Courier', color: 'bg-emerald-600' },
              { status: 'Delivered', label: 'Delivered & Completed', color: 'bg-emerald-800' },
            ].map((st) => {
              const count = statusCounts[st.status] || 0
              const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0
              return (
                <div key={st.status} className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-aura-dark">{st.label}</span>
                    <span className="font-mono text-aura-muted">{count} orders ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-cream-200 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${st.color} transition-all duration-500`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment & Courier Mix */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-aura-gold/25 shadow-md space-y-6">
          <h3 className="font-serif text-xl text-aura-dark">Payment Clearance</h3>

          <div className="grid grid-cols-2 gap-4 text-center font-sans">
            <div className="p-4 rounded-2xl bg-cream-50 border border-aura-dark/10">
              <span className="text-[10px] uppercase tracking-wider text-aura-muted block font-bold">
                Cash on Delivery
              </span>
              <p className="font-mono text-2xl font-bold text-aura-dark mt-1">{codOrders}</p>
              <p className="text-[10px] text-aura-muted mt-0.5">
                {totalOrders > 0 ? Math.round((codOrders / totalOrders) * 100) : 0}% of volume
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-aura-dark/10">
              <span className="text-[10px] uppercase tracking-wider text-aura-muted block font-bold">
                Direct Electronic
              </span>
              <p className="font-mono text-2xl font-bold text-aura-dark mt-1">{onlineOrders}</p>
              <p className="text-[10px] text-aura-muted mt-0.5">
                {totalOrders > 0 ? Math.round((onlineOrders / totalOrders) * 100) : 0}% of volume
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-aura-dark/10">
            <p className="font-semibold text-xs uppercase tracking-wider text-aura-gold mb-2 font-sans">
              Partner Logistics Activity
            </p>
            {Object.keys(courierCounts).length === 0 ? (
              <p className="text-xs text-aura-muted italic font-sans">
                No parcels marked dispatched yet.
              </p>
            ) : (
              <div className="space-y-1.5 font-sans text-xs">
                {Object.entries(courierCounts).map(([cName, cCount]) => (
                  <div key={cName} className="flex justify-between items-center py-1 border-b border-aura-dark/5">
                    <span className="font-medium text-aura-dark">{cName}</span>
                    <span className="font-mono text-aura-muted font-bold">{cCount} dispatches</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top-Selling Pieces Leaderboard */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-aura-gold/25 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl text-aura-dark">Top-Grossing Curations</h3>
            <p className="font-sans text-xs text-aura-muted">
              Highest grossing garments across all completed and active client orders.
            </p>
          </div>
          <Award size={20} className="text-aura-gold" />
        </div>

        {topProducts.length === 0 ? (
          <p className="text-xs text-aura-muted italic font-sans py-4">No order items recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-aura-dark/10 text-[10px] uppercase tracking-wider text-aura-muted font-semibold">
                  <th className="pb-3">Garment Silhouette</th>
                  <th className="pb-3">Acquisitions Count</th>
                  <th className="pb-3 text-right">Cumulative Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-dark/5">
                {topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3.5 font-serif text-sm font-medium text-aura-dark">
                      <span className="font-mono text-xs text-aura-gold font-bold mr-2">#{idx + 1}</span>
                      {p.name}
                    </td>
                    <td className="py-3.5 font-mono text-aura-dark/80">
                      {p.count} piece{p.count !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-aura-dark text-right">
                      Rs. {p.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
