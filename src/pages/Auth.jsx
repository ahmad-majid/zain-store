import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Loader2, Sparkles, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Auth() {
  const [mode, setMode] = useState('signin') // signin | signup
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'signin') {
      const { error: err } = await signIn(form.email, form.password)
      if (err) setError(err.message)
      else navigate('/')
    } else {
      const { error: err } = await signUp(form.email, form.password, form.name)
      if (err) setError(err.message)
      else setSuccess('Account created! Please check your email inbox to verify.')
    }
    setLoading(false)
  }

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  return (
    <main className="min-h-screen pt-16 pb-20 px-6 flex items-center justify-center relative z-10">
      <div className="w-full max-w-md bg-cream-100/95 backdrop-blur-xl border border-aura-gold/25 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <span className="font-serif text-3xl text-aura-dark block leading-none group-hover:text-aura-warm transition-colors">
              Thrift
            </span>
            <span className="font-serif text-2xl text-aura-warm italic tracking-[0.2em] block -mt-1">
              aura
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] font-sans tracking-[0.25em] uppercase text-aura-muted">
            <Sparkles size={11} className="text-aura-gold" />
            <span>Curator & Member Portal</span>
            <Sparkles size={11} className="text-aura-gold" />
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-cream-200/70 rounded-lg mb-6 border border-aura-dark/10">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); setSuccess('') }}
            className={`py-2 text-xs font-sans tracking-[0.2em] uppercase font-semibold rounded-md transition-all ${
              mode === 'signin'
                ? 'bg-aura-dark text-cream-100 shadow-sm'
                : 'text-aura-dark/60 hover:text-aura-dark'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
            className={`py-2 text-xs font-sans tracking-[0.2em] uppercase font-semibold rounded-md transition-all ${
              mode === 'signup'
                ? 'bg-aura-dark text-cream-100 shadow-sm'
                : 'text-aura-dark/60 hover:text-aura-dark'
            }`}
          >
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {mode === 'signup' && (
              <div>
                <label className="font-sans text-[11px] tracking-widest uppercase text-aura-dark/70 font-semibold block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-cream-50 border border-aura-dark/20 rounded-lg font-sans text-xs text-aura-dark placeholder-aura-muted focus:outline-none focus:border-aura-gold transition-colors"
                  placeholder="e.g. Elena Rostova"
                />
              </div>
            )}

            <div>
              <label className="font-sans text-[11px] tracking-widest uppercase text-aura-dark/70 font-semibold block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                required
                className="w-full px-4 py-3 bg-cream-50 border border-aura-dark/20 rounded-lg font-sans text-xs text-aura-dark placeholder-aura-muted focus:outline-none focus:border-aura-gold transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-sans text-[11px] tracking-widest uppercase text-aura-dark/70 font-semibold">
                  Password
                </label>
                {mode === 'signin' && (
                  <span className="text-[11px] font-sans text-aura-muted hover:text-aura-dark cursor-pointer underline">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-cream-50 border border-aura-dark/20 rounded-lg font-sans text-xs text-aura-dark placeholder-aura-muted focus:outline-none focus:border-aura-gold transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-dark"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-sans text-xs leading-relaxed">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-sans text-xs leading-relaxed">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-lg text-xs font-sans tracking-[0.25em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              <span>{mode === 'signin' ? 'Sign In to Aura' : 'Create Member Account'}</span>
            </button>
          </motion.form>
        </AnimatePresence>

        <div className="mt-6 pt-5 border-t border-aura-dark/10 flex items-center justify-center gap-2 text-[11px] font-sans text-aura-muted">
          <ShieldCheck size={14} className="text-aura-gold" />
          <span>Connected with Supabase Cloud Auth</span>
        </div>
      </div>
    </main>
  )
}
