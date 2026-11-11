import { useState } from 'react'
import { Ruler, Sparkles, Check, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SizingGuide() {
  const [unit, setUnit] = useState('in') // in | cm

  const conversion = unit === 'cm' ? 2.54 : 1
  const fmt = (val) => (unit === 'cm' ? Math.round(val * conversion) : val)

  const sizeChart = [
    { size: 'XS', bust: 32, waist: 25, hip: 35, eu: '34', uk: '6', us: '2' },
    { size: 'S',  bust: 34, waist: 27, hip: 37, eu: '36', uk: '8', us: '4' },
    { size: 'M',  bust: 36, waist: 29, hip: 39, eu: '38', uk: '10', us: '6' },
    { size: 'L',  bust: 38, waist: 31, hip: 41, eu: '40', uk: '12', us: '8' },
    { size: 'XL', bust: 41, waist: 34, hip: 44, eu: '42', uk: '14', us: '10' },
  ]

  const conditions = [
    {
      title: 'Like New (Pristine)',
      badge: 'Tier 1 Archive',
      desc: 'Shows virtually zero signs of wear. Original fabric drape intact, no pulls, fading, or alterations. As if straight off an archival showroom rack.',
    },
    {
      title: 'Excellent',
      badge: 'Tier 2 Archive',
      desc: 'Minimal vintage character. May show very subtle fabric softening or minor patina on metal hardware, entirely consistent with careful previous ownership.',
    },
    {
      title: 'Good',
      badge: 'Tier 3 Archive',
      desc: 'Honorable vintage wear with intact structural integrity. Any minor seam restorations or gentle distressing are documented in detail on the garment page.',
    },
    {
      title: 'Fair (Artisanal Relic)',
      badge: 'Collector Tier',
      desc: 'Rare historical or distressed piece with visible age, intentional fade, or repaired distress. Prized for authentic vintage street-style aesthetic.',
    },
  ]

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 lg:px-12 relative z-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-3 text-aura-gold"
        >
          <Ruler size={14} />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-aura-dark/70 font-semibold">
            Precision &amp; Fit
          </span>
          <Ruler size={14} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl text-aura-dark leading-tight mb-6"
        >
          Archival Measurement &amp; Condition Standards
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans text-sm sm:text-base text-aura-dark/70 leading-relaxed"
        >
          Vintage and archival garments rarely adhere to contemporary vanity sizing. We measure every item flat by hand to ensure your acquisition fits with tailoring perfection.
        </motion.p>
      </div>

      {/* Unit Switcher & Table */}
      <div className="mb-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl text-aura-dark">Silhouette Conversion Matrix</h2>
            <p className="font-sans text-xs text-aura-muted">Standard dimensions for modern comparative reference</p>
          </div>

          <div className="flex items-center p-1 bg-cream-200/80 rounded-xl border border-aura-dark/10">
            <button
              onClick={() => setUnit('in')}
              className={`px-4 py-1.5 rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-all ${
                unit === 'in' ? 'bg-aura-dark text-cream-100 shadow-sm' : 'text-aura-dark/60 hover:text-aura-dark'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-4 py-1.5 rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-all ${
                unit === 'cm' ? 'bg-aura-dark text-cream-100 shadow-sm' : 'text-aura-dark/60 hover:text-aura-dark'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto rounded-3xl border border-aura-gold/30 bg-cream-100/90 shadow-xl backdrop-blur-sm">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-aura-dark/10 bg-aura-dark text-cream-100">
                <th className="py-4 px-6 font-serif text-sm">Size</th>
                <th className="py-4 px-6 uppercase tracking-wider font-semibold">Bust / Chest</th>
                <th className="py-4 px-6 uppercase tracking-wider font-semibold">Natural Waist</th>
                <th className="py-4 px-6 uppercase tracking-wider font-semibold">Full Hip</th>
                <th className="py-4 px-6 uppercase tracking-wider font-semibold">EU</th>
                <th className="py-4 px-6 uppercase tracking-wider font-semibold">UK</th>
                <th className="py-4 px-6 uppercase tracking-wider font-semibold">US</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aura-dark/8">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-cream-200/60 transition-colors">
                  <td className="py-4 px-6 font-serif text-base text-aura-dark font-bold">{row.size}</td>
                  <td className="py-4 px-6 text-aura-dark/80 font-mono font-medium">{fmt(row.bust)} {unit}</td>
                  <td className="py-4 px-6 text-aura-dark/80 font-mono font-medium">{fmt(row.waist)} {unit}</td>
                  <td className="py-4 px-6 text-aura-dark/80 font-mono font-medium">{fmt(row.hip)} {unit}</td>
                  <td className="py-4 px-6 text-aura-muted">{row.eu}</td>
                  <td className="py-4 px-6 text-aura-muted">{row.uk}</td>
                  <td className="py-4 px-6 text-aura-muted">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How to Measure Section */}
      <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="font-serif text-3xl text-aura-dark mb-4">How We Measure Garments</h2>
          <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">
            All our product specifications detail measurements taken with the garment laid flat and buttons/zips fastened. To check fit, measure a similar favorite piece from your current wardrobe:
          </p>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Chest / Pit-to-Pit', desc: 'Straight across the front from armpit seam to armpit seam, doubled.' },
              { label: 'Total Length', desc: 'From the highest point of the shoulder seam straight down to the hem edge.' },
              { label: 'Waistline', desc: 'Straight across the natural narrowest waistband point, multiplied by two.' },
              { label: 'Shoulder Span', desc: 'Across the back from shoulder seam tip to tip.' },
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-aura-dark/10 shadow-xs">
                <span className="font-sans font-semibold text-xs text-aura-dark block mb-0.5">{m.label}</span>
                <span className="font-sans text-[11px] text-aura-muted leading-relaxed">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-aura-gold/30 shadow-2xl relative h-[440px]">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&h=1200&fit=crop&q=85"
            alt="Tailor measuring archival fabric"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/85 via-aura-dark/20 to-transparent flex flex-col justify-end p-8 text-cream-100">
            <div className="flex items-center gap-1.5 text-aura-gold text-xs uppercase tracking-widest font-semibold mb-1">
              <Sparkles size={12} />
              <span>Tailor’s Recommendation</span>
            </div>
            <p className="font-serif text-lg leading-snug">
              "When torn between two sizes for vintage outerwear, select the larger size to achieve effortless drape over knitwear."
            </p>
          </div>
        </div>
      </div>

      {/* Condition Grading Guide */}
      <div className="mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-3xl text-aura-dark mb-2">Our Archival Condition Hierarchy</h2>
          <p className="font-sans text-xs text-aura-muted">Transparent preservation grading applied to every piece</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conditions.map((c, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-cream-100/80 border border-aura-gold/25 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif text-xl text-aura-dark">{c.title}</h4>
                <span className="px-2.5 py-1 rounded bg-aura-gold/20 text-aura-dark text-[10px] font-bold tracking-widest uppercase">
                  {c.badge}
                </span>
              </div>
              <p className="font-sans text-xs text-aura-dark/70 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
