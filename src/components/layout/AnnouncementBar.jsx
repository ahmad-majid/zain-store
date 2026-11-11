import { Sparkles } from 'lucide-react'
import { useStoreSettings } from '../../context/StoreSettingsContext'

export default function AnnouncementBar() {
  const { settings } = useStoreSettings()
  const { announcement } = settings

  if (!announcement?.enabled) return null

  const items = announcement.items || [
    'DROP 04 IS LIVE',
    'HAND-PICKED ARCHIVAL VINTAGE',
    'COMPLIMENTARY SHIPPING OVER RS. 3,000',
  ]

  return (
    <div className="bg-aura-dark text-cream-100 overflow-hidden py-2.5 border-b border-aura-charcoal relative z-50 text-[11px] font-sans tracking-[0.25em] uppercase select-none">
      <div
        className="marquee-track flex gap-8 items-center"
        style={{ animationDuration: `${announcement.speed || 28}s` }}
      >
        {[...items, ...items, ...items].map((text, i) => (
          <span key={i} className="inline-flex items-center gap-4 whitespace-nowrap opacity-90 hover:opacity-100 transition-opacity">
            <span>{text}</span>
            <Sparkles size={10} className="text-aura-gold shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
