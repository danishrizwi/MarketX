import { useEffect, useState } from 'react'
import {
  X, ArrowLeft, CheckCircle2, Banknote, MapPin,
  ShoppingBag, ChevronRight, Loader2, Package
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

// ── Payment methods config ────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'phonepe',
    label: 'PhonePe',
    sub: 'UPI · Instant transfer',
    upiId: 'marketx@ybl',
    color: '#5f259f',
    bg: 'bg-purple-50',
    border: 'border-purple-500',
    ring: 'ring-purple-500/20',
    dot: 'bg-purple-600',
    radioBorder: 'border-purple-600',
    emoji: '💜',
  },
  {
    id: 'gpay',
    label: 'Google Pay',
    sub: 'UPI · Linked bank account',
    upiId: 'marketx@okaxis',
    color: '#4285F4',
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    ring: 'ring-blue-500/20',
    dot: 'bg-blue-500',
    radioBorder: 'border-blue-500',
    emoji: '🔵',
  },
  {
    id: 'paytm',
    label: 'Paytm',
    sub: 'UPI · Paytm wallet',
    upiId: 'marketx@paytm',
    color: '#00BAF2',
    bg: 'bg-sky-50',
    border: 'border-sky-400',
    ring: 'ring-sky-500/20',
    dot: 'bg-sky-500',
    radioBorder: 'border-sky-500',
    emoji: '🔷',
  },
  {
    id: 'cash',
    label: 'Cash on Delivery',
    sub: 'Pay when order arrives',
    upiId: null,
    color: '#059669',
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500/20',
    dot: 'bg-emerald-600',
    radioBorder: 'border-emerald-600',
    emoji: '💵',
  },
]

// ── Branded QR Code ───────────────────────────────────────────────────────────
function BrandedQR({ color = '#1d4ed8', method }) {
  const dots = [
    [40,5],[45,5],[50,5],[55,5],[40,10],[50,10],[55,10],
    [40,15],[45,15],[55,15],[40,20],[50,20],[40,25],[45,25],[50,25],[55,25],
    [5,40],[10,40],[20,40],[25,40],[5,45],[15,45],[25,45],
    [5,50],[10,50],[20,50],[5,55],[15,55],[20,55],[25,55],
    [5,60],[25,60],[10,60],[15,60],
    [40,40],[45,40],[50,40],[55,40],[60,40],[65,40],[70,40],
    [40,45],[50,45],[60,45],[70,45],[40,50],[45,50],[55,50],[60,50],[65,50],
    [40,55],[50,55],[55,55],[70,55],[40,60],[45,60],[60,60],[65,60],[70,60],
    [40,65],[50,65],[55,65],[65,65],[40,70],[45,70],[60,70],[70,70],
    [67,70],[72,70],[77,70],[82,70],[87,70],[92,70],[67,75],[77,75],[87,75],[92,75],
    [67,80],[72,80],[82,80],[87,80],[67,85],[77,85],[82,85],[92,85],
    [67,90],[72,90],[77,90],[87,90],[92,90],
  ]
  return (
    <div className="flex flex-col items-center gap-3 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="w-44 h-44 bg-white rounded-2xl p-3 shadow-lg" style={{ border: `4px solid ${color}` }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="5"  y="5"  width="28" height="28" rx="3" fill={color} />
          <rect x="9"  y="9"  width="20" height="20" rx="2" fill="white" />
          <rect x="13" y="13" width="12" height="12" rx="1" fill={color} />
          <rect x="67" y="5"  width="28" height="28" rx="3" fill={color} />
          <rect x="71" y="9"  width="20" height="20" rx="2" fill="white" />
          <rect x="75" y="13" width="12" height="12" rx="1" fill={color} />
          <rect x="5"  y="67" width="28" height="28" rx="3" fill={color} />
          <rect x="9"  y="71" width="20" height="20" rx="2" fill="white" />
          <rect x="13" y="75" width="12" height="12" rx="1" fill={color} />
          {dots.map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="4" height="4" rx="0.5" fill={color} />
          ))}
        </svg>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-gray-800">Scan with {method.label}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">Or any UPI app</p>
      </div>
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl border text-xs font-semibold" style={{ background: `${color}12`, borderColor: `${color}40`, color }}>
        UPI: {method.upiId}
      </div>
    </div>
  )
}

// ── Confetti Dot ──────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4']
function ConfettiDots() {
  const dots = Array.from({ length: 20 }, (_, i) => ({
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 0.6}s`,
    size: `${6 + Math.random() * 8}px`,
    dur: `${0.8 + Math.random() * 0.6}s`,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute top-0 rounded-full"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.color,
            animation: `confetti-fall ${d.dur} ${d.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

// ── Main Checkout Drawer ──────────────────────────────────────────────────────
export default function CheckoutDrawer() {
  const {
    isCheckoutOpen, setIsCheckoutOpen,
    cartItems, subtotal, deliveryFee, discount, totalAmount,
    placeOrder,
  } = useCart()
  const { user, selectedLocation, setIsOrdersDrawerOpen } = useUI()

  const [step,        setStep]        = useState('summary')
  const [payMethod,   setPayMethod]   = useState(null)   // id string
  const [placedOrder, setPlacedOrder] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Reset on open
  useEffect(() => {
    if (isCheckoutOpen) { setStep('summary'); setPayMethod(null); setPlacedOrder(null); setShowConfetti(false) }
  }, [isCheckoutOpen])

  // ESC
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setIsCheckoutOpen(false) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [setIsCheckoutOpen])

  if (!isCheckoutOpen) return null

  const selectedPayDef = PAYMENT_METHODS.find(p => p.id === payMethod)

  const handlePlaceOrder = () => {
    setStep('processing')
    setTimeout(() => {
      const userInfo = user ? {
        name:    user.name,
        phone:   user.phone,
        email:   user.email    || '',
        address: user.address  || '',
        city:    user.city     || '',
        pincode: user.pincode  || '',
      } : null
      const order = placeOrder(payMethod, userInfo)
      setPlacedOrder(order)
      setStep('success')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
    }, 1800)
  }

  const stepTitle = {
    summary:    'Order Summary',
    payment:    'Choose Payment',
    processing: 'Placing Order…',
    success:    'Order Confirmed! 🎉',
  }
  const stepSub = {
    summary:    `${cartItems.length} item(s) · ₹${totalAmount} total`,
    payment:    'Pick how you want to pay',
    processing: 'Please wait a moment',
    success:    `Order #${placedOrder?.id}`,
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={() => step !== 'processing' && setIsCheckoutOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">

          {/* ── Header ── */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              {step === 'payment' && (
                <button onClick={() => setStep('summary')} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors mr-1">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2 bg-blue-600 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{stepTitle[step]}</h2>
                <p className="text-xs text-slate-300">{stepSub[step]}</p>
              </div>
            </div>
            {step !== 'processing' && (
              <button onClick={() => setIsCheckoutOpen(false)} className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto">

            {/* ─── STEP: summary ─── */}
            {step === 'summary' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Delivery address */}
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Delivering to</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {user?.address ? `${user.address}, ` : ''}{selectedLocation.village}
                        {user?.pincode ? ` - ${user.pincode}` : `, ${selectedLocation.pincode}`}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Items in Order</p>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-400">{item.unit} × {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-900 shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bill */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bill Details</p>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-800">₹{subtotal}</span></div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className={deliveryFee === 0 ? 'font-semibold text-emerald-600' : 'font-medium text-gray-800'}>
                          {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium"><span>Discount</span><span>-₹{discount}</span></div>
                      )}
                      <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-gray-900">
                        <span>Total Payable</span>
                        <span className="text-blue-600 text-base">₹{totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100 shrink-0">
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP: payment ─── */}
            {step === 'payment' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Payment Method</p>

                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = payMethod === method.id
                    return (
                      <div key={method.id}>
                        <button
                          onClick={() => setPayMethod(isSelected ? null : method.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                            isSelected ? `${method.border} ${method.bg}` : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{method.emoji}</span>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">{method.label}</p>
                              <p className="text-xs text-gray-500">{method.sub}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? method.radioBorder : 'border-gray-300'}`}>
                              {isSelected && <div className={`w-2 h-2 rounded-full ${method.dot}`} />}
                            </div>
                          </div>
                        </button>

                        {/* QR for online methods */}
                        {isSelected && method.upiId && (
                          <div className="mt-2 flex justify-center">
                            <BrandedQR color={method.color} method={method} />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <div className="flex justify-between items-center px-1 pt-1">
                    <span className="text-xs text-gray-500">Payable Amount</span>
                    <span className="text-lg font-black text-blue-600">₹{totalAmount}</span>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 shrink-0">
                  <button
                    disabled={!payMethod}
                    onClick={handlePlaceOrder}
                    className={`w-full py-3 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      payMethod
                        ? `text-white shadow-lg`
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    }`}
                    style={payMethod && selectedPayDef ? { backgroundColor: selectedPayDef.color } : {}}
                  >
                    {selectedPayDef && <span>{selectedPayDef.emoji}</span>}
                    <span>
                      {!payMethod
                        ? 'Select a Payment Method'
                        : payMethod === 'cash'
                          ? 'Place Order · Cash on Delivery'
                          : `Pay ₹${totalAmount} with ${selectedPayDef?.label}`}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP: processing ─── */}
            {step === 'processing' && (
              <div className="flex flex-col items-center justify-center h-full gap-5 py-20">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30" />
                  <div className="relative w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg">Placing your order…</p>
                  <p className="text-xs text-gray-500 mt-1">Confirming with local vendor</p>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* ─── STEP: success ─── */}
            {step === 'success' && placedOrder && (
              <div className="relative flex flex-col items-center gap-4 py-6 px-5 text-center overflow-hidden">
                {showConfetti && <ConfettiDots />}

                {/* ── Animated success ring + checkmark ── */}
                <div className="relative flex items-center justify-center mt-2">
                  {/* Outer pulse rings */}
                  <div className="absolute w-32 h-32 bg-emerald-100 rounded-full animate-ping opacity-20" />
                  <div className="absolute w-28 h-28 bg-emerald-100 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.2s' }} />
                  {/* Main circle */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-13 h-13 text-white" strokeWidth={2} style={{ width: 52, height: 52 }} />
                  </div>
                  {/* Confetti emoji badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-base shadow-lg animate-bounce">
                    🎉
                  </div>
                </div>

                {/* ── Title ── */}
                <div className="animate-in slide-in-from-bottom-2 duration-400" style={{ animationDelay: '150ms' }}>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    Order Placed!
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">
                    {placedOrder.paymentMethod === 'cash'
                      ? 'Cash on Delivery · Pay when order arrives'
                      : `Paid via ${PAYMENT_METHODS.find(p => p.id === placedOrder.paymentMethod)?.label || 'UPI'}`}
                  </p>
                </div>

                {/* ── Order ID + Amount strip ── */}
                <div className="w-full flex gap-3 animate-in slide-in-from-bottom-3 duration-400" style={{ animationDelay: '250ms' }}>
                  <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-3 text-left">
                    <p className="text-[10px] text-gray-400 font-medium">Order ID</p>
                    <p className="text-sm font-black text-gray-900">#{placedOrder.id}</p>
                  </div>
                  <div className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl p-3 text-left">
                    <p className="text-[10px] text-blue-400 font-medium">Total Paid</p>
                    <p className="text-sm font-black text-blue-700">₹{placedOrder.total}</p>
                  </div>
                </div>

                {/* ── Journey steps ── */}
                <div className="w-full animate-in slide-in-from-bottom-4 duration-400" style={{ animationDelay: '350ms' }}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left mb-3">Your Order Journey</p>

                  <style>{`
                    @keyframes step-glow {
                      0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
                      50%       { box-shadow: 0 0 0 8px rgba(234, 179, 8, 0); }
                    }
                  `}</style>

                  {[
                    { icon: '📦', label: 'Order Placed',       sub: 'Just now',                     done: true,    current: false },
                    { icon: '✅', label: 'Admin Confirming…',  sub: 'Waiting for confirmation',      done: false,   current: true  },
                    { icon: '📫', label: 'Packed & Ready',     sub: 'Items being packed',            done: false,   current: false },
                    { icon: '🚚', label: 'Out for Delivery',   sub: 'On the way to your door',       done: false,   current: false },
                    { icon: '🏠', label: 'Delivered',          sub: 'Enjoy your fresh groceries!',   done: false,   current: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
                      {/* Icon circle */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 border-2 transition-all ${
                          step.done    ? 'bg-emerald-500 border-emerald-500 text-white' :
                          step.current ? 'bg-yellow-400 border-yellow-400'              :
                                         'bg-gray-100 border-gray-200'
                        }`}
                        style={step.current ? { animation: 'step-glow 1.5s ease-in-out infinite' } : {}}
                      >
                        {step.icon}
                      </div>
                      {/* Label */}
                      <div className="flex-1 text-left pt-0.5">
                        <p className={`text-xs font-bold ${step.done || step.current ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className={`text-[10px] ${step.current ? 'text-yellow-600 font-semibold' : 'text-gray-400'}`}>
                          {step.sub}
                        </p>
                      </div>
                      {/* Check for done */}
                      {step.done && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      )}
                      {/* Pulsing dot for current */}
                      {step.current && (
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1.5 shrink-0 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>

                {/* ── "Waiting for admin" notice ── */}
                <div className="w-full flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-2xl animate-in slide-in-from-bottom-5 duration-400" style={{ animationDelay: '450ms' }}>
                  <span className="text-xl shrink-0">🔔</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-amber-800">Waiting for Admin Confirmation</p>
                    <p className="text-[10px] text-amber-600 mt-0.5">
                      Our team will review and confirm your order shortly. You'll see the update in My Orders.
                    </p>
                  </div>
                </div>

                {/* ── Action buttons ── */}
                <div className="w-full space-y-2 animate-in slide-in-from-bottom-6 duration-400" style={{ animationDelay: '550ms' }}>
                  <button
                    onClick={() => { setIsCheckoutOpen(false); setTimeout(() => setIsOrdersDrawerOpen(true), 200) }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    Track My Order
                  </button>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
