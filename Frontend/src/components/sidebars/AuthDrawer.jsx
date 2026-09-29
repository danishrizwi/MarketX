import { useEffect, useState } from 'react'
import { X, User, ArrowRight, Store, Lock, UserPlus, CheckCircle2 } from 'lucide-react'
import { useUI } from '../../context/UIContext'

// ── localStorage helpers ────────────────────────────────────────────────────
const STORAGE_KEY = 'marketx_users'

function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function getUserByPhone(phone) {
  return getAllUsers()[phone] || null
}

function saveUser(userData) {
  const all = getAllUsers()
  all[userData.phone] = userData
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
// ───────────────────────────────────────────────────────────────────────────

// Steps: 'phone' | 'otp' | 'register' | 'profile'
export default function AuthDrawer() {
  const { isAuthDrawerOpen, setIsAuthDrawerOpen, user, setUser, setIsOrdersDrawerOpen, setIsAccountDrawerOpen } = useUI()

  const [step, setStep] = useState('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')

  // Reset state when drawer closes
  useEffect(() => {
    if (!isAuthDrawerOpen) {
      setStep(user ? 'profile' : 'phone')
      setOtp('')
      setError('')
      setFullName('')
    }
  }, [isAuthDrawerOpen, user])

  // If user logs in, switch to profile view
  useEffect(() => {
    if (user && isAuthDrawerOpen) setStep('profile')
  }, [user, isAuthDrawerOpen])

  // ESC closes drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthDrawerOpen) setIsAuthDrawerOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthDrawerOpen, setIsAuthDrawerOpen])

  if (!isAuthDrawerOpen) return null

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSendOtp = (e) => {
    e.preventDefault()
    setError('')
    if (phoneNumber.length === 10) setStep('otp')
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setError('')
    if (otp !== '1234') {
      setError('Invalid OTP. Use test code: 1234')
      return
    }
    const existing = getUserByPhone(phoneNumber)
    if (existing) {
      // Returning user — login directly
      setUser(existing)
      setIsAuthDrawerOpen(false)
    } else {
      // New user — ask for name
      setStep('register')
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    const trimmed = fullName.trim()
    if (!trimmed || trimmed.split(' ').filter(Boolean).length < 1) {
      setError('Please enter your full name.')
      return
    }
    const firstLetter = trimmed[0].toUpperCase()
    const newUser = { name: trimmed, phone: phoneNumber, avatar: firstLetter }
    saveUser(newUser)
    setUser(newUser)
    setIsAuthDrawerOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    setStep('phone')
    setPhoneNumber('')
    setOtp('')
    setFullName('')
    setIsAuthDrawerOpen(false)
  }

  // ── Header label per step ─────────────────────────────────────────────────
  const headerTitle = {
    phone: 'Welcome to MarketX',
    otp: 'Verify Your Number',
    register: 'Create Your Account',
    profile: 'Account Profile',
  }[step]

  const headerSub = {
    phone: 'Log in or sign up to continue',
    otp: 'Enter the OTP sent to your phone',
    register: 'Just one more step — tell us your name',
    profile: 'Manage your orders and settings',
  }[step]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsAuthDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">

          {/* ── Drawer Header ───────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{headerTitle}</h2>
                <p className="text-xs text-slate-300">{headerSub}</p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthDrawerOpen(false)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Drawer Body ─────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* ── STEP: profile ── */}
            {step === 'profile' && user && (
              <div className="space-y-6">
                {/* Avatar card */}
                <div className="flex items-center gap-4 p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/20 select-none">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{user.name}</h3>
                    <p className="text-xs text-gray-500">+91 {user.phone}</p>
                    <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verified Customer
                    </span>
                  </div>
                </div>

                {/* Menu links */}
                <div className="space-y-1 text-sm">
                  {[
                    {
                      label: 'My Orders', badge: '3 active',
                      onClick: () => { setIsAuthDrawerOpen(false); setIsOrdersDrawerOpen(true) }
                    },
                    {
                      label: 'Delivery Addresses', badge: '2 saved',
                      onClick: () => setIsAuthDrawerOpen(false)
                    },
                    {
                      label: 'Account Settings', badge: 'Edit Profile',
                      onClick: () => { setIsAuthDrawerOpen(false); setIsAccountDrawerOpen(true) }
                    },
                    {
                      label: 'Help & Support', badge: '24/7 Helpline',
                      onClick: () => setIsAuthDrawerOpen(false)
                    },
                  ].map(({ label, badge, onClick }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition-colors text-left"
                    >
                      <span>{label}</span>
                      <span className="text-xs text-gray-400">{badge}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-center text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: phone ── */}
            {step === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="text-center pb-1">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Fast & Secure</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">Sign in with Mobile</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    New user? We'll create your account automatically.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-xs font-bold text-gray-600">+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      required
                      autoFocus
                      className="w-full pl-12 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={phoneNumber.length < 10}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-4 border-t border-gray-100">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                    <Store className="w-5 h-5 text-amber-600 shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold text-amber-900">Are you a local shopkeeper?</p>
                      <p className="text-amber-700">Register as a MarketX vendor and start selling.</p>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* ── STEP: otp ── */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="text-center pb-1">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Enter OTP</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Sent to <span className="font-semibold text-gray-700">+91 {phoneNumber}</span>
                    &nbsp;· Test code: <span className="font-bold text-blue-600">1234</span>
                  </p>
                </div>

                <input
                  type="text"
                  maxLength={4}
                  placeholder="_ _ _ _"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                  autoFocus
                  required
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />

                {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={otp.length !== 4}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Verify & Continue
                </button>

                <div className="flex justify-between text-xs text-gray-500">
                  <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError('') }} className="text-blue-600 hover:underline">
                    Change Number
                  </button>
                  <button type="button" onClick={() => alert('New OTP sent: 1234')} className="text-gray-600 hover:text-gray-900 font-medium">
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP: register (new user) ── */}
            {step === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="text-center pb-1">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Create Your Account</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Number <span className="font-semibold text-gray-700">+91 {phoneNumber}</span> verified ✅
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setError('') }}
                    autoFocus
                    required
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">This name will appear on your profile and orders.</p>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={fullName.trim().length < 2}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Create Account & Login
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
