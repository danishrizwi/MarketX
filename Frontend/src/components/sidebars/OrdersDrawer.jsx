import { useEffect } from 'react'
import {
  X, Package, Clock, CheckCircle2, Truck, MapPin,
  ShoppingBag, QrCode, Banknote, Home, Box, Bike
} from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useCart, ORDER_STATUSES } from '../../context/CartContext'

// ── Per-status display config ─────────────────────────────────────────────────
const STATUS_CONFIG = {
  'Pending':         { color: 'text-yellow-600 bg-yellow-50 border-yellow-200',   icon: Clock,         label: 'Order Placed' },
  'Confirmed':       { color: 'text-blue-600 bg-blue-50 border-blue-200',         icon: CheckCircle2,  label: 'Confirmed' },
  'Packed':          { color: 'text-purple-600 bg-purple-50 border-purple-200',   icon: Box,           label: 'Packed' },
  'Shipped':         { color: 'text-indigo-600 bg-indigo-50 border-indigo-200',   icon: Package,       label: 'Shipped' },
  'On the Way':      { color: 'text-orange-600 bg-orange-50 border-orange-200',   icon: Bike,          label: 'On the Way' },
  'About to Reach':  { color: 'text-teal-600 bg-teal-50 border-teal-200',         icon: MapPin,        label: 'Almost There!' },
  'Delivered':       { color: 'text-emerald-600 bg-emerald-50 border-emerald-200',icon: Home,          label: 'Delivered' },
  'Cancelled':       { color: 'text-red-500 bg-red-50 border-red-200',            icon: X,             label: 'Cancelled' },
}

// ── Mini tracking timeline ─────────────────────────────────────────────────────
function TrackingBar({ status }) {
  const currentIdx = ORDER_STATUSES.indexOf(status)
  return (
    <div className="py-2 overflow-x-auto">
      <div className="flex items-center min-w-max gap-0">
        {ORDER_STATUSES.map((s, idx) => {
          const reached = currentIdx >= idx
          const isCurrent = currentIdx === idx
          const cfg = STATUS_CONFIG[s]
          const Icon = cfg?.icon || Clock
          return (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all
                  ${isCurrent ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-110'
                  : reached  ? 'border-blue-400 bg-blue-100 text-blue-600'
                  :            'border-gray-200 bg-gray-50 text-gray-300'}`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <p className={`text-[9px] font-semibold text-center leading-tight max-w-[48px]
                  ${isCurrent ? 'text-blue-600' : reached ? 'text-gray-600' : 'text-gray-300'}`}
                >
                  {s}
                </p>
              </div>
              {idx < ORDER_STATUSES.length - 1 && (
                <div className={`w-6 h-0.5 mb-4 mx-0.5 transition-all ${reached && currentIdx > idx ? 'bg-blue-400' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrdersDrawer() {
  const { isOrdersDrawerOpen, setIsOrdersDrawerOpen } = useUI()
  const { orders } = useCart()

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setIsOrdersDrawerOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setIsOrdersDrawerOpen])

  if (!isOrdersDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={() => setIsOrdersDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">My Orders</h2>
                <p className="text-xs text-slate-300">
                  {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''}` : 'No orders yet'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOrdersDrawerOpen(false)} className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">No orders yet</p>
                  <p className="text-xs text-gray-400 mt-1">Place an order and track it live here!</p>
                </div>
              </div>
            ) : (
              orders.map((order) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending']
                const Icon = cfg.icon
                const isActive = !['Delivered', 'Cancelled'].includes(order.status)

                return (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">

                    {/* Order Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-800">Order #{order.id}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{order.date}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </div>

                    {/* Live tracking bar (only for active orders) */}
                    {isActive && (
                      <div className="px-4 pt-3 pb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Live Tracking</p>
                        <TrackingBar status={order.status} />
                      </div>
                    )}

                    {/* Delivered banner */}
                    {order.status === 'Delivered' && (
                      <div className="mx-4 mt-3 flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <p className="text-xs font-semibold text-emerald-700">Order delivered successfully! 🎉</p>
                      </div>
                    )}

                    {/* Delivery partner (if assigned) */}
                    {order.deliveryPartner && order.status !== 'Delivered' && (
                      <div className="mx-4 mt-3 flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {order.deliveryPartner.name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900">{order.deliveryPartner.name}</p>
                          <p className="text-[11px] text-gray-500">{order.deliveryPartner.phone}</p>
                        </div>
                        <span className="ml-auto text-[11px] font-semibold text-blue-600 shrink-0">Your Rider</span>
                      </div>
                    )}

                    {/* Items */}
                    <div className="px-4 py-3 space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-gray-700">
                          <span className="font-medium">
                            {item.name}
                            <span className="text-gray-400 font-normal"> × {item.qty} ({item.unit})</span>
                          </span>
                          <span className="font-semibold shrink-0 ml-2">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        {order.paymentMethod === 'cash'
                          ? <Banknote className="w-3 h-3 text-emerald-500" />
                          : <QrCode className="w-3 h-3 text-blue-500" />}
                        <span className="font-medium">
                          {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online (UPI)'}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₹{order.total}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
