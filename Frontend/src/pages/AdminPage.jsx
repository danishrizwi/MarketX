import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard, Package, ShoppingBag, LogOut, Plus, Trash2,
  ChevronDown, CheckCircle2, Clock, Truck, MapPin,
  TrendingUp, RefreshCw, X, Save, Image,
  IndianRupee, Users, ArrowUpRight, ArrowDownRight, Edit3, Check,
  Search, Mail, Phone, Eye, Layers
} from 'lucide-react'
import { useCart, loadOrders, loadProducts, ORDER_STATUSES } from '../context/CartContext'

// ── Admin credentials ─────────────────────────────────────────────────────────
const ADMIN_PASS = 'admin123'
const USERS_KEY  = 'marketx_users'

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {}
  } catch {
    return {}
  }
}

function saveStoredUsers(data) {
  localStorage.setItem(USERS_KEY, JSON.stringify(data))
  window.dispatchEvent(new Event('marketx-users-updated'))
}

function getEnrichedUsersList(orders) {
  const usersMap = getStoredUsers()
  
  // Also collect any users that might have ordered as guest or missing from usersMap
  orders.forEach(o => {
    if (o.userInfo && o.userInfo.phone && !usersMap[o.userInfo.phone]) {
      usersMap[o.userInfo.phone] = {
        name: o.userInfo.name || 'Customer',
        phone: o.userInfo.phone,
        avatar: (o.userInfo.name || 'C')[0].toUpperCase(),
        email: o.userInfo.email || '',
        address: o.userInfo.address || '',
        city: o.userInfo.city || '',
        pincode: o.userInfo.pincode || '',
        createdAt: o.createdAt || o.date,
      }
    }
  })

  return Object.values(usersMap).map(u => {
    const userOrders = orders.filter(o => o.userInfo?.phone === u.phone)
    const totalSpent = userOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)
    return {
      ...u,
      ordersCount: userOrders.length,
      totalSpent,
      userOrders,
    }
  })
}

// ── Delivery partners pool ────────────────────────────────────────────────────
const DELIVERY_PARTNERS = [
  { id: 'dp1', name: 'Raju Kumar',   phone: '9876543210', rating: 4.8 },
  { id: 'dp2', name: 'Suresh Singh', phone: '9123456789', rating: 4.6 },
  { id: 'dp3', name: 'Mohan Lal',    phone: '9988776655', rating: 4.9 },
  { id: 'dp4', name: 'Vijay Sharma', phone: '9871234560', rating: 4.7 },
]

// ── Status styles ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  'Pending':        'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Confirmed':      'bg-blue-50 text-blue-700 border-blue-200',
  'Packed':         'bg-purple-50 text-purple-700 border-purple-200',
  'Shipped':        'bg-indigo-50 text-indigo-700 border-indigo-200',
  'On the Way':     'bg-orange-50 text-orange-700 border-orange-200',
  'About to Reach': 'bg-teal-50 text-teal-700 border-teal-200',
  'Delivered':      'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const CATEGORIES = ['vegetables', 'fruits', 'dairy', 'snacks', 'beverages', 'grains']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ── Revenue helpers ───────────────────────────────────────────────────────────
function revenueFor(orders, from, to) {
  return orders
    .filter(o => o.status !== 'Cancelled')
    .filter(o => {
      const d = new Date(o.createdAt || o.date)
      return d >= from && d <= to
    })
    .reduce((a, o) => a + o.total, 0)
}

function getMonthlyRevenue(orders, monthsBack = 6) {
  const result = []
  const now = new Date()
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const from = new Date(d.getFullYear(), d.getMonth(), 1)
    const to   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
    result.push({
      label: MONTH_NAMES[d.getMonth()],
      value: revenueFor(orders, from, to),
      isCurrentMonth: i === 0,
    })
  }
  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Login
// ─────────────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (pass === ADMIN_PASS) { onLogin(); setError('') }
    else setError('Wrong password. Try: admin123')
  }
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">MarketX Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Enter admin password to continue</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            placeholder="Admin Password"
            value={pass}
            onChange={e => { setPass(e.target.value); setError('') }}
            autoFocus
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-gray-50"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
            Login to Admin Panel
          </button>
        </form>
        <p className="text-center text-xs text-gray-400">Default password: <span className="font-mono font-bold text-gray-600">admin123</span></p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini SVG Bar Chart
// ─────────────────────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barW = 100 / data.length
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => {
        const h = Math.max((d.value / maxVal) * 100, 4)
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t-lg transition-all ${d.isCurrentMonth ? 'bg-blue-600' : 'bg-blue-200'}`}
              style={{ height: `${h}%` }}
              title={`₹${d.value}`}
            />
            <span className="text-[9px] text-gray-400 font-medium">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
function Dashboard({ orders, products, onGoToOrders, onGoToUsers, usersCount }) {
  const now       = new Date()
  const todayFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const monFrom   = new Date(now.getFullYear(), now.getMonth(), 1)
  const yearFrom  = new Date(now.getFullYear(), 0, 1)

  const totalRev   = orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0)
  const todayRev   = revenueFor(orders, todayFrom, now)
  const monthRev   = revenueFor(orders, monFrom, now)
  const yearRev    = revenueFor(orders, yearFrom, now)
  const totalOrds  = orders.length
  const pendingOrds = orders.filter(o => o.status === 'Pending').length
  const delivOrds  = orders.filter(o => o.status === 'Delivered').length
  const customers  = usersCount ?? new Set(orders.map(o => o.userInfo?.phone).filter(Boolean)).size

  const monthlyData = getMonthlyRevenue(orders, 6)

  const inStockCount = products.filter(p => (p.stock ?? 1) > 0).length
  const outOfStock   = products.filter(p => (p.stock ?? 1) <= 0).length

  return (
    <div className="space-y-5">
      {/* ── Hero Revenue Card ── */}
      <div className="relative bg-gradient-to-br from-slate-800 to-blue-900 rounded-3xl p-6 overflow-hidden text-white">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500/20 rounded-full" />
        <div className="absolute -right-4 -bottom-6 w-28 h-28 bg-purple-500/20 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
              <p className="text-4xl font-black mt-1">₹{totalRev.toLocaleString('en-IN')}</p>
              <p className="text-blue-300 text-xs mt-1">All time · {totalOrds} orders</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <IndianRupee className="w-7 h-7 text-blue-200" />
            </div>
          </div>

          {/* Revenue breakdown pills */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Today',       val: todayRev },
              { label: 'This Month',  val: monthRev },
              { label: 'This Year',   val: yearRev  },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                <p className="text-[10px] text-blue-300 font-semibold">{label}</p>
                <p className="text-sm font-black text-white">₹{val.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Monthly chart ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">Monthly Revenue</h3>
            <p className="text-xs text-gray-400">Last 6 months</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-blue-600">₹{monthRev.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-gray-400">{MONTH_NAMES[now.getMonth()]} {now.getFullYear()}</p>
          </div>
        </div>
        {monthlyData.every(d => d.value === 0) ? (
          <div className="h-20 flex items-center justify-center text-xs text-gray-400">No revenue data yet</div>
        ) : (
          <BarChart data={monthlyData} />
        )}
      </div>

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pending Orders — clickable */}
        <button
          onClick={() => onGoToOrders('Pending')}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-left hover:bg-yellow-100 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            {pendingOrds > 0 && <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />}
          </div>
          <p className="text-2xl font-black text-yellow-700">{pendingOrds}</p>
          <p className="text-xs text-yellow-600 font-semibold mt-0.5">Pending Orders</p>
          <p className="text-[10px] text-yellow-500 mt-1 group-hover:underline">Click to view →</p>
        </button>

        {/* Delivered */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-2xl font-black text-emerald-700">{delivOrds}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-0.5">Delivered</p>
          <p className="text-[10px] text-emerald-500 mt-1">{totalOrds > 0 ? Math.round((delivOrds/totalOrds)*100) : 0}% success rate</p>
        </div>

        {/* Customers / Users — clickable */}
        <button
          onClick={onGoToUsers}
          className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-left hover:bg-purple-100 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-[10px] text-purple-600 font-semibold group-hover:underline">View all →</span>
          </div>
          <p className="text-2xl font-black text-purple-700">{customers}</p>
          <p className="text-xs text-purple-600 font-semibold mt-0.5">Registered Users</p>
          <p className="text-[10px] text-purple-500 mt-1">Click to manage</p>
        </button>

        {/* Products */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <Package className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-2xl font-black text-blue-700">{products.length}</p>
          <p className="text-xs text-blue-600 font-semibold mt-0.5">Products</p>
          <p className="text-[10px] text-blue-500 mt-1">
            {outOfStock > 0 ? <span className="text-red-500">{outOfStock} out of stock</span> : `${inStockCount} in stock`}
          </p>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <button onClick={() => onGoToOrders('All')} className="text-xs text-blue-600 font-semibold hover:underline">View all →</button>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No orders yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 6).map(order => (
              <div key={order.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-900">#{order.id}</p>
                    {order.status === 'Pending' && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />}
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">
                    {order.userInfo?.name || 'Guest'} · {order.date} · {order.items.length} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-gray-900">₹{order.total}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Stock Alerts ── */}
      {(products.filter(p => (p.stock ?? 1) <= 5).length > 0) && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-3">⚠️ Low / Out of Stock Alerts</h3>
          <div className="space-y-2">
            {products.filter(p => (p.stock ?? 1) <= 5).map(p => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">{p.name}</span>
                <span className={`font-black px-2 py-0.5 rounded-full ${(p.stock ?? 0) === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  {(p.stock ?? 0) === 0 ? 'Out of Stock' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Products Tab — with category filter + stock management
// ─────────────────────────────────────────────────────────────────────────────
function ProductsTab({ products, categories = [], onAdd, onDelete, onStockUpdate, initialFilter = 'All' }) {
  const empty = {
    id: '', name: '', unit: '1 KG', price: '', originalPrice: '',
    rating: '4.5', reviews: '0', category: categories[0]?.id || 'vegetables',
    image: '', description: '', inStock: true, stock: '50'
  }
  const [form,     setForm]     = useState(empty)
  const [adding,   setAdding]   = useState(false)
  const [errors,   setErrors]   = useState({})
  const [catFilter, setCatFilter] = useState(initialFilter)
  const [editStock, setEditStock] = useState({}) // { productId: tempValue }
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null)

  useEffect(() => {
    if (initialFilter) setCatFilter(initialFilter)
  }, [initialFilter])

  const change = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Required'
    if (!form.price)        e.price = 'Required'
    if (!form.image.trim()) e.image = 'Required'
    return e
  }

  const handleAdd = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const pct = form.originalPrice && form.price
      ? Math.round((1 - form.price / form.originalPrice) * 100)
      : null
    const stockNum = Math.max(0, parseInt(form.stock) || 0)
    onAdd({
      ...form,
      id: `admin-${Date.now()}`,
      price:         Number(form.price),
      originalPrice: Number(form.originalPrice) || null,
      discount:      pct ? `${pct}% OFF` : '',
      rating:        Number(form.rating),
      reviews:       Number(form.reviews),
      stock:         stockNum,
      inStock:       stockNum > 0,
    })
    setForm(empty)
    setAdding(false)
  }

  const saveStock = (productId) => {
    const val = editStock[productId]
    if (val !== undefined) {
      onStockUpdate(productId, val)
      setEditStock(prev => { const n = { ...prev }; delete n[productId]; return n })
    }
  }

  const filteredProducts = catFilter === 'All'
    ? products
    : products.filter(p => p.category === catFilter)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-900">Products ({products.length})</h2>
        <button
          onClick={() => setAdding(a => !a)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
        >
          {adding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {adding ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...categories.map(c => c.id)].map(catId => {
          const catObj = categories.find(c => c.id === catId)
          const label = catId === 'All' ? 'All' : (catObj?.name || catId)
          return (
            <button
              key={catId}
              onClick={() => setCatFilter(catId)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize transition-all cursor-pointer ${
                catFilter === catId
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-blue-100 shadow-xs p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <h3 className="font-bold text-gray-900 text-base">New Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'name',  label: 'Product Name *', type: 'text',   placeholder: 'e.g. Apple (Shimla)' },
              { key: 'unit',  label: 'Unit',            type: 'text',   placeholder: 'e.g. 1 KG' },
              { key: 'price', label: 'Price (₹) *',     type: 'number', placeholder: '0' },
              { key: 'originalPrice', label: 'MRP (₹)', type: 'number', placeholder: '0' },
              { key: 'stock', label: 'Stock Qty',       type: 'number', placeholder: '50' },
              { key: 'rating', label: 'Rating',         type: 'number', placeholder: '4.5' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => change(key, e.target.value)}
                  placeholder={placeholder}
                  step={type === 'number' ? '0.1' : undefined}
                  className={`w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${errors[key] ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors[key] && <p className="text-[11px] text-red-500 mt-0.5">{errors[key]}</p>}
              </div>
            ))}
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => change('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 capitalize"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name || c.id}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Image URL */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Image URL *</label>
            <input
              type="url"
              value={form.image}
              onChange={e => change('image', e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className={`w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${errors.image ? 'border-red-400' : 'border-gray-200'}`}
            />
          </div>
          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => change('description', e.target.value)}
              placeholder="Short product description..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
            />
          </div>
          {/* Preview */}
          {form.image && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <img src={form.image} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-gray-200" onError={e => e.target.style.display='none'} />
              <div>
                <p className="text-sm font-bold text-gray-900">{form.name || 'Product Name'}</p>
                <p className="text-xs text-gray-500">{form.unit} · ₹{form.price} · Stock: {form.stock || 50}</p>
              </div>
            </div>
          )}
          <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all">
            <Save className="w-4 h-4" /> Save Product
          </button>
        </form>
      )}

      {/* Product list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {catFilter === 'All' ? `All Products (${filteredProducts.length})` : `${catFilter.charAt(0).toUpperCase() + catFilter.slice(1)} (${filteredProducts.length})`}
          </p>
          <p className="text-[11px] text-gray-400">Click stock to edit</p>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center">
            <Image className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No products in this category yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredProducts.map(p => {
              const stockVal = p.stock ?? 0
              const isEditingStock = editStock[p.id] !== undefined
              return (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.unit} · <span className="font-medium text-gray-700">₹{p.price}</span> · <span className="capitalize">{p.category}</span></p>
                  </div>

                  {/* Stock inline edit */}
                  <div className="flex items-center gap-1.5">
                    {isEditingStock ? (
                      <>
                        <input
                          type="number"
                          min="0"
                          value={editStock[p.id]}
                          onChange={e => setEditStock(prev => ({ ...prev, [p.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') saveStock(p.id); if (e.key === 'Escape') setEditStock(prev => { const n = {...prev}; delete n[p.id]; return n }) }}
                          autoFocus
                          className="w-16 px-2 py-1 text-xs border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button onClick={() => saveStock(p.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditStock(prev => { const n = {...prev}; delete n[p.id]; return n })} className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditStock(prev => ({ ...prev, [p.id]: String(stockVal) }))}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border cursor-pointer transition-all hover:opacity-80 ${
                          stockVal === 0        ? 'bg-red-50 text-red-600 border-red-200' :
                          stockVal <= 5         ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          stockVal <= 20        ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                  'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                        title="Click to edit stock"
                      >
                        {stockVal === 0 ? 'Out of Stock' : `Qty: ${stockVal}`}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmProduct(p)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Delete Product Confirmation Modal ── */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setDeleteConfirmProduct(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-gray-900">Delete Product?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to delete this product? It will be removed from MarketX immediately.
              </p>
            </div>

            {/* Product mini-preview card */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <img
                src={deleteConfirmProduct.image}
                alt={deleteConfirmProduct.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-gray-900 truncate">{deleteConfirmProduct.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {deleteConfirmProduct.unit} · <span className="font-semibold text-gray-700">₹{deleteConfirmProduct.price}</span> · <span className="capitalize">{deleteConfirmProduct.category}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deleteConfirmProduct.id)
                  setDeleteConfirmProduct(null)
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-red-500/25"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders Tab
// ─────────────────────────────────────────────────────────────────────────────
function OrdersTab({ orders, onStatusUpdate, initialFilter = 'All' }) {
  const [filter,   setFilter]   = useState(initialFilter)
  const [expanded, setExpanded] = useState(null)
  const [assignMap, setAssignMap] = useState({})

  // Sync initialFilter when changed from dashboard
  useEffect(() => { setFilter(initialFilter) }, [initialFilter])

  const filterOptions = ['All', ...ORDER_STATUSES]
  const visible = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  const nextStatus = (current) => {
    const idx = ORDER_STATUSES.indexOf(current)
    return idx < ORDER_STATUSES.length - 1 ? ORDER_STATUSES[idx + 1] : null
  }

  const handleAdvance = (order) => {
    const next = nextStatus(order.status)
    if (!next) return
    const partner = assignMap[order.id]
      ? DELIVERY_PARTNERS.find(p => p.id === assignMap[order.id])
      : order.deliveryPartner
    onStatusUpdate(order.id, next, next === 'Shipped' ? partner : undefined)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-900">Orders ({orders.length})</h2>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map(f => {
            const cnt = f === 'All' ? orders.length : orders.filter(o => o.status === f).length
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
              >
                {f} {cnt > 0 && <span className={`ml-1 ${filter === f ? 'text-blue-200' : 'text-gray-400'}`}>({cnt})</span>}
              </button>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
          No orders for this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(order => {
            const isOpen  = expanded === order.id
            const next    = nextStatus(order.status)
            const isDone  = order.status === 'Delivered'
            const needsDP = ['Confirmed', 'Packed'].includes(order.status)

            return (
              <div key={order.id} className={`bg-white rounded-2xl border shadow-xs overflow-hidden transition-all ${
                order.status === 'Pending' ? 'border-yellow-300 shadow-yellow-100' : 'border-gray-100'
              }`}>
                {/* NEW ORDER banner */}
                {order.status === 'Pending' && (
                  <div className="flex items-center justify-between px-5 py-2 bg-gradient-to-r from-yellow-400 to-orange-400">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-2 h-2 bg-white rounded-full animate-ping" />
                      <span className="text-xs font-black text-white">🔔 NEW ORDER</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onStatusUpdate(order.id, 'Confirmed') }}
                      className="text-[11px] font-black bg-white text-orange-600 px-3 py-1 rounded-full hover:bg-orange-50 transition-colors cursor-pointer shadow-sm"
                    >
                      ✅ Confirm Now
                    </button>
                  </div>
                )}

                {/* Order row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {order.status}
                      </span>
                      {order.paymentMethod === 'cash' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">COD</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.date} · {order.items.length} item(s) · ₹{order.total}
                      {order.userInfo?.name ? ` · ${order.userInfo.name}` : ''}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4 animate-in slide-in-from-top-1 duration-150">
                    {/* Items */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Items</p>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />}
                          <div className="flex-1 text-xs text-gray-700">
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-gray-400"> × {item.qty} ({item.unit})</span>
                          </div>
                          <span className="text-xs font-bold text-gray-900">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-1 border-t border-gray-100 text-xs font-bold text-gray-900">
                        <span>Total</span><span>₹{order.total}</span>
                      </div>
                    </div>

                    {/* Customer Details */}
                    {order.userInfo ? (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-2">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">👤 Customer Details</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                          <div><p className="text-gray-400">Name</p><p className="font-semibold text-gray-900">{order.userInfo.name || '—'}</p></div>
                          <div><p className="text-gray-400">Phone</p><p className="font-semibold text-gray-900">{order.userInfo.phone ? `+91 ${order.userInfo.phone}` : '—'}</p></div>
                          <div><p className="text-gray-400">Email</p><p className="font-semibold text-gray-900">{order.userInfo.email || '—'}</p></div>
                          <div><p className="text-gray-400">City</p><p className="font-semibold text-gray-900">{order.userInfo.city || '—'}</p></div>
                          {order.userInfo.address && (
                            <div className="col-span-2"><p className="text-gray-400">Address</p><p className="font-semibold text-gray-900">{order.userInfo.address}{order.userInfo.pincode ? ` — ${order.userInfo.pincode}` : ''}</p></div>
                          )}
                          <div><p className="text-gray-400">Payment</p><p className="font-semibold text-gray-900 capitalize">
                            {order.paymentMethod === 'cash' ? '💵 Cash on Delivery' : order.paymentMethod === 'phonepe' ? '💜 PhonePe' : order.paymentMethod === 'gpay' ? '🔵 Google Pay' : order.paymentMethod === 'paytm' ? '🔷 Paytm' : order.paymentMethod}
                          </p></div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400 text-center">No customer info (guest order)</div>
                    )}

                    {/* Status timeline */}
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status Timeline</p>
                      <div className="flex flex-wrap gap-2">
                        {ORDER_STATUSES.map((s, idx) => {
                          const reached   = ORDER_STATUSES.indexOf(order.status) >= idx
                          const histItem  = order.statusHistory?.find(h => h.status === s)
                          return (
                            <div key={s} className="flex items-center gap-1">
                              <div className={`w-2.5 h-2.5 rounded-full border-2 ${reached ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`} />
                              <div>
                                <p className={`text-[10px] font-semibold ${reached ? 'text-blue-700' : 'text-gray-400'}`}>{s}</p>
                                {histItem && <p className="text-[9px] text-gray-400">{new Date(histItem.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>}
                              </div>
                              {idx < ORDER_STATUSES.length - 1 && <div className={`w-4 h-px ${reached && ORDER_STATUSES.indexOf(order.status) > idx ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Delivery partner */}
                    {order.deliveryPartner && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">{order.deliveryPartner.name[0]}</div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{order.deliveryPartner.name}</p>
                          <p className="text-[11px] text-gray-500">{order.deliveryPartner.phone} · ⭐ {order.deliveryPartner.rating}</p>
                        </div>
                        <span className="ml-auto text-[11px] font-semibold text-blue-600">Delivery Partner</span>
                      </div>
                    )}

                    {/* Assign delivery partner */}
                    {needsDP && !order.deliveryPartner && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Assign Delivery Partner (required for Shipped step)</p>
                        <select
                          value={assignMap[order.id] || ''}
                          onChange={e => setAssignMap(m => ({ ...m, [order.id]: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="">Select partner...</option>
                          {DELIVERY_PARTNERS.map(p => (
                            <option key={p.id} value={p.id}>{p.name} · {p.phone} · ⭐{p.rating}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Action */}
                    {!isDone ? (
                      <button
                        onClick={() => handleAdvance(order)}
                        disabled={!next}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {next ? `Mark as "${next}"` : 'Fully Delivered'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <p className="text-xs font-semibold text-emerald-700">Order fully delivered ✅</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Categories Tab — Dynamic Add & Remove
// ─────────────────────────────────────────────────────────────────────────────
function CategoriesTab({ categories = [], products = [], onAddCategory, onDeleteCategory, onGoToProductsWithCategory }) {
  const empty = { name: '', id: '', image: '', subcategories: '' }
  const [form, setForm] = useState(empty)
  const [adding, setAdding] = useState(false)
  const [errors, setErrors] = useState({})
  const [deleteConfirmCat, setDeleteConfirmCat] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleNameChange = (name) => {
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    setForm(prev => ({ ...prev, name, id: prev.idManual ? prev.id : autoSlug }))
    setErrors(prev => ({ ...prev, name: '' }))
  }

  const handleIdChange = (id) => {
    setForm(prev => ({ ...prev, id, idManual: true }))
    setErrors(prev => ({ ...prev, id: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Category name is required'
    if (!form.id.trim()) errs.id = 'Category ID/slug is required'
    if (categories.some(c => c.id === form.id.trim().toLowerCase())) errs.id = 'This Category ID already exists'
    return errs
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const subcats = form.subcategories
      ? form.subcategories.split(',').map(s => s.trim()).filter(Boolean)
      : []

    onAddCategory({
      id: form.id.trim().toLowerCase(),
      name: form.name.trim(),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
      subcategories: subcats,
      count: '0 Products'
    })

    setForm(empty)
    setAdding(false)
  }

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Categories ({categories.length})</h2>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Live Categories
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Manage store categories, banner images, and subcategory tags</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <button
            onClick={() => setAdding(a => !a)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            {adding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {adding ? 'Cancel' : 'Add Category'}
          </button>
        </div>
      </div>

      {/* Add Category Form */}
      {adding && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-blue-100 shadow-xs p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <h3 className="font-bold text-gray-900 text-base">New Category</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Category Name *</label>
              <input
                type="text"
                placeholder="e.g. Snacks & Namkeen"
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Category ID / Slug *</label>
              <input
                type="text"
                placeholder="e.g. snacks"
                value={form.id}
                onChange={e => handleIdChange(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono text-xs ${errors.id ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.id && <p className="text-[11px] text-red-500 mt-0.5">{errors.id}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Subcategories (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Chips & Crisps, Biscuits, Sweets, Namkeen"
                value={form.subcategories}
                onChange={e => setForm(p => ({ ...p, subcategories: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Image Preview */}
          {form.image && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <img
                src={form.image}
                alt="preview"
                className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div>
                <p className="text-sm font-bold text-gray-900">{form.name || 'Category Name'}</p>
                <p className="text-xs text-gray-500 font-mono">ID: {form.id || 'slug'}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Save className="w-4 h-4" /> Save Category
          </button>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cat => {
          const prodsCount = products.filter(p => p.category === cat.id).length

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shrink-0"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80' }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base truncate">{cat.name}</h3>
                  <p className="text-[11px] font-mono text-gray-400 mt-0.5">id: {cat.id}</p>
                  <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {prodsCount} {prodsCount === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
              </div>

              {/* Subcategories tags */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.subcategories.slice(0, 4).map((sub, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100">
                      {sub}
                    </span>
                  ))}
                  {cat.subcategories.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-gray-400 font-semibold">
                      +{cat.subcategories.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => onGoToProductsWithCategory(cat.id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  View Products ({prodsCount}) →
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmCat(cat)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
          <Layers className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-600">No categories found</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add Category" above to create one.</p>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setDeleteConfirmCat(null)} />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-gray-900">Delete Category?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-gray-800">"{deleteConfirmCat.name}"</span>? It will be removed from navigation and categories list.
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmCat(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCategory(deleteConfirmCat.id)
                  setDeleteConfirmCat(null)
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-red-500/25"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Users Tab
// ─────────────────────────────────────────────────────────────────────────────
function UsersTab({ users, orders, onRefreshUsers, onGoToOrders }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null)

  const filtered = users.filter(u => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return true
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.city && u.city.toLowerCase().includes(q)) ||
      (u.address && u.address.toLowerCase().includes(q))
    )
  })

  const handleDeleteUser = (phone) => {
    const map = getStoredUsers()
    delete map[phone]
    saveStoredUsers(map)
    onRefreshUsers()
    setDeleteConfirmUser(null)
    if (selectedUser?.phone === phone) setSelectedUser(null)
  }

  // Summary stats
  const totalUsers = users.length
  const activeBuyers = users.filter(u => u.ordersCount > 0).length
  const totalSpentByAll = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0)

  return (
    <div className="space-y-5">
      {/* Top bar with Title and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Registered Users</h2>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {totalUsers} {totalUsers === 1 ? 'User' : 'Users'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Manage customer profiles, contact info, and their order histories</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Registered</p>
            <p className="text-lg font-black text-gray-900">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Active Buyers</p>
            <p className="text-lg font-black text-gray-900">{activeBuyers}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Customer Spending</p>
            <p className="text-lg font-black text-gray-900">₹{totalSpentByAll.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Users List / Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No users found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm ? 'Try a different search keyword' : 'Users who register or login will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((user) => {
              const avatarColor = [
                'bg-blue-600', 'bg-emerald-600', 'bg-purple-600',
                'bg-orange-600', 'bg-rose-600', 'bg-indigo-600'
              ][Math.abs(user.phone?.charCodeAt(0) || 0) % 6]

              return (
                <div key={user.phone} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors">
                  {/* Left: Avatar & Basic info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl ${avatarColor} text-white flex items-center justify-center font-black text-base shadow-xs shrink-0`}>
                      {user.avatar || (user.name ? user.name[0].toUpperCase() : 'U')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{user.name || 'Unnamed User'}</h4>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          +91 {user.phone}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                        {user.email ? (
                          <span className="flex items-center gap-1 text-gray-600 truncate max-w-[200px]">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            {user.email}
                          </span>
                        ) : null}
                        {user.city || user.address ? (
                          <span className="flex items-center gap-1 text-gray-600 truncate max-w-[240px]">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            {[user.address, user.city, user.pincode].filter(Boolean).join(', ')}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">No address saved</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                        {user.ordersCount} {user.ordersCount === 1 ? 'order' : 'orders'}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ₹{user.totalSpent}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                        title="View details & orders"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmUser(user)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Remove user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── User Details Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                  {selectedUser.avatar || (selectedUser.name ? selectedUser.name[0].toUpperCase() : 'U')}
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedUser.name || 'User Profile'}</h3>
                  <p className="text-xs text-slate-300">+91 {selectedUser.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Profile Details Grid */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Information</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block">Full Name</span>
                    <span className="font-bold text-gray-900 text-sm">{selectedUser.name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Phone Number</span>
                    <span className="font-bold text-gray-900 text-sm">+91 {selectedUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Email Address</span>
                    <span className="font-semibold text-gray-800">{selectedUser.email || 'None provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">City</span>
                    <span className="font-semibold text-gray-800">{selectedUser.city || 'Ajmer'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block">Delivery Address</span>
                    <span className="font-semibold text-gray-800">
                      {[selectedUser.address, selectedUser.city, selectedUser.pincode].filter(Boolean).join(', ') || 'No address saved'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl">
                  <p className="text-xs text-blue-600 font-semibold">Total Orders Placed</p>
                  <p className="text-2xl font-black text-blue-900 mt-1">{selectedUser.ordersCount}</p>
                </div>
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <p className="text-xs text-emerald-600 font-semibold">Total Spent</p>
                  <p className="text-2xl font-black text-emerald-900 mt-1">₹{selectedUser.totalSpent}</p>
                </div>
              </div>

              {/* User's Order History */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order History</p>
                {(!selectedUser.userOrders || selectedUser.userOrders.length === 0) ? (
                  <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-xl text-center">
                    This user has not placed any orders yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedUser.userOrders.map((ord) => (
                      <div key={ord.id} className="p-3.5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-900">#{ord.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[ord.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {ord.date} · {ord.items.length} item(s) · {ord.paymentMethod === 'cash' ? 'COD' : ord.paymentMethod?.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-gray-900">₹{ord.total}</p>
                          <button
                            onClick={() => {
                              setSelectedUser(null)
                              onGoToOrders(ord.status)
                            }}
                            className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            View in Orders →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <button
                onClick={() => setDeleteConfirmUser(selectedUser)}
                className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
              >
                Delete User
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Delete User Confirmation Modal ── */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setDeleteConfirmUser(null)} />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-gray-900">Remove User?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to remove <span className="font-semibold text-gray-800">{deleteConfirmUser.name || deleteConfirmUser.phone}</span> from registered users?
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(deleteConfirmUser.phone)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-red-500/25"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Admin Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { orders, updateOrderStatus, addProduct, deleteProduct, updateProductStock } = useCart()
  const [authed,      setAuthed]      = useState(() => sessionStorage.getItem('mx_admin') === '1')
  const [tab,         setTab]         = useState('dashboard')
  const [products,    setProducts]    = useState([])
  const [ordersFilter, setOrdersFilter] = useState('All')
  const [usersList,   setUsersList]   = useState(() => getEnrichedUsersList(orders))

  const refreshProducts = useCallback(() => {
    const stored = loadProducts() || []
    setProducts(stored)
  }, [])

  const refreshUsers = useCallback(() => {
    setUsersList(getEnrichedUsersList(orders))
  }, [orders])

  useEffect(() => {
    refreshProducts()
    window.addEventListener('marketx-products-updated', refreshProducts)
    return () => window.removeEventListener('marketx-products-updated', refreshProducts)
  }, [refreshProducts])

  useEffect(() => {
    refreshUsers()
    window.addEventListener('marketx-users-updated', refreshUsers)
    return () => window.removeEventListener('marketx-users-updated', refreshUsers)
  }, [refreshUsers])

  const handleLogin  = () => { sessionStorage.setItem('mx_admin', '1'); setAuthed(true) }
  const handleLogout = () => { sessionStorage.removeItem('mx_admin'); setAuthed(false) }

  const handleAddProduct    = (p) => { addProduct(p); refreshProducts() }
  const handleDeleteProduct = (id) => { deleteProduct(id); refreshProducts() }
  const handleStockUpdate   = (id, qty) => { updateProductStock(id, qty); refreshProducts() }

  const goToOrders = (filter) => { setOrdersFilter(filter); setTab('orders') }
  const goToUsers  = () => setTab('users')

  if (!authed) return <AdminLogin onLogin={handleLogin} />

  const pendingCount = orders.filter(o => o.status === 'Pending').length

  const TABS = [
    { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, badge: null },
    { id: 'products',  label: 'Products',   icon: Package,         badge: null },
    { id: 'orders',    label: 'Orders',     icon: ShoppingBag,     badge: pendingCount > 0 ? pendingCount : null },
    { id: 'users',     label: 'Users',      icon: Users,           badge: usersList.length > 0 ? usersList.length : null },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col shrink-0 hidden lg:flex">
        <div className="px-6 py-5 border-b border-slate-800">
          <p className="text-xl font-black">Market<span className="text-orange-500">X</span></p>
          <p className="text-xs text-slate-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge !== null && badge !== undefined && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center ${
                  id === 'orders' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-200'
                }`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-slate-800 space-y-1">
          <a href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <ShoppingBag className="w-4 h-4" /> Back to Store
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/30 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between lg:hidden">
          <p className="font-black text-gray-900">MarketX <span className="text-orange-500">Admin</span></p>
          <div className="flex items-center gap-1">
            {TABS.map(({ id, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative p-2 rounded-xl transition-all ${tab === id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Icon className="w-4 h-4" />
                {badge && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">{badge}</span>}
              </button>
            ))}
            <a href="/" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100"><ShoppingBag className="w-4 h-4" /></a>
            <button onClick={handleLogout} className="p-2 rounded-xl text-red-400 hover:bg-red-50"><LogOut className="w-4 h-4" /></button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {tab === 'dashboard' && (
            <Dashboard
              orders={orders}
              products={products}
              onGoToOrders={goToOrders}
              onGoToUsers={goToUsers}
              usersCount={usersList.length}
            />
          )}
          {tab === 'products'  && (
            <ProductsTab
              products={products}
              onAdd={handleAddProduct}
              onDelete={handleDeleteProduct}
              onStockUpdate={handleStockUpdate}
            />
          )}
          {tab === 'orders'    && (
            <OrdersTab
              orders={orders}
              onStatusUpdate={updateOrderStatus}
              initialFilter={ordersFilter}
            />
          )}
          {tab === 'users'     && (
            <UsersTab
              users={usersList}
              orders={orders}
              onRefreshUsers={refreshUsers}
              onGoToOrders={goToOrders}
            />
          )}
        </main>
      </div>
    </div>
  )
}
