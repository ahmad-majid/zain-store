import { Link } from 'react-router-dom'
import { Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contact" className="bg-aura-dark text-cream-200 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="font-serif text-3xl text-cream-100 tracking-tight block">Thrift</span>
              <span className="font-serif text-2xl text-aura-gold tracking-widest italic -mt-1 block">aura</span>
            </div>
            <p className="font-sans text-sm text-cream-300/60 leading-relaxed max-w-xs">
              Curated pre-loved fashion for the conscious style seeker. 
              Every piece tells a story.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com/thriftaura" className="p-2 text-cream-300/50 hover:text-aura-gold transition-colors">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com/thriftaura" className="p-2 text-cream-300/50 hover:text-aura-gold transition-colors">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="mailto:hello@thriftaura.com" className="p-2 text-cream-300/50 hover:text-aura-gold transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-aura-gold mb-6">Shop</h4>
            <ul className="space-y-3">
              {['All Items', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'].map(item => (
                <li key={item}>
                  <Link to="/shop" className="font-sans text-sm text-cream-300/60 hover:text-cream-100 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-aura-gold mb-6">Info</h4>
            <ul className="space-y-3">
              {['About Us', 'Sustainability', 'Sizing Guide', 'Returns', 'FAQ'].map(item => (
                <li key={item}>
                  <a href="#" className="font-sans text-sm text-cream-300/60 hover:text-cream-100 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-cream-200/10 pt-10 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h4 className="font-serif text-xl text-cream-100 mb-1">Join the Aura</h4>
              <p className="font-sans text-sm text-cream-300/50">Get first access to new arrivals & exclusive drops.</p>
            </div>
            <form className="flex w-full md:w-auto gap-0" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-72 px-5 py-3 bg-cream-200/10 border border-cream-200/20 text-cream-100 placeholder-cream-200/30 font-sans text-sm focus:outline-none focus:border-aura-gold transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-aura-gold text-aura-dark font-sans text-sm tracking-widest uppercase hover:bg-aura-warm hover:text-cream-100 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream-300/30 font-sans">
          <p>© 2024 Thrift Aura. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-aura-gold mx-1" /> for conscious fashion
          </p>
        </div>
      </div>
    </footer>
  )
}
