import { useState, useEffect } from 'react'
import {
  Mail, Send, CheckSquare, Square, Users, Sparkles, Tag,
  ExternalLink, Eye, RefreshCw, CheckCircle2, AlertCircle, Clock,
  History, ArrowRight, Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendPromotionalBroadcast } from '../../lib/emailService'

const OWNER_EMAIL = 'u06626982@gmail.com'

const CAMPAIGN_TEMPLATES = [
  {
    name: 'Winter Archival Drop',
    subject: '✨ Thrift Aura • Private Archival Drop & 20% Collectors Privilege',
    headline: 'Exclusive Winter Archive • Tailored Coats, Cashmere & Pure Silk',
    message: `Dear Collector,\n\nOur atelier has just finalized authentication for our Winter Private Archive. We have curated exceptionally rare pieces from the late 1980s and 1990s, including double-breasted structured blazers, pure cashmere trench coats, and hand-tailored silk lapels.\n\nAs a verified member of our collector circle, enjoy priority acquisition before public release.`,
    couponCode: 'AURA20',
    buttonText: 'Explore Private Archive',
  },
  {
    name: 'Complimentary Insured Shipping',
    subject: 'Thrift Aura Atelier • Complimentary Courier Dispatch Weekend',
    headline: 'Complimentary Express Courier on All Archival Acquisitions',
    message: `Hello Collector,\n\nThis weekend, enjoy complimentary insured courier delivery across all orders. Each garment is steam sanitized, encased in archival tissue, and delivered in protective garment housing directly to your doorstep.`,
    couponCode: 'FREESHIP',
    buttonText: 'Discover Curated Pieces',
  },
  {
    name: 'Private VIP 15% Privilege',
    subject: 'A Private Note from the Atelier • 15% Privilege on Next Acquisition',
    headline: 'Cherished Collector Appreciation & Private Invitation',
    message: `To our esteemed collector,\n\nThank you for championing sustainable archival luxury. We are pleased to extend a private 15% discount code applicable to any garment in our archive.\n\nUse your code at checkout to claim your archival savings.`,
    couponCode: 'AURA15',
    buttonText: 'Claim Collector Privilege',
  },
]

export default function PromotionsCRM({ targetEmail, onNotify }) {
  const [clients, setClients] = useState([])
  const [selectedEmails, setSelectedEmails] = useState(new Set())
  const [campaignSubject, setCampaignSubject] = useState(CAMPAIGN_TEMPLATES[0].subject)
  const [headline, setHeadline] = useState(CAMPAIGN_TEMPLATES[0].headline)
  const [message, setMessage] = useState(CAMPAIGN_TEMPLATES[0].message)
  const [couponCode, setCouponCode] = useState(CAMPAIGN_TEMPLATES[0].couponCode)
  const [buttonText, setButtonText] = useState(CAMPAIGN_TEMPLATES[0].buttonText)
  const [buttonLink, setButtonLink] = useState('https://thriftaura.store/shop')

  const [isSending, setIsSending] = useState(false)
  const [campaignHistory, setCampaignHistory] = useState([])
  const [previewMode, setPreviewMode] = useState(false)

  // Load clients and history
  const loadData = () => {
    try {
      const storedClients = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      setClients(storedClients)

      // Initialize selected emails (all selected by default)
      if (targetEmail) {
        setSelectedEmails(new Set([targetEmail]))
      } else {
        setSelectedEmails(new Set(storedClients.map((c) => c.email)))
      }

      const storedHistory = JSON.parse(localStorage.getItem('thrift-aura-broadcast-history') || '[]')
      setCampaignHistory(storedHistory)
    } catch (e) {
      console.warn('Failed loading promotions data', e)
    }
  }

  useEffect(() => {
    loadData()
  }, [targetEmail])

  // Select / Deselect handlers
  const toggleEmail = (email) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev)
      if (next.has(email)) next.delete(email)
      else next.add(email)
      return next
    })
  }

  const selectAll = () => {
    setSelectedEmails(new Set(clients.map((c) => c.email)))
  }

  const deselectAll = () => {
    setSelectedEmails(new Set())
  }

  const selectHighSpenders = () => {
    const highSpenders = clients
      .filter((c) => (Number(c.totalSpend) || 0) >= 20000)
      .map((c) => c.email)
    setSelectedEmails(new Set(highSpenders))
  }

  const applyTemplate = (tpl) => {
    setCampaignSubject(tpl.subject)
    setHeadline(tpl.headline)
    setMessage(tpl.message)
    setCouponCode(tpl.couponCode)
    setButtonText(tpl.buttonText)
  }

  // Dispatch campaign to all selected clients at once
  const handleSendBroadcast = async (e) => {
    e.preventDefault()
    const recipientsList = Array.from(selectedEmails)

    if (recipientsList.length === 0) {
      alert('Please select at least one client email address to receive the promotion.')
      return
    }

    if (!campaignSubject.trim() || !headline.trim() || !message.trim()) {
      alert('Please complete the campaign subject, headline, and message body.')
      return
    }

    const confirmMsg = `Send this promotional campaign to all ${recipientsList.length} selected client emails via Gmail (${OWNER_EMAIL})?`
    if (!confirm(confirmMsg)) return

    setIsSending(true)

    const payload = {
      recipients: recipientsList,
      subject: campaignSubject.trim(),
      headline: headline.trim(),
      message: message.trim(),
      couponCode: couponCode.trim().toUpperCase() || null,
      buttonText: buttonText.trim() || 'Explore Archive',
      buttonLink: buttonLink.trim() || 'https://thriftaura.store/shop',
    }

    const res = await sendPromotionalBroadcast(payload)
    setIsSending(false)

    // Save to campaign history log
    const historyItem = {
      id: `camp-${Date.now()}`,
      sentAt: new Date().toISOString(),
      subject: payload.subject,
      headline: payload.headline,
      couponCode: payload.couponCode,
      recipientsCount: recipientsList.length,
      recipients: recipientsList,
      status: res.success ? 'Delivered via Gmail' : 'Sent with Notice',
    }

    const updatedHistory = [historyItem, ...campaignHistory]
    setCampaignHistory(updatedHistory)
    localStorage.setItem('thrift-aura-broadcast-history', JSON.stringify(updatedHistory))

    if (onNotify) {
      onNotify(`✓ Promotional email campaign successfully dispatched to ${recipientsList.length} clients!`)
    }
  }

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-aura-gold font-bold">
              Marketing &amp; Direct Outreach
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-aura-dark font-normal">
            Promotional Broadcast &amp; <span className="italic text-aura-warm">Client Mail Suite</span>
          </h2>
          <p className="font-sans text-xs text-aura-muted mt-0.5">
            Select verified client emails and dispatch branded luxury promotional drops, discount vouchers, and atelier announcements simultaneously via Gmail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="btn-outline py-2.5 px-4 text-xs inline-flex items-center gap-2"
          >
            <Eye size={13} />
            <span>{previewMode ? 'Hide Email Preview' : 'Show Live Email Preview'}</span>
          </button>
        </div>
      </div>

      {/* ─── Top Presets Ribbon ─── */}
      <div className="p-4 rounded-2xl bg-cream-100 border border-aura-dark/10 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
        <div className="flex items-center gap-2 text-aura-dark font-semibold uppercase tracking-wider text-[11px]">
          <Sparkles size={14} className="text-aura-gold" />
          <span>Quick Editorial Templates:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {CAMPAIGN_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-aura-dark hover:text-cream-100 text-aura-dark/80 border border-aura-dark/15 text-xs font-medium transition-colors"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Grid: Client Email Directory (Left) + Campaign Composer (Right) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ─── LEFT: Client Email Directory & Selector (5 Cols) ─── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-aura-dark/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-aura-dark/10">
              <div>
                <h3 className="font-serif text-lg text-aura-dark">Audience Directory</h3>
                <p className="font-sans text-[11px] text-aura-muted">
                  Choose recipients for this promotional drop
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-aura-gold/20 text-aura-dark font-mono font-bold text-xs border border-aura-gold/40">
                {selectedEmails.size} / {clients.length} Selected
              </span>
            </div>

            {/* Quick Segment Controls */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans">
              <button
                type="button"
                onClick={selectAll}
                className="px-2.5 py-1 rounded bg-aura-dark text-cream-100 hover:bg-aura-gold hover:text-aura-dark font-semibold uppercase tracking-wider transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="px-2.5 py-1 rounded bg-cream-200 text-aura-dark/70 hover:text-aura-dark font-semibold uppercase tracking-wider transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={selectHighSpenders}
                className="px-2.5 py-1 rounded bg-cream-200 text-aura-dark/70 hover:text-aura-dark font-semibold uppercase tracking-wider transition-colors"
              >
                VIP (20k+)
              </button>
            </div>

            {/* Client Email Checklist */}
            <div className="divide-y divide-aura-dark/8 max-h-[460px] overflow-y-auto pr-1">
              {clients.length === 0 ? (
                <p className="text-center py-8 text-xs text-aura-muted">No client emails recorded.</p>
              ) : (
                clients.map((client) => {
                  const isChecked = selectedEmails.has(client.email)
                  return (
                    <div
                      key={client.id || client.email}
                      onClick={() => toggleEmail(client.email)}
                      className={`py-3 px-2 flex items-center justify-between cursor-pointer rounded-xl transition-colors ${
                        isChecked ? 'bg-aura-gold/10' : 'hover:bg-cream-200/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-aura-dark border-aura-dark text-aura-gold' : 'border-aura-dark/30 bg-white'
                        }`}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div>
                          <span className="font-bold text-aura-dark text-xs block">
                            {client.fullName || 'Collector'}
                          </span>
                          <span className="font-mono text-[11px] text-aura-dark/80 block">
                            {client.email}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-aura-muted block">Spend</span>
                        <span className="font-mono text-[11px] font-bold text-aura-gold">
                          Rs. {(Number(client.totalSpend) || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Luxury Campaign Composer (7 Cols) ─── */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSendBroadcast} className="glass-card rounded-2xl p-6 border border-aura-dark/10 space-y-5 text-xs font-sans shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-aura-dark/10">
              <div>
                <h3 className="font-serif text-xl text-aura-dark">Campaign Composer</h3>
                <p className="text-[11px] text-aura-muted">
                  Sending via authenticated Gmail: <strong className="text-aura-dark font-mono">{OWNER_EMAIL}</strong>
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-[10px]">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>SMTP Connected</span>
              </div>
            </div>

            {/* Campaign Subject */}
            <div>
              <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                Email Subject Line *
              </label>
              <input
                type="text"
                required
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                placeholder="e.g. ✨ Thrift Aura • Private Archival Drop & 20% Privilege"
                className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold text-aura-dark font-medium"
              />
            </div>

            {/* Headline */}
            <div>
              <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                Headline / Announcement Title *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Exclusive Winter Archive • Tailored Coats & Pure Silk"
                className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold text-aura-dark"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                Editorial Announcement Body *
              </label>
              <textarea
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your luxury announcement, story, or drop invitation..."
                className="w-full p-3.5 bg-white border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold text-aura-dark font-sans leading-relaxed"
              />
            </div>

            {/* Promotional Code & Button Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                  Attached Promo / Voucher Code
                </label>
                <div className="relative">
                  <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-gold" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. AURA20"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-aura-dark/20 rounded-xl font-mono uppercase focus:outline-none focus:border-aura-gold font-bold text-aura-dark"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                  Call to Action Button Text
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. Explore Private Archive"
                  className="w-full px-3.5 py-2.5 bg-white border border-aura-dark/20 rounded-xl focus:outline-none focus:border-aura-gold text-aura-dark"
                />
              </div>
            </div>

            {/* Dispatch Button */}
            <div className="pt-3 border-t border-aura-dark/10 flex items-center justify-between">
              <span className="text-[11px] text-aura-muted">
                Will be delivered to <strong>{selectedEmails.size}</strong> collector {selectedEmails.size === 1 ? 'inbox' : 'inboxes'}
              </span>

              <button
                type="submit"
                disabled={isSending || selectedEmails.size === 0}
                className="py-3 px-6 rounded-xl bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 text-xs font-sans tracking-wider uppercase font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Sending Campaign to {selectedEmails.size} Clients...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Broadcast to All ({selectedEmails.size})</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ─── LIVE EMAIL PREVIEW MOCKUP ─── */}
          {previewMode && (
            <div className="p-6 bg-aura-dark rounded-2xl border border-aura-gold/40 shadow-2xl text-cream-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cream-100/10">
                <span className="font-sans text-[10px] uppercase tracking-widest text-aura-gold font-bold">
                  Live Client Gmail Preview
                </span>
                <span className="text-[11px] font-mono text-cream-300/60">From: {OWNER_EMAIL}</span>
              </div>

              <div className="bg-[#141517] rounded-xl p-6 border border-[#2d261e] space-y-4 text-center">
                <h1 className="font-serif text-2xl uppercase tracking-[0.2em] text-[#f5f3ef]">
                  Thrift <span className="text-aura-gold italic">Aura</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#a39c91] -mt-2">
                  Curated Editorial &bull; Archival Private Collection
                </p>

                <div className="pt-4 text-left space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-aura-gold/15 text-aura-gold text-[10px] font-bold uppercase tracking-wider border border-aura-gold/30">
                    Atelier Announcement
                  </span>
                  <h3 className="font-serif text-xl text-white font-normal">{headline}</h3>
                  <p className="text-xs text-[#cfc8be] whitespace-pre-line leading-relaxed">{message}</p>

                  {couponCode && (
                    <div className="p-4 rounded-xl bg-[#1c1a16] border border-aura-gold/50 text-center my-4">
                      <span className="text-[10px] uppercase tracking-wider text-[#a39c91] block">
                        Special Collector Privilege Code
                      </span>
                      <span className="font-mono text-xl font-bold text-aura-gold tracking-widest block mt-1">
                        {couponCode}
                      </span>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <span className="inline-block px-6 py-2.5 rounded bg-aura-gold text-aura-dark font-bold uppercase tracking-wider text-xs">
                      {buttonText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Campaign History Log ─── */}
      <div className="glass-card rounded-2xl p-5 border border-aura-dark/10 space-y-4">
        <div className="flex items-center gap-2 text-aura-dark font-semibold">
          <History size={16} className="text-aura-gold" />
          <h3 className="font-serif text-lg">Broadcast History Log</h3>
        </div>

        {campaignHistory.length === 0 ? (
          <p className="text-xs text-aura-muted">No promotional broadcasts sent yet. Compose your first campaign above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-cream-200/80 border-b border-aura-dark/10 tracking-wider uppercase text-aura-muted text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Campaign Subject</th>
                  <th className="py-3 px-4 text-center">Recipients</th>
                  <th className="py-3 px-4">Privilege Code</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-dark/5">
                {campaignHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-200/40">
                    <td className="py-3 px-4 font-mono text-[11px] text-aura-dark/80">
                      {new Date(item.sentAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-aura-dark">{item.subject}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-aura-gold">
                      {item.recipientsCount} Clients
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {item.couponCode || 'None'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 font-semibold">
                        <Check size={11} className="text-emerald-700" />
                        <span>{item.status}</span>
                      </span>
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
