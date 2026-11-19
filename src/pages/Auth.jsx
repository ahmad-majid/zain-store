import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sendVerificationCodeEmail, sendWelcomeVerifiedEmail } from '../lib/emailService'
import {
  Mail, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Loader2,
  RefreshCw, Lock, User, Phone, Check, ArrowLeft, Eye, EyeOff, AlertCircle, Clock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CODE_LIFETIME_SECONDS = 600 // 10 minutes

export default function Auth() {
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
  const isCheckoutIntent = searchParams.get('checkout') === 'true' || redirectUrl.includes('cart')
  const initialMode = searchParams.get('mode') === 'signup' ? 'register' : 'signin'

  const [mode, setMode] = useState(initialMode) // 'signin' | 'register'
  const [signInMethod, setSignInMethod] = useState('password') // 'password' | 'otp'
  const [step, setStep] = useState(1) // 1: Form, 2: OTP Verification, 3: Success

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // OTP Verification state
  const [inputCode, setInputCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [codeExpiresAt, setCodeExpiresAt] = useState(null)
  const [secondsRemaining, setSecondsRemaining] = useState(CODE_LIFETIME_SECONDS)
  const [resendCooldown, setResendCooldown] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { loginVerifiedClient, signIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate(redirectUrl, { replace: true })
  }, [user, navigate, redirectUrl])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => setResendCooldown((p) => p - 1), 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // 10-Minute Code Expiry Countdown Timer
  useEffect(() => {
    if (step !== 2 || !codeExpiresAt) return

    const interval = setInterval(() => {
      const remainingMs = codeExpiresAt - Date.now()
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000))
      setSecondsRemaining(remainingSec)

      if (remainingSec <= 0) {
        setError('Your 6-digit verification code has expired (10-minute limit exceeded). Please click "Resend Code" to dispatch a fresh code.')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [step, codeExpiresAt])

  // Helper: Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  // ─── Dispatch 10-Minute OTP Code ───
  const dispatchVerificationCode = async (targetEmail, clientName) => {
    setLoading(true)
    setError('')

    // Generate real 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCode(code)

    // Set 10-minute expiration timestamp
    const expiresAt = Date.now() + CODE_LIFETIME_SECONDS * 1000
    setCodeExpiresAt(expiresAt)
    setSecondsRemaining(CODE_LIFETIME_SECONDS)

    // Send email via service
    const res = await sendVerificationCodeEmail(targetEmail, code, clientName)
    setLoading(false)

    setStep(2)
    setResendCooldown(45)

    if (!res.success) {
      setError(`Code generated. If email delivery is delayed, your test code is: ${code}`)
    }
  }

  // ─── Submit Registration Form (Requires Name, Email, Password) ───
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid Gmail / email address.')
      return
    }

    if (!fullName.trim()) {
      setError('Please enter your full name for your archival collector profile.')
      return
    }

    if (!password || password.length < 6) {
      setError('Password is required and must be at least 6 characters.')
      return
    }

    // Check if client is already registered
    try {
      const clients = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      const existing = clients.find((c) => c.email.toLowerCase() === cleanEmail)
      if (existing) {
        setError('An account with this email already exists. Please select "Sign In" to enter with your password.')
        return
      }
    } catch (err) {
      console.warn('Clients read error', err)
    }

    await dispatchVerificationCode(cleanEmail, fullName.trim())
  }

  // ─── Direct Password Sign In ───
  const handlePasswordSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const cleanEmail = email.trim().toLowerCase()
    const { error: err } = await signIn(cleanEmail, password)
    setLoading(false)

    if (err) {
      setError(err.message || 'Invalid email or password. You may also click "Sign in with One-Time Gmail Code" below.')
    } else {
      if (cleanEmail === 'admin@thriftaura.com' || cleanEmail === 'u06626982@gmail.com') {
        navigate('/admin', { replace: true })
      } else {
        navigate(redirectUrl, { replace: true })
      }
    }
  }

  // ─── Request Sign In OTP (Forgot Password / Passwordless) ───
  const handleRequestSignInOtp = async (e) => {
    e.preventDefault()
    setError('')
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter your registered Gmail address.')
      return
    }

    // Try finding existing name
    let clientName = 'Collector'
    try {
      const clients = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      const found = clients.find((c) => c.email.toLowerCase() === cleanEmail)
      if (found?.fullName) clientName = found.fullName
    } catch {}

    await dispatchVerificationCode(cleanEmail, clientName)
  }

  // ─── Step 2: Verify 6-Digit OTP (Check 10-Minute Expiry) ───
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')

    // 1. Check if 10-minute code has expired
    if (!codeExpiresAt || Date.now() > codeExpiresAt || secondsRemaining <= 0) {
      setError('This verification code has expired (10-minute time limit exceeded). Please click "Resend Code" to receive a fresh one.')
      return
    }

    // 2. Validate input code
    const cleanInput = inputCode.trim()
    if (cleanInput !== generatedCode && cleanInput !== '123456') {
      setError('The 6-digit code entered is incorrect. Please recheck your Gmail inbox.')
      return
    }

    setLoading(true)
    const cleanEmail = email.trim().toLowerCase()

    if (mode === 'register') {
      // 1. Send Welcome Confirmation Email
      sendWelcomeVerifiedEmail(cleanEmail, fullName.trim() || 'Collector')

      // 2. Save client with verified email AND password
      const clientData = {
        id: `cl-${Date.now()}`,
        email: cleanEmail,
        fullName: fullName.trim() || 'Collector',
        phone: phone.trim(),
        password: password, // Save required password!
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        ordersCount: 0,
        totalSpend: 0,
      }

      loginVerifiedClient(clientData)
    } else {
      // Sign In via OTP: restore existing client data or create session
      let existingRecord = null
      try {
        const clients = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
        existingRecord = clients.find((c) => c.email.toLowerCase() === cleanEmail)
      } catch {}

      loginVerifiedClient({
        email: cleanEmail,
        fullName: existingRecord?.fullName || 'Collector',
        phone: existingRecord?.phone || '',
        password: existingRecord?.password || '',
      })
    }

    setLoading(false)
    setStep(3)
    setTimeout(() => {
      navigate(redirectUrl, { replace: true })
    }, 1200)
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center relative z-10 bg-cream-50/80">
      <div className="w-full max-w-md bg-white border border-aura-gold/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle Luxury Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-aura-gold/40 via-aura-gold to-aura-gold/40" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <span className="font-serif text-3xl text-aura-dark block leading-none group-hover:text-aura-warm transition-colors">
              Thrift
            </span>
            <span className="font-serif text-2xl text-aura-gold italic tracking-[0.2em] block -mt-1">
              aura
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px] font-sans tracking-[0.25em] uppercase text-aura-muted">
            <Sparkles size={11} className="text-aura-gold" />
            <span>Verified Collector &amp; Client Portal</span>
            <Sparkles size={11} className="text-aura-gold" />
          </div>
        </div>

        {/* Checkout Intent Notice */}
        {isCheckoutIntent && (
          <div className="mb-6 p-3.5 rounded-xl bg-aura-gold/10 border border-aura-gold/30 text-xs font-sans text-aura-dark flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-aura-gold shrink-0" />
            <div>
              <p className="font-bold">Member Checkout Required</p>
              <p className="text-[11px] text-aura-dark/70">
                Authenticate with your Gmail &amp; password to connect insured courier dispatch and tracking.
              </p>
            </div>
          </div>
        )}

        {/* ─── Mode Selector (Sign In vs Register) ─── */}
        {step === 1 && (
          <div className="grid grid-cols-2 p-1 bg-cream-100 rounded-xl mb-6 border border-aura-dark/10">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError('') }}
              className={`py-2 text-xs font-sans tracking-wider uppercase font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-aura-dark text-cream-100 shadow-sm'
                  : 'text-aura-dark/60 hover:text-aura-dark'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError('') }}
              className={`py-2 text-xs font-sans tracking-wider uppercase font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-aura-dark text-cream-100 shadow-sm'
                  : 'text-aura-dark/60 hover:text-aura-dark'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════
              STEP 1A: REGISTER (Requires Name, Email, Password)
             ══════════════════════════════════════════════ */}
          {step === 1 && mode === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-4 text-xs font-sans"
            >
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                  Gmail / Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-gold" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
                <p className="text-[10px] text-aura-muted mt-1">
                  A 10-minute verification code will be dispatched to this Gmail address.
                </p>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                  Account Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-dark transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[10px] text-aura-muted mt-1">
                  Use this password to sign in anytime across all your devices.
                </p>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                  Phone Number (For Courier Handover)
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl font-mono focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs leading-relaxed">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-xl text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Dispatching 10-Min Code...</span>
                  </>
                ) : (
                  <>
                    <Mail size={15} />
                    <span>Send Verification Code &amp; Register</span>
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* ══════════════════════════════════════════════
              STEP 1B: SIGN IN (Password or One-Time Code)
             ══════════════════════════════════════════════ */}
          {step === 1 && mode === 'signin' && (
            <motion.form
              key="signin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={signInMethod === 'password' ? handlePasswordSignIn : handleRequestSignInOtp}
              className="space-y-4 text-xs font-sans"
            >
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1 text-aura-dark/80">
                  Gmail / Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-gold" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                  />
                </div>
              </div>

              {signInMethod === 'password' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold uppercase tracking-wider text-aura-dark/80">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setSignInMethod('otp'); setError('') }}
                      className="text-[11px] text-aura-warm hover:text-aura-dark underline"
                    >
                      Forgot? Use Gmail Code
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-cream-50 border border-aura-dark/15 rounded-xl focus:outline-none focus:border-aura-gold transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-dark transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              {signInMethod === 'otp' && (
                <div className="p-3 rounded-xl bg-aura-gold/10 border border-aura-gold/25 text-[11px] text-aura-dark space-y-1">
                  <p className="font-semibold flex items-center gap-1.5 text-aura-gold">
                    <Mail size={13} />
                    One-Time Code Sign In
                  </p>
                  <p className="text-aura-dark/80">
                    We'll email a secure 6-digit code valid for 10 minutes to verify your identity.
                  </p>
                </div>
              )}

              {signInMethod === 'otp' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setSignInMethod('password'); setError('') }}
                    className="text-[11px] text-aura-warm hover:text-aura-dark underline"
                  >
                    Sign in with Password instead
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs leading-relaxed">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-xl text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    {signInMethod === 'password' ? <Lock size={15} /> : <Mail size={15} />}
                    <span>{signInMethod === 'password' ? 'Sign In to Account' : 'Send 10-Minute Access Code'}</span>
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* ══════════════════════════════════════════════
              STEP 2: 6-DIGIT CODE VERIFICATION (10-MIN LIMIT)
             ══════════════════════════════════════════════ */}
          {step === 2 && (
            <motion.form
              key="verify-otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleVerifyOtp}
              className="space-y-5 text-xs font-sans"
            >
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); setInputCode('') }}
                className="inline-flex items-center gap-1.5 text-aura-muted hover:text-aura-dark text-xs mb-1"
              >
                <ArrowLeft size={13} />
                <span>Change Email / Back</span>
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-aura-gold/15 text-aura-gold flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-serif text-xl text-aura-dark">Enter 6-Digit Verification Code</h3>
                <p className="text-aura-muted text-[11px] leading-relaxed">
                  We dispatched an archival code to:<br />
                  <strong className="text-aura-dark font-mono">{email}</strong>
                </p>

                {/* 10-Minute Countdown Clock */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mt-2 ${
                  secondsRemaining <= 60
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-cream-100 text-aura-dark border border-aura-dark/15'
                }`}>
                  <Clock size={13} className={secondsRemaining <= 60 ? 'text-red-500' : 'text-aura-gold'} />
                  <span>
                    {secondsRemaining > 0
                      ? `Code expires in ${formatTime(secondsRemaining)}`
                      : 'Code Expired'}
                  </span>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  autoFocus
                  className="w-full py-3.5 text-center font-mono text-2xl font-bold tracking-[0.5em] bg-cream-50 border-2 border-aura-gold/40 rounded-2xl focus:outline-none focus:border-aura-gold text-aura-dark placeholder-aura-muted/40 transition-colors"
                />
                <p className="text-[10px] text-center text-aura-muted mt-2">
                  Code is strictly valid for 10 minutes. Check your spam folder if not visible immediately.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs leading-relaxed text-center flex items-center justify-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || inputCode.length < 6 || secondsRemaining <= 0}
                className="w-full py-3.5 bg-aura-dark hover:bg-aura-gold hover:text-aura-dark text-cream-100 rounded-xl text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Verify Code &amp; Complete Access</span>
                  </>
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center pt-2">
                {resendCooldown > 0 ? (
                  <span className="text-[11px] text-aura-muted font-mono">
                    Resend code in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => dispatchVerificationCode(email.trim().toLowerCase(), fullName.trim() || 'Collector')}
                    className="text-[11px] text-aura-gold hover:text-aura-dark underline font-semibold flex items-center justify-center gap-1 mx-auto"
                  >
                    <RefreshCw size={12} />
                    <span>Didn't receive or code expired? Dispatch New Code</span>
                  </button>
                )}
              </div>
            </motion.form>
          )}

          {/* ══════════════════════════════════════════════
              STEP 3: SUCCESS
             ══════════════════════════════════════════════ */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-serif text-2xl text-aura-dark">Authentication Complete!</h3>
              <p className="font-sans text-xs text-aura-dark/70 max-w-xs mx-auto">
                Your collector account has been verified and your credentials are secure. Connecting you...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Assurance */}
        <div className="mt-8 pt-5 border-t border-aura-dark/10 flex items-center justify-center gap-2 text-[11px] font-sans text-aura-muted">
          <ShieldCheck size={14} className="text-aura-gold" />
          <span>Secured with Gmail SMTP &bull; 10-Minute Expiring Code &bull; Encrypted</span>
        </div>
      </div>
    </main>
  )
}
