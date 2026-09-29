import { useEffect, useState } from 'react'
import { X, Settings, Save, CheckCircle2, User, Mail, MapPin, Phone } from 'lucide-react'
import { useUI } from '../../context/UIContext'

// ── localStorage helpers (same key used in AuthDrawer) ─────────────────────
const STORAGE_KEY = 'marketx_users'
function getAllUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}
function saveUser(userData) {
  const all = getAllUsers()
  all[userData.phone] = userData
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
// ───────────────────────────────────────────────────────────────────────────

export default function AccountDrawer() {
  const { isAccountDrawerOpen, setIsAccountDrawerOpen, user, setUser } = useUI()

  const [form, setForm]       = useState({ name: '', email: '', address: '', city: '', pincode: '' })
  const [saved, setSaved]     = useState(false)
  const [errors, setErrors]   = useState({})
  const [editing, setEditing] = useState(false)

  // Populate form from user whenever drawer opens
  useEffect(() => {
    if (isAccountDrawerOpen && user) {
      setForm({
        name:    user.name    || '',
        email:   user.email   || '',
        address: user.address || '',
        city:    user.city    || '',
        pincode: user.pincode || '',
      })
      setSaved(false)
      setErrors({})
      setEditing(false)
    }
  }, [isAccountDrawerOpen, user])

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setIsAccountDrawerOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setIsAccountDrawerOpen])

  if (!isAccountDrawerOpen || !user) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setSaved(false)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Full name is required.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Pincode must be 6 digits.'
    return errs
  }

  const handleSave = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const firstLetter = form.name.trim()[0].toUpperCase()
    const updated = {
      ...user,
      name:    form.name.trim(),
      email:   form.email.trim(),
      address: form.address.trim(),
      city:    form.city.trim(),
      pincode: form.pincode.trim(),
      avatar:  firstLetter,
    }
    saveUser(updated)
    setUser(updated)
    setSaved(true)
    setEditing(false)
  }

  const fields = [
    { key: 'name',    label: 'Full Name',    icon: User,    type: 'text',  placeholder: 'e.g. Rahul Sharma',         required: true },
    { key: 'email',   label: 'Email Address',icon: Mail,    type: 'email', placeholder: 'e.g. rahul@email.com',      required: false },
    { key: 'address', label: 'Street Address',icon: MapPin, type: 'text',  placeholder: 'House no., Street, Colony', required: false },
    { key: 'city',    label: 'City',         icon: MapPin,  type: 'text',  placeholder: 'e.g. Ajmer',                required: false },
    { key: 'pincode', label: 'Pincode',      icon: MapPin,  type: 'tel',   placeholder: '6-digit pincode',           required: false },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={() => setIsAccountDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Account Settings</h2>
                <p className="text-xs text-slate-300">View and edit your profile details</p>
              </div>
            </div>
            <button
              onClick={() => setIsAccountDrawerOpen(false)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSave} className="space-y-5">

              {/* Avatar + phone (read-only strip) */}
              <div className="flex items-center gap-4 p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md select-none shrink-0">
                  {user.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">+91 {user.phone}</p>
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Verified Customer
                  </span>
                </div>
              </div>

              {/* Edit / View toggle */}
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="w-full py-2.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                >
                  ✏️ Edit Profile Details
                </button>
              )}

              {/* Fields */}
              <div className="space-y-4">
                {fields.map(({ key, label, icon: Icon, type, placeholder, required }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      {label}
                      {required && <span className="text-red-400">*</span>}
                    </label>

                    {editing ? (
                      <input
                        type={type}
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full px-4 py-2.5 text-sm bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all font-medium
                          ${errors[key]
                            ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-600'}`}
                      />
                    ) : (
                      <div className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl text-gray-700 font-medium min-h-[42px] flex items-center">
                        {form[key] || <span className="text-gray-300 italic text-xs">Not provided</span>}
                      </div>
                    )}

                    {errors[key] && (
                      <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Phone note */}
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Mobile number cannot be changed.
              </p>

              {/* Save / Cancel buttons */}
              {editing && (
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setErrors({}); setSaved(false) }}
                    className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                </div>
              )}

              {/* Success banner */}
              {saved && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in duration-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs font-semibold text-emerald-700">Profile updated successfully!</p>
                </div>
              )}

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
