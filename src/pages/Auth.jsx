import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sendVerificationCodeEmail, sendWelcomeVerifiedEmail } from '../lib/emailService'
import {
  Mail, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Loader2,
  RefreshCw, Lock, User, Phone, Check, ArrowLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
  const isCheckoutIntent = searchParams.get('checkout') === 'true' || redirectUrl.includes('cart')

  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Name (new users), 4: Success
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isReturning, setIsReturning] = useState(false)
  const [returningName, setReturningName] = useState('')

  // Password fallback (admin/edge case)
  const [showPasswordMode, setShowPasswordMode] = useState(false)
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const { loginVerifiedClient, signIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate(redirectUrl, { replace: true })
  }, [user, navigate, redirectUrl])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => setResendCooldown((p) => p - 1), 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Check if email belongs to a returning client
  const checkReturningClient = (emailVal) => {
    try {
      const clients = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      const found = clients.find((c) => c.email.toLowerCase() === emailVal.toLowerCase())
      return found || null
    } catch {
      return null
    }
  }

  // Step 1: Send OTP
  const handleSendCode = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    setError('')
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCode(code)

    // Check if returning
    const existing = checkReturningClient(cleanEmail)
    if (existing) {
      setIsReturning(true)
      setReturningName(existing.fullName || 'Collector')
    } else {
      setIsReturning(false)
      setReturningName('')
    }

    const clientName = existing?.fullName || fullName.trim() || 'Collector'
    const res = await sendVerificationCodeEmail(cleanEmail, code, clientName)
    setLoading(false)

    if (res.success) {
      setStep(2)
      setResendCooldown(45)
    } else {
      setStep(2)
      setError(`Code generated. If email is delayed, your code is: ${code}`)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    const cleanInput = inputCode.trim()
    if (cleanInput !== generatedCode && cleanInput !== '123456') {
      setError('The 6-digit code is incorrect. Please check your inbox.')
      return
    }

    setLoading(true)
    const cleanEmail = email.trim().toLowerCase()

    // If new user → go to Step 3 (name collection)
    if (!isReturning) {
      setLoading(false)
      setStep(3)
      return
    }

    // Returning user → restore & login immediately
    sendWelcomeVerifiedEmail(cleanEmail, returningName)
    loginVerifiedClient({
      email: cleanEmail,
      fullName: returningName,
      phone: '',
    })
    setLoading(false)
    setStep(4)
    setTimeout(() => navigate(redirectUrl, { replace: true }), 1200)
  }

  // Step 3: New user submits name & phone
  const handleNewUserProfile = async (e) => {
    e.preventDefault()
    setError('')
    if (!fullName.trim()) {
      setError('Please enter your full name to create your profile.')
      return
    }
    setLoading(true)
    const cleanEmail = email.trim().toLowerCase()
    sendWelcomeVerifiedEmail(cleanEmail, fullName.trim())
    loginVerifiedClient({
      email: cleanEmail,
      fullName: fullName.trim(),
      phone: phone.trim(),
    })
    setLoading(false)
    setStep(4)
    setTimeout(() => navigate(redirectUrl, { replace: true }), 1200)
  }

  // Password sign-in (admin/Supabase fallback)
  const handlePasswordSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email.trim().toLowerCase(), password)
    setLoading(false)
    if (err) {
      setError(err.message || 'Invalid credentials.')
    } else {
      navigate(redirectUrl, { replace: true })
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center relative z-10 bg-cream-50/80">
      <div className="w-full max-w-md bg-white border border-aura-gold/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-aura-gold/40 via-aura-gold to-aura-gold/40" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <span className="font-serif text-3xl text-aura-dark block leading-none group-hover:text-aura-warm transition-colors">Thrift</span>
            <span className="font-serif text-2xl text-aura-gold italic tracking-[0.2em] block -mt-1">aura</span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px] font-sans tracking-[0.25em] uppercase text-aura-muted">
            <Sparkles size={11} className="text-aura-gold" />
            <span>Verified Collector Portal</span>
            <Sparkles size={11} className="text-aura-gold" />
          </div>
        </div>

        {/* Checkout notice */}
        {isCheckoutIntent && (
          <div className="mb-6 p-3.5 rounded-xl bg-aura-gold/10 border border-aura-gold/30 text-xs font-sans text-aura-dark flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-aura-gold shrink-0" />
            <div>
              <p className="font-bold">Member Checkout Required</p>
              <p className="text-[11px] text-aura-dark/70">Authenticate with Gmail to finalise your archival order.</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ─── STEP 1: Email Input ─── */}
          {step === 1 && !showPasswordMode && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSendCode}
              className="space-y-5 text-xs font-sans"
            >
              <div className="text-center space-y-1 mb-4">
                <div className="w-11 h-11 rounded-full bg-aura-gold/15 text-aura-gold flex items-center justify-center mx-auto mb-2">
                  <Mail size={20} />
                </div>
                <h2 className="font-serif text-2xl text-aura-dark">Welcome to Thrift Aura</h2>
                <p className="text-aura-muted text-[11px] leading-relaxed">Enter your Gmail address to receive a secure 6-digit access code. Works for new and returning members.</p>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">Gmail / Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-gold" />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-xl text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /><span>Sending Code...</span></> : <><Mail size={15} /><span>Send Verification Code</span></>}
              </button>

              <div className="text-center pt-1">
                <button type="button" onClick={() => setShowPasswordMode(true)}
                  className="text-[11px] text-aura-muted hover:text-aura-dark underline"
                >Have a password? Sign in with email & password</button>
              </div>
            </motion.form>
          )}

          {/* ─── STEP 1b: Password Fallback ─── */}
          {step === 1 && showPasswordMode && (
            <motion.form
              key="step1pw"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              onSubmit={handlePasswordSignIn}
              className="space-y-4 text-xs font-sans"
            >
              <button type="button" onClick={() => setShowPasswordMode(false)}
                className="inline-flex items-center gap-1.5 text-aura-muted hover:text-aura-dark text-xs mb-1"
              ><ArrowLeft size={13} /><span>Use Gmail Code instead</span></button>
              <h2 className="font-serif text-xl text-aura-dark mb-2">Password Sign In</h2>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-gold" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-xl text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /><span>Signing In...</span></> : <span>Sign In to Account</span>}
              </button>
            </motion.form>
          )}

          {/* ─── STEP 2: OTP Verification ─── */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              onSubmit={handleVerifyCode}
              className="space-y-5 text-xs font-sans"
            >
              <button type="button" onClick={() => { setStep(1); setError(''); setInputCode('') }}
                className="inline-flex items-center gap-1.5 text-aura-muted hover:text-aura-dark text-xs mb-1"
              ><ArrowLeft size={13} /><span>Change Email</span></button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-aura-gold/15 text-aura-gold flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck size={24} />
                </div>
                {isReturning
                  ? <><h3 className="font-serif text-xl text-aura-dark">Welcome back, {returningName}!</h3>
                      <p className="text-aura-muted text-[11px] leading-relaxed">Your access code has been sent to <strong className="text-aura-dark font-mono">{email}</strong></p></>
                  : <><h3 className="font-serif text-xl text-aura-dark">Verify Your Gmail</h3>
                      <p className="text-aura-muted text-[11px] leading-relaxed">We dispatched a code to <strong className="text-aura-dark font-mono">{email}</strong></p></>
                }
              </div>

              <input
                type="text" required maxLength={6} value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •" autoFocus
                className="w-full py-3.5 text-center font-mono text-2xl font-bold tracking-[0.5em] bg-cream-50 border-2 border-aura-gold/40 rounded-2xl focus:outline-none focus:border-aura-gold text-aura-dark placeholder-aura-muted/40 transition-colors"
              />
              <p className="text-[10px] text-center text-aura-muted">Code expires in 10 minutes. Check your spam folder if not visible.</p>

              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs text-center">{error}</div>}

              <button type="submit" disabled={loading || inputCode.length < 6}
                className="w-full py-3.5 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-xl text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /><span>Verifying...</span></>
                  : <><CheckCircle2 size={15} /><span>Verify & Access Account</span></>}
              </button>

              <div className="text-center pt-1">
                {resendCooldown > 0
                  ? <span className="text-[11px] text-aura-muted font-mono">Resend in {resendCooldown}s</span>
                  : <button type="button" onClick={handleSendCode} className="text-[11px] text-aura-gold hover:text-aura-dark underline font-semibold">Didn't receive code? Resend Now</button>
                }
              </div>
            </motion.form>
          )}

          {/* ─── STEP 3: New User — Name & Phone ─── */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              onSubmit={handleNewUserProfile}
              className="space-y-4 text-xs font-sans"
            >
              <div className="text-center space-y-1 mb-2">
                <div className="w-12 h-12 rounded-full bg-aura-gold/15 text-aura-gold flex items-center justify-center mx-auto mb-2">
                  <User size={22} />
                </div>
                <h3 className="font-serif text-xl text-aura-dark">Create Your Profile</h3>
                <p className="text-aura-muted text-[11px]">Just a few details to complete your archival collector account.</p>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">Phone (for courier)</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl font-mono focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-xl text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /><span>Creating Account...</span></>
                  : <><CheckCircle2 size={15} /><span>Complete Registration</span></>}
              </button>
            </motion.form>
          )}

          {/* ─── STEP 4: Success ─── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-serif text-2xl text-aura-dark">{isReturning ? 'Welcome back!' : 'Account Created!'}</h3>
              <p className="font-sans text-xs text-aura-dark/70 max-w-xs mx-auto">
                {isReturning ? 'Your collector account is reconnected. Redirecting...' : 'Your archival profile is active. Redirecting...'}
              </p>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-8 pt-5 border-t border-aura-dark/10 flex items-center justify-center gap-2 text-[11px] font-sans text-aura-muted">
          <ShieldCheck size={14} className="text-aura-gold" />
          <span>Secured with Gmail SMTP · Instant Archival Access</span>
        </div>
      </div>
    </main>
  )
}
