import { Store, ShieldCheck, Truck, Headphones, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-16 border-t border-slate-800 text-xs">
      
      {/* Top Value Strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 text-blue-400 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Village Doorstep Delivery</h4>
              <p className="text-[11px] text-slate-400">Directly from nearest mandi & shops</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Quality Guarantee</h4>
              <p className="text-[11px] text-slate-400">Handpicked fresh vegetables & dairy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Empowering Local Sellers</h4>
              <p className="text-[11px] text-slate-400">Over 1,200+ local rural vendors</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 text-purple-400 rounded-xl">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Dedicated Village Support</h4>
              <p className="text-[11px] text-slate-400">Call or WhatsApp in your regional language</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          <div className="col-span-2">
            <a href="/" className="inline-block mb-3">
              <span className="text-2xl font-black text-white">
                Market<span className="text-orange-500">X</span>
              </span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              MarketX connects rural households directly with local mandis, farmers, and village grocery stores for instant, dependable deliveries.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active in Ajmer Rural & nearby blocks
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Shop Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#vegetables" className="hover:text-white transition-colors">Fresh Vegetables</a></li>
              <li><a href="#fruits" className="hover:text-white transition-colors">Farm Fruits</a></li>
              <li><a href="#dairy" className="hover:text-white transition-colors">Village Cow Dairy</a></li>
              <li><a href="#grocery" className="hover:text-white transition-colors">Daily Staples & Atta</a></li>
              <li><a href="#household" className="hover:text-white transition-colors">Household Essentials</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Partnerships</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#vendor" className="hover:text-white transition-colors">Join as a Vendor</a></li>
              <li><a href="#delivery" className="hover:text-white transition-colors">Become Delivery Partner</a></li>
              <li><a href="#farmers" className="hover:text-white transition-colors">Farmer Mandi Linkage</a></li>
              <li><a href="/admin" className="hover:text-orange-400 text-orange-500 font-semibold transition-colors">🔐 Admin Panel</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Customer Support</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#faq" className="hover:text-white transition-colors">Help Center / FAQs</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Privacy & Terms</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">Easy Return Policy</a></li>
              <li><span className="text-slate-300 font-semibold block mt-2">Toll Free: 1800-000-789</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MarketX Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for local village commerce
          </p>
        </div>
      </div>

    </footer>
  )
}
