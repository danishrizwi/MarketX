import { createContext, useContext, useState, useEffect } from 'react'
import { featuredProducts as STATIC_PRODUCTS } from '../data/products'
import { categories as STATIC_CATEGORIES } from '../data/categories'

const CartContext = createContext()

// ── localStorage keys ──────────────────────────────────────────────────────
const CART_KEY       = 'marketx_cart'
const ORDERS_KEY     = 'marketx_orders'
const PRODUCTS_KEY   = 'marketx_products'
const CATEGORIES_KEY = 'marketx_categories'

export function loadCart()       { try { return JSON.parse(localStorage.getItem(CART_KEY))       || [] } catch { return [] } }
export function loadOrders()     { try { return JSON.parse(localStorage.getItem(ORDERS_KEY))     || [] } catch { return [] } }
export function loadProducts()   { try { return JSON.parse(localStorage.getItem(PRODUCTS_KEY))   || null } catch { return null } }
export function loadCategories() { try { return JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || null } catch { return null } }

function saveCart(items)       { localStorage.setItem(CART_KEY,       JSON.stringify(items)) }
function saveOrders(orders)    { localStorage.setItem(ORDERS_KEY,     JSON.stringify(orders)) }
function saveProducts(prods)   { localStorage.setItem(PRODUCTS_KEY,   JSON.stringify(prods)) }
function saveCategories(cats)  { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats)) }

// ── Seed static products on first load ────────────────────────────────────
function initProducts() {
  const stored = loadProducts()
  if (!stored || stored.length === 0) {
    const seeded = STATIC_PRODUCTS.map(p => ({ ...p, stock: p.stock ?? 50 }))
    saveProducts(seeded)
    return seeded
  }
  const withStock = stored.map(p => ({ ...p, stock: p.stock ?? 50 }))
  if (stored.some(p => p.stock === undefined)) saveProducts(withStock)
  return withStock
}

// ── Seed static categories on first load ──────────────────────────────────
function initCategories() {
  const stored = loadCategories()
  if (!stored || stored.length === 0) {
    saveCategories(STATIC_CATEGORIES)
    return STATIC_CATEGORIES
  }
  return stored
}

// ── Order status flow ─────────────────────────────────────────────────────
export const ORDER_STATUSES = [
  'Pending', 'Confirmed', 'Packed', 'Shipped', 'On the Way', 'About to Reach', 'Delivered',
]

export function CartProvider({ children }) {
  const [cartItems,      setCartItems]      = useState(loadCart)
  const [isCartOpen,     setIsCartOpen]     = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [orders,         setOrders]         = useState(loadOrders)
  const [allProducts,    setAllProducts]    = useState(initProducts)
  const [allCategories,  setAllCategories]  = useState(initCategories)

  // Persist cart & orders
  useEffect(() => { saveCart(cartItems) },  [cartItems])
  useEffect(() => { saveOrders(orders) },   [orders])

  // ── Cross-tab real-time sync ──────────────────────────────────────────
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ORDERS_KEY) {
        try { setOrders(JSON.parse(e.newValue) || []) } catch { /* ignore */ }
      }
      if (e.key === CATEGORIES_KEY) {
        try { setAllCategories(JSON.parse(e.newValue) || []) } catch { /* ignore */ }
      }
      if (e.key === PRODUCTS_KEY) {
        try { setAllProducts(JSON.parse(e.newValue) || []) } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Listen for product & category updates (from admin)
  useEffect(() => {
    const refreshProducts = () => setAllProducts(loadProducts() || [])
    const refreshCategories = () => setAllCategories(loadCategories() || [])
    window.addEventListener('marketx-products-updated', refreshProducts)
    window.addEventListener('marketx-categories-updated', refreshCategories)
    return () => {
      window.removeEventListener('marketx-products-updated', refreshProducts)
      window.removeEventListener('marketx-categories-updated', refreshCategories)
    }
  }, [])

  // ── Cart actions ──────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, delta) => {
    setCartItems(prev =>
      prev.map(i => i.id === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
          .filter(i => i.quantity > 0)
    )
  }

  const removeFromCart = (productId) => setCartItems(prev => prev.filter(i => i.id !== productId))
  const clearCart = () => setCartItems([])

  // ── Place order ───────────────────────────────────────────────────────
  const placeOrder = (paymentMethod, userInfo = null) => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const newOrder = {
      id: `MX-${Date.now().toString().slice(-5)}`,
      date: dateStr,
      createdAt: now.toISOString(),
      status: 'Pending',
      paymentMethod,
      total: totalAmount,
      deliveryPartner: null,
      userInfo: userInfo || null,
      statusHistory: [{ status: 'Pending', time: now.toISOString() }],
      items: cartItems.map(i => ({
        name: i.name, qty: i.quantity, unit: i.unit, price: i.price, image: i.image
      }))
    }
    const updated = [newOrder, ...orders]
    setOrders(updated)
    saveOrders(updated)
    clearCart()
    return newOrder
  }

  // ── Admin: update order status ────────────────────────────────────────
  const updateOrderStatus = (orderId, newStatus, deliveryPartner = null) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id !== orderId) return o
        const history = [...(o.statusHistory || []), { status: newStatus, time: new Date().toISOString() }]
        return { ...o, status: newStatus, statusHistory: history, ...(deliveryPartner ? { deliveryPartner } : {}) }
      })
      saveOrders(updated)
      return updated
    })
  }

  // ── Admin: product management ─────────────────────────────────────────
  const addProduct = (product) => {
    const existing = loadProducts() || []
    const updated  = [product, ...existing]
    saveProducts(updated)
    setAllProducts(updated)
    window.dispatchEvent(new Event('marketx-products-updated'))
  }

  const deleteProduct = (productId) => {
    const existing = loadProducts() || []
    const updated  = existing.filter(p => p.id !== productId)
    saveProducts(updated)
    setAllProducts(updated)
    window.dispatchEvent(new Event('marketx-products-updated'))
  }

  const updateProduct = (productId, changes) => {
    const existing = loadProducts() || []
    const updated  = existing.map(p => p.id === productId ? { ...p, ...changes } : p)
    saveProducts(updated)
    setAllProducts(updated)
    window.dispatchEvent(new Event('marketx-products-updated'))
  }

  const updateProductStock = (productId, newStock) => {
    const qty = Math.max(0, parseInt(newStock) || 0)
    const existing = loadProducts() || []
    const updated  = existing.map(p => p.id === productId ? { ...p, stock: qty, inStock: qty > 0 } : p)
    saveProducts(updated)
    setAllProducts(updated)
    window.dispatchEvent(new Event('marketx-products-updated'))
  }

  // ── Admin: category management ────────────────────────────────────────
  const addCategory = (category) => {
    const existing = loadCategories() || STATIC_CATEGORIES
    const updated  = [...existing, category]
    saveCategories(updated)
    setAllCategories(updated)
    window.dispatchEvent(new Event('marketx-categories-updated'))
  }

  const deleteCategory = (categoryId) => {
    const existing = loadCategories() || STATIC_CATEGORIES
    const updated  = existing.filter(c => c.id !== categoryId)
    saveCategories(updated)
    setAllCategories(updated)
    window.dispatchEvent(new Event('marketx-categories-updated'))
  }

  const updateCategory = (categoryId, changes) => {
    const existing = loadCategories() || STATIC_CATEGORIES
    const updated  = existing.map(c => c.id === categoryId ? { ...c, ...changes } : c)
    saveCategories(updated)
    setAllCategories(updated)
    window.dispatchEvent(new Event('marketx-categories-updated'))
  }

  // ── Totals ────────────────────────────────────────────────────────────
  const totalItemsCount = cartItems.reduce((a, i) => a + i.quantity, 0)
  const subtotal        = cartItems.reduce((a, i) => a + i.price * i.quantity, 0)
  const deliveryFee     = subtotal > 150 || cartItems.length === 0 ? 0 : 20
  const discount        = subtotal > 0 ? 10 : 0
  const totalAmount     = Math.max(0, subtotal + (cartItems.length > 0 ? deliveryFee : 0) - discount)

  return (
    <CartContext.Provider value={{
      cartItems, isCartOpen, setIsCartOpen,
      isCheckoutOpen, setIsCheckoutOpen,
      addToCart, updateQuantity, removeFromCart, clearCart,
      placeOrder, orders, updateOrderStatus,
      addProduct, deleteProduct, updateProduct, updateProductStock,
      allProducts,
      allCategories, addCategory, deleteCategory, updateCategory,
      totalItemsCount, subtotal, deliveryFee, discount, totalAmount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
