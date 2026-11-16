import { useState, useEffect } from 'react'
import {
  Users, Mail, ShieldCheck, Search, Phone, MapPin, Calendar,
  Tag, ShoppingBag, ArrowUpRight, Check, X, RefreshCw, Trash2, Send
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClientsCRM({ onSelectClientForPromo, onNotify }) {
  const [clients, setClients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState('all') // all | buyers | high_spenders
  const [selectedClient, setSelectedClient] = useState(null)
  const [copiedEmail, setCopiedEmail] = useState(null)

  const loadClients = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      if (stored.length > 0) {
        setClients(stored)
      } else {
        // Seed default initial client records so CRM is immediately demonstrated
        const sampleClients = [
          {
            id: 'cl-89421',
            fullName: 'Elena Rostova',
            email: 'u06626982@gmail.com',
            phone: '+92 300 8472910',
            address: 'House 42, Street 11, Sector F-7/2',
            city: 'Islamabad',
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            registeredAt: new Date(Date.now() - 3600000 * 72).toISOString(),
            ordersCount: 2,
            totalSpend: 37000,
            lastOrderDate: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
          {
            id: 'cl-74193',
            fullName: 'Tariq Mansoor',
            email: 'tariq.mansoor@example.com',
            phone: '+92 321 4455667',
            address: 'Apt 502, Creek Vistas Tower 3',
            city: 'Karachi',
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
            registeredAt: new Date(Date.now() - 3600000 * 120).toISOString(),
            ordersCount: 1,
            totalSpend: 24500,
            lastOrderDate: new Date(Date.now() - 3600000 * 28).toISOString(),
          },
          {
            id: 'cl-62104',
            fullName: 'Ayesha Khan',
            email: 'ayesha.k@atelier-mail.com',
            phone: '+92 333 9876543',
            address: 'Villa 18, Block D, DHA Phase 5',
            city: 'Lahore',
            isVerified: true,
            verifiedAt: new Date(Date.now() - 3600000 * 140).toISOString(),
            registeredAt: new Date(Date.now() - 3600000 * 160).toISOString(),
            ordersCount: 3,
            totalSpend: 54000,
            lastOrderDate: new Date(Date.now() - 3600000 * 50).toISOString(),
          },
        ]
        localStorage.setItem('thrift-aura-clients', JSON.stringify(sampleClients))
        setClients(sampleClients)
      }
    } catch (e) {
      console.warn('Failed loading clients', e)
    }
  }

  useEffect(() => {
    loadClients()
    window.addEventListener('focus', loadClients)
    return () => window.removeEventListener('focus', loadClients)
  }, [])

  // Lock background body scroll and bind Escape key whenever modal is open
  useEffect(() => {
    if (selectedClient) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedClient(null)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = 'unset'
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [selectedClient])

  // KPI Calculations
  const totalClients = clients.length
  const totalLifetimeValue = clients.reduce((sum, c) => sum + (Number(c.totalSpend) || 0), 0)
  const totalOrdersPlaced = clients.reduce((sum, c) => sum + (Number(c.ordersCount) || 0), 0)
  const averageSpend = totalClients > 0 ? Math.round(totalLifetimeValue / totalClients) : 0

  // Filtered client list
  const filteredClients = clients.filter((client) => {
    if (filterMode === 'buyers' && (!client.ordersCount || client.ordersCount === 0)) return false
    if (filterMode === 'high_spenders' && (Number(client.totalSpend) || 0) < 25000) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchName = client.fullName?.toLowerCase().includes(q)
      const matchEmail = client.email?.toLowerCase().includes(q)
      const matchPhone = client.phone?.toLowerCase().includes(q)
      const matchCity = client.city?.toLowerCase().includes(q)
      return matchName || matchEmail || matchPhone || matchCity
    }
    return true
  })

  const copyEmail = (email, id) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(id)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  const handleDeleteClient = (id) => {
    if (!confirm('Are you sure you want to remove this client from the registry?')) return
    const updated = clients.filter((c) => c.id !== id)
    localStorage.setItem('thrift-aura-clients', JSON.stringify(updated))
    setClients(updated)
    if (onNotify) onNotify('Client profile removed from registry.')
  }

  return (
    <div className="space-y-8">
      {/* ─── Header & Top Actions ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-aura-gold font-bold">
              Authenticated Client Base
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-aura-dark font-normal">
            Registered Clients &amp; <span className="italic text-aura-warm">Collector Registry</span>
          </h2>
          <p className="font-sans text-xs text-aura-muted mt-0.5">
            View all registered buyers, verified Gmail accounts, order frequencies, and lifetime acquisition value.
          </p>
        </div>

        <button
          onClick={loadClients}
          className="btn-outline py-2.5 px-4 text-xs inline-flex items-center gap-2 self-start lg:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* ─── Metric KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-aura-dark/10">
          <div className="flex items-center justify-between text-aura-muted text-xs font-sans uppercase tracking-wider mb-2">
            <span>Total Registered Collectors</span>
            <div className="w-8 h-8 rounded-full bg-aura-gold/15 text-aura-dark flex items-center justify-center">
              <Users size={15} />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-aura-dark">
            {totalClients}
          </div>
          <p className="font-sans text-[11px] text-emerald-800 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>100% Verified via Gmail OTP</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-aura-dark/10">
          <div className="flex items-center justify-between text-aura-muted text-xs font-sans uppercase tracking-wider mb-2">
            <span>Cumulative Client Spend</span>
            <div className="w-8 h-8 rounded-full bg-aura-gold/15 text-aura-dark flex items-center justify-center">
              <Tag size={15} />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-aura-dark">
            Rs. {totalLifetimeValue.toLocaleString()}
          </div>
          <p className="font-sans text-[11px] text-aura-muted mt-1">
            Across {totalOrdersPlaced} archival acquisitions
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-aura-dark/10">
          <div className="flex items-center justify-between text-aura-muted text-xs font-sans uppercase tracking-wider mb-2">
            <span>Average Value per Client</span>
            <div className="w-8 h-8 rounded-full bg-aura-gold/15 text-aura-dark flex items-center justify-center">
              <ShoppingBag size={15} />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-aura-dark">
            Rs. {averageSpend.toLocaleString()}
          </div>
          <p className="font-sans text-[11px] text-aura-muted mt-1">
            Average collector archival basket
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-aura-dark/10 bg-emerald-500/5">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-sans uppercase tracking-wider mb-2">
            <span className="font-semibold">Reachable via Gmail</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-900 flex items-center justify-center">
              <Mail size={15} />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-950">
            {totalClients} Mails
          </div>
          <p className="font-sans text-[11px] text-emerald-800/80 mt-1">
            Available for instant promotional broadcasts
          </p>
        </div>
      </div>

      {/* ─── Search & Segment Filter Row ─── */}
      <div className="glass-card rounded-2xl p-4 border border-aura-dark/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scroll-row">
          {[
            { id: 'all', label: 'All Clients', count: totalClients },
            { id: 'buyers', label: 'Active Buyers', count: clients.filter((c) => (c.ordersCount || 0) > 0).length },
            { id: 'high_spenders', label: 'High Spenders (25k+)', count: clients.filter((c) => (c.totalSpend || 0) >= 25000).length },
          ].map((tab) => {
            const isActive = filterMode === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setFilterMode(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans tracking-wider uppercase font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-aura-dark text-cream-100 shadow-sm'
                    : 'bg-cream-100/60 text-aura-dark/70 hover:text-aura-dark hover:bg-cream-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-cream-100/20 text-cream-50' : 'bg-aura-dark/10 text-aura-dark'}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative min-w-[280px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Client Name, Gmail, Phone, City..."
            className="w-full pl-9 pr-4 py-2 bg-cream-50 border border-aura-dark/15 rounded-xl text-xs font-sans placeholder-aura-muted focus:outline-none focus:border-aura-gold transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-dark"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ─── Clients Directory Table ─── */}
      <div className="glass-card rounded-2xl border border-aura-dark/10 overflow-hidden shadow-md">
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-aura-dark/5 text-aura-muted flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <h3 className="font-serif text-lg text-aura-dark">No Client Records Found</h3>
            <p className="font-sans text-xs text-aura-muted max-w-md mx-auto">
              {searchQuery
                ? `No clients match "${searchQuery}".`
                : 'There are currently no clients matching the selected filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-cream-200/80 border-b border-aura-dark/10 tracking-[0.2em] uppercase text-aura-muted text-[10px]">
                <tr>
                  <th className="py-4 px-5">Collector Profile</th>
                  <th className="py-4 px-5">Gmail Verification</th>
                  <th className="py-4 px-5">Contact &amp; Location</th>
                  <th className="py-4 px-5 text-center">Acquisitions</th>
                  <th className="py-4 px-5">Lifetime Value</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-dark/5">
                {filteredClients.map((client) => {
                  const initials = (client.fullName || 'C')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <tr key={client.id} className="hover:bg-cream-200/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-aura-dark text-aura-gold flex items-center justify-center font-bold text-xs shrink-0 border border-aura-gold/30">
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-aura-dark text-sm block">
                              {client.fullName || 'Collector'}
                            </span>
                            <span className="text-[10px] text-aura-muted font-mono block">
                              ID: {client.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Gmail & Verification Badge */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-aura-dark font-medium">
                            {client.email}
                          </span>
                          <button
                            onClick={() => copyEmail(client.email, client.id)}
                            className="p-1 rounded hover:bg-cream-300 text-aura-muted hover:text-aura-dark transition-colors"
                            title="Copy Email"
                          >
                            {copiedEmail === client.id ? (
                              <Check size={12} className="text-emerald-700" />
                            ) : (
                              <Mail size={12} />
                            )}
                          </button>
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 font-semibold">
                            <ShieldCheck size={11} className="text-emerald-700" />
                            <span>Verified Gmail Connected</span>
                          </span>
                        </div>
                      </td>

                      {/* Contact & Location */}
                      <td className="py-4 px-5">
                        <div className="font-mono text-[11px] text-aura-dark">
                          {client.phone ? (
                            <a href={`tel:${client.phone}`} className="hover:text-aura-gold">
                              {client.phone}
                            </a>
                          ) : (
                            <span className="text-aura-muted italic">No phone yet</span>
                          )}
                        </div>
                        <div className="text-[11px] text-aura-muted mt-0.5">
                          {client.city ? `${client.city}` : 'Pakistan'}
                        </div>
                      </td>

                      {/* Orders Count */}
                      <td className="py-4 px-5 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-aura-dark/10 text-aura-dark font-mono font-bold text-xs">
                          {client.ordersCount || 0}
                        </span>
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-4 px-5">
                        <div className="font-mono text-sm font-bold text-aura-dark">
                          Rs. {(Number(client.totalSpend) || 0).toLocaleString()}
                        </div>
                        {client.lastOrderDate && (
                          <span className="text-[10px] text-aura-muted block mt-0.5">
                            Last active: {new Date(client.lastOrderDate).toLocaleDateString()}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              if (onSelectClientForPromo) onSelectClientForPromo(client.email)
                            }}
                            className="px-3 py-1.5 rounded-lg bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 text-[11px] font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1 shadow-sm"
                            title="Compose Promotional Campaign to this Client"
                          >
                            <Send size={11} />
                            <span>Promo</span>
                          </button>

                          <button
                            onClick={() => setSelectedClient(client)}
                            className="p-1.5 rounded-lg hover:bg-cream-300 text-aura-dark/70 hover:text-aura-dark transition-colors border border-aura-dark/15"
                            title="Inspect Client Record"
                          >
                            <ArrowUpRight size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-700 transition-colors"
                            title="Remove Client"
                          >
                            <Trash2 size={13} />
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

      {/* ─── Client Profile Inspection Modal ─── */}
      <AnimatePresence>
        {selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-aura-dark/80 backdrop-blur-sm overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedClient(null)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-cream-50 rounded-3xl border border-aura-gold/40 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pinned Header */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-aura-dark/10 bg-white/90 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-aura-dark text-aura-gold flex items-center justify-center font-bold text-xs">
                    {(selectedClient.fullName || 'C')[0]}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-aura-dark">{selectedClient.fullName}</h3>
                    <p className="font-sans text-[10px] text-aura-muted uppercase tracking-wider">
                      Verified Collector Account
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="p-1.5 rounded-lg hover:bg-cream-200 text-aura-muted hover:text-aura-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Modal Interior */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-aura-dark/10">
                  <div>
                    <span className="text-[10px] text-aura-muted uppercase tracking-wider block">Gmail Address</span>
                    <span className="font-mono font-bold text-aura-dark">{selectedClient.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-aura-muted uppercase tracking-wider block">Phone Contact</span>
                    <span className="font-mono text-aura-dark">{selectedClient.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-aura-muted uppercase tracking-wider block">Lifetime Acquisitions</span>
                    <span className="font-bold text-aura-dark">{selectedClient.ordersCount || 0} Orders</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-aura-muted uppercase tracking-wider block">Cumulative Spend</span>
                    <span className="font-mono font-bold text-aura-gold">Rs. {(Number(selectedClient.totalSpend) || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-aura-dark/10">
                  <span className="text-[10px] text-aura-muted uppercase tracking-wider block mb-1">Registered Delivery Address</span>
                  <p className="text-aura-dark/80">{selectedClient.address || 'Standard courier address recorded upon next checkout'}</p>
                  <p className="text-aura-dark/80">{selectedClient.city}</p>
                </div>

                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/25 flex items-center gap-2 text-emerald-900">
                  <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold block">Gmail Security Authentication Confirmed</span>
                    <span className="text-[11px] text-emerald-800">
                      Verified on {new Date(selectedClient.verifiedAt || selectedClient.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pinned Footer */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-aura-dark/10 bg-white/90 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    const email = selectedClient.email
                    setSelectedClient(null)
                    if (onSelectClientForPromo) onSelectClientForPromo(email)
                  }}
                  className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5"
                >
                  <Send size={12} />
                  <span>Send Promotional Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="btn-outline py-2 px-4 text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
