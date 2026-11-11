import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Heart, CheckCircle2, Shield } from 'lucide-react'

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setTimeout(() => {
      setSubscribed(false)
      setEmail('')
    }, 4000)
  }

  const shopLinks = [
    { label: 'All Silhouettes', to: '/shop' },
    { label: 'Outerwear', to: '/shop?category=outerwear' },
    { label: 'Tailored Tops', to: '/shop?category=tops' },
    { label: 'Bottoms & Trousers', to: '/shop?category=bottoms' },
    { label: 'Archival Dresses', to: '/shop?category=dresses' },
    { label: 'Knitwear & Cashmere', to: '/shop?category=knitwear' },
  ]

  const infoLinks = [
    { label: 'About Our Atelier', to: '/about' },
    { label: 'Circular Sustainability', to: '/sustainability' },
    { label: 'Sizing & Condition Guide', to: '/sizing-guide' },
    { label: 'Returns & Insured Transit', to: '/returns' },
    { label: 'Frequently Asked Questions', to: '/faq' },
  ]

  return (
    <footer id="contact" className="bg-aura-dark text-cream-200 pt-16 pb-12 px-6 relative z-10 border-t border-aura-gold/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4 group">
              <span className="font-serif text-3xl text-cream-100 tracking-tight block group-hover:text-aura-gold transition-colors">
                Thrift
              </span>
              <span className="font-serif text-2xl text-aura-gold tracking-widest italic -mt-1 block">
                aura
              </span>
            </Link>
            <p className="font-sans text-xs sm:text-sm text-cream-300/60 leading-relaxed max-w-sm mb-6">
              Curated pre-loved archival fashion for the conscious collector. 
              Every garment is individually sourced, authenticated, and restored to preserve the art of historical tailoring.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/thriftaura"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-cream-100/5 hover:bg-aura-gold hover:text-aura-dark text-cream-300/70 flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://twitter.com/thriftaura"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-cream-100/5 hover:bg-aura-gold hover:text-aura-dark text-cream-300/70 flex items-center justify-center transition-colors"
                title="Twitter"
              >
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a
                href="mailto:hello@thriftaura.com"
                className="w-9 h-9 rounded-full bg-cream-100/5 hover:bg-aura-gold hover:text-aura-dark text-cream-300/70 flex items-center justify-center transition-colors"
                title="Email Atelier"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Shop Silhouettes */}
          <div>
            <h4 className="font-sans text-[11px] tracking-[0.25em] uppercase text-aura-gold font-semibold mb-5">
              Curated Silhouettes
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-xs text-cream-300/60 hover:text-cream-100 hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge & Info */}
          <div>
            <h4 className="font-sans text-[11px] tracking-[0.25em] uppercase text-aura-gold font-semibold mb-5">
              Concierge &amp; Atelier
            </h4>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-xs text-cream-300/60 hover:text-cream-100 hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="border-t border-cream-200/10 pt-10 pb-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h4 className="font-serif text-xl text-cream-100 mb-1">Join the Aura Collector Circle</h4>
              <p className="font-sans text-xs text-cream-300/60">
                Receive priority private access to weekly archive drops and lookbook releases.
              </p>
            </div>

            {!subscribed ? (
              <form className="flex w-full md:w-auto" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="collector@domain.com"
                  className="flex-1 md:w-72 px-4 py-2.5 bg-cream-200/10 border border-cream-200/20 text-cream-100 placeholder-cream-200/30 font-sans text-xs focus:outline-none focus:border-aura-gold transition-colors rounded-l-lg"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-aura-gold text-aura-dark font-sans text-xs tracking-widest uppercase font-bold hover:bg-aura-warm hover:text-cream-100 transition-all rounded-r-lg"
                >
                  Join Circle
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-sans">
                <CheckCircle2 size={16} />
                <span>Welcome to the Collector Circle. Invitation dispatched.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cream-300/40 font-sans pt-4 border-t border-cream-200/5">
          <p>© {new Date().getFullYear()} Thrift Aura Atelier. All archival rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-cream-100 transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-cream-100 transition-colors">
              Terms of Service
            </Link>
            <span>·</span>
            <Link to="/admin-access" className="hover:text-aura-gold transition-colors flex items-center gap-1 text-[11px] opacity-60 hover:opacity-100">
              <Shield size={11} />
              <span>Curator Login</span>
            </Link>
          </div>

          <p className="flex items-center gap-1">
            Preserved with <Heart size={11} className="text-aura-gold mx-1 fill-aura-gold/20" /> for circular fashion
          </p>
        </div>
      </div>
    </footer>
  )
}

