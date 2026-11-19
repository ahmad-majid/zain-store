import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1️⃣ Check for master admin session
    if (localStorage.getItem('thrift-aura-admin-session') === 'master') {
      setUser({
        id: 'master-admin',
        email: 'admin@thriftaura.com',
        user_metadata: { full_name: 'Store Curator' },
      })
      setProfile({ id: 'master-admin', full_name: 'Store Curator', role: 'admin' })
      setLoading(false)
      return
    }

    // 2️⃣ Check for verified client session
    try {
      const clientSession = JSON.parse(localStorage.getItem('thrift-aura-client-session') || 'null')
      if (clientSession && clientSession.email) {
        // Check session expiry
        if (clientSession.expiresAt && clientSession.expiresAt < Date.now()) {
          localStorage.removeItem('thrift-aura-client-session')
          // fall through to Supabase check
        } else {
          setUser({
            id: clientSession.id || `cl-${Date.now()}`,
            email: clientSession.email,
            user_metadata: {
              full_name: clientSession.fullName || 'Collector',
              phone: clientSession.phone || '',
            },
            isVerified: true,
          })
          setProfile({
            id: clientSession.id || `cl-${Date.now()}`,
            full_name: clientSession.fullName || 'Collector',
            role: 'client',
          })
          setLoading(false)
          return
        }
      }
    } catch (e) {
      console.warn('Failed parsing client session', e)
    }

    // 3️⃣ Fallback to Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (localStorage.getItem('thrift-aura-client-session') || localStorage.getItem('thrift-aura-admin-session')) {
        return
      }
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch (err) {
      setProfile({ id: userId, role: 'user' })
    }
  }

  // ─── Verified Client Session Helpers ───
  function loginVerifiedClient(clientData) {
    // Try to find existing client record to restore data
    let existingRecord = null
    try {
      const all = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      existingRecord = all.find(c => c.email.toLowerCase() === clientData.email.toLowerCase()) || null
    } catch {}

    const client = {
      id: existingRecord?.id || clientData.id || `cl-${Date.now()}`,
      email: clientData.email.toLowerCase(),
      fullName: clientData.fullName || existingRecord?.fullName || 'Collector',
      phone: clientData.phone || existingRecord?.phone || '',
      password: clientData.password || existingRecord?.password || '',
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      authMethod: clientData.password ? 'password_and_otp' : 'gmail_otp',
      registeredAt: existingRecord?.registeredAt || clientData.registeredAt || new Date().toISOString(),
      ordersCount: existingRecord?.ordersCount || clientData.ordersCount || 0,
      totalSpend: existingRecord?.totalSpend || clientData.totalSpend || 0,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    }

    // Save session
    localStorage.setItem('thrift-aura-client-session', JSON.stringify(client))

    // Update global client registry in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      const index = existing.findIndex(c => c.email.toLowerCase() === client.email.toLowerCase())
      if (index >= 0) {
        existing[index] = { ...existing[index], ...client }
      } else {
        existing.unshift(client)
      }
      localStorage.setItem('thrift-aura-clients', JSON.stringify(existing))
    } catch (err) {
      console.warn('Failed updating client registry', err)
    }

    setUser({ id: client.id, email: client.email, user_metadata: { full_name: client.fullName, phone: client.phone }, isVerified: true })
    setProfile({ id: client.id, full_name: client.fullName, role: 'client' })
  }

  async function signUp(email, password, fullName) {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
  }

  async function signIn(email, password) {
    const cleanEmail = email.trim().toLowerCase()

    // 0️⃣ Master Admin credentials (instant local verification, no external network request)
    const MASTER_EMAIL = 'admin@thriftaura.com'
    const OWNER_EMAIL = 'u06626982@gmail.com'
    const MASTER_PASSWORD = 'ThriftAura@2026'

    if ((cleanEmail === MASTER_EMAIL || cleanEmail === OWNER_EMAIL) && password === MASTER_PASSWORD) {
      localStorage.setItem('thrift-aura-admin-session', 'master')
      const adminUser = {
        id: 'master-admin',
        email: cleanEmail,
        user_metadata: { full_name: 'Store Curator' },
      }
      setUser(adminUser)
      setProfile({ id: 'master-admin', full_name: 'Store Curator', role: 'admin' })
      return { data: { user: adminUser }, error: null }
    }

    // 1️⃣ Check registered clients in localStorage
    try {
      const clients = JSON.parse(localStorage.getItem('thrift-aura-clients') || '[]')
      const localMatch = clients.find(
        (c) => c.email.toLowerCase() === cleanEmail && c.password === password
      )
      if (localMatch) {
        loginVerifiedClient(localMatch)
        return { data: { user: localMatch }, error: null }
      }
    } catch (e) {
      console.warn('Failed local client password check', e)
    }

    // 2️⃣ Pre-seeded demo collector account fallback
    if (cleanEmail === 'collector@gmail.com' && password === 'Collector@2026') {
      const demoClient = {
        id: 'cl-89421',
        fullName: 'Elena Rostova',
        email: 'collector@gmail.com',
        phone: '+92 300 8472910',
        password: 'Collector@2026',
        address: 'House 42, Street 11, Sector F-7/2',
        city: 'Islamabad',
        isVerified: true,
        ordersCount: 2,
        totalSpend: 24500,
      }
      loginVerifiedClient(demoClient)
      return { data: { user: demoClient }, error: null }
    }

    // 3️⃣ Only query Supabase auth if real (non-placeholder) credentials are configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const res = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
        return res
      } catch (err) {
        return { data: { user: null }, error: err }
      }
    }

    // Offline / local fallback error message
    return {
      data: { user: null },
      error: new Error('Invalid email or password. Please verify your credentials or click "Sign in with One-Time Gmail Code".')
    }
  }

  async function signOut() {
    localStorage.removeItem('thrift-aura-admin-session')
    localStorage.removeItem('thrift-aura-client-session')
    setUser(null)
    setProfile(null)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      // ignore
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginVerifiedClient,
        signUp,
        signIn,
        signOut,
        setUser,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
