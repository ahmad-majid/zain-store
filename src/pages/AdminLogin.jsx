import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Eye, EyeOff, Loader2, ShieldAlert, ArrowLeft, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signOut, user, profile, loading: authLoading, setUser, setProfile } = useAuth()
  const navigate = useNavigate()

  // If already logged in as admin, go straight to dashboard
  useEffect(() => {
    if (!authLoading && user && profile?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [user, profile, authLoading, navigate])

  // ── Master admin credentials (works without Supabase setup) ──────────────
  const MASTER_EMAIL    = 'admin@thriftaura.com'
  const MASTER_PASSWORD = 'ThriftAura@2026'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1️⃣ Check master credential first (always works, no Supabase required)
    if (
      form.email.trim().toLowerCase() === MASTER_EMAIL &&
      form.password === MASTER_PASSWORD
    ) {
      localStorage.setItem('thrift-aura-admin-session', 'master')
      setUser({
        id: 'master-admin',
        email: MASTER_EMAIL,
        user_metadata: { full_name: 'Store Curator' },
      })
      setProfile({ id: 'master-admin', full_name: 'Store Curator', role: 'admin' })
      navigate('/admin', { replace: true })
      setLoading(false)
      return
    }

    // 2️⃣ Fall back to real Supabase auth
    const { data, error: signInError } = await signIn(form.email, form.password)

    if (signInError) {
      setError('Invalid credentials. Please check your email and password.')
      setLoading(false)
      return
    }

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileData?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        await signOut()
        setError('Access denied. This account does not have admin privileges.')
      }
    } catch {
      await signOut()
      setError('Unable to verify admin role. Please ensure the database schema is configured.')
    }

    setLoading(false)
  }

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className="min-h-screen flex items-center justify-center bg-aura-dark relative overflow-hidden">
      {/* Subtle geometric background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full border border-aura-gold" />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full border border-aura-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-aura-gold" />
      </div>
      {/* Subtle gold gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-aura-gold/40 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm mx-6"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-aura-gold/30 bg-aura-gold/5 mb-6">
            <Lock size={20} className="text-aura-gold" />
          </div>
          <h1 className="font-serif text-2xl text-cream-50 mb-1">Curator Access</h1>
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-cream-300/50">
            Thrift Aura · Admin Portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-aura-charcoal/60 border border-cream-100/8 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream-300/60 font-semibold block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-aura-dark/60 border border-cream-100/10 rounded-lg font-sans text-xs text-cream-100 placeholder-cream-100/20 focus:outline-none focus:border-aura-gold/50 transition-colors"
                placeholder="admin@thriftaura.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream-300/60 font-semibold block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-aura-dark/60 border border-cream-100/10 rounded-lg font-sans text-xs text-cream-100 placeholder-cream-100/20 focus:outline-none focus:border-aura-gold/50 transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-100/30 hover:text-cream-100/60 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-2.5 p-3.5 bg-red-950/60 border border-red-500/20 rounded-lg"
              >
                <ShieldAlert size={14} className="text-red-400 shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-red-300 leading-relaxed">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-aura-gold hover:bg-cream-100 text-aura-dark rounded-lg text-[11px] font-sans tracking-[0.3em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-aura-gold/10"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>{loading ? 'Verifying...' : 'Enter Dashboard'}</span>
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-sans text-[11px] text-cream-100/30 hover:text-cream-100/60 tracking-widest uppercase transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Back to store</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
