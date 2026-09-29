import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useUI } from '../../context/UIContext'

export default function HeroBanner() {
  const { setIsCategorySidebarOpen } = useUI()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-100 via-blue-50 to-emerald-50 border border-sky-100/80 shadow-xs">
        
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[380px] lg:min-h-[420px] p-6 sm:p-10 lg:p-12 relative z-10">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Fresh Products <br />
                <span className="text-slate-800 font-extrabold">From Your </span>
                <span className="text-blue-700 font-black">Local Shops</span>
              </h1>
            </div>

            {/* Sub-points strip */}
            <div className="flex flex-wrap items-center gap-y-2 text-xs sm:text-sm font-semibold text-slate-600">
              <span>Fast Delivery</span>
              <span className="mx-2.5 text-slate-300 font-normal">|</span>
              <span>Best Prices</span>
              <span className="mx-2.5 text-slate-300 font-normal">|</span>
              <span>Support Local Business</span>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => setIsCategorySidebarOpen(true)}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-slate-950 hover:bg-blue-700 text-white font-bold text-sm rounded-full shadow-lg shadow-slate-950/20 hover:shadow-blue-600/30 transition-all duration-200 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Right Image with Floating Badge */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center lg:justify-end">
            
            {/* Circular Floating Badge "Fresh Local Trusted" matching screenshot 1 */}
            <div className="absolute -top-4 right-4 sm:top-2 sm:right-6 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-full shadow-lg border border-emerald-100 flex flex-col items-center justify-center w-24 h-24 text-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-0.5" />
              <span className="text-[10px] font-bold text-slate-900 leading-tight">Fresh Local</span>
              <span className="text-[9px] font-medium text-emerald-600 uppercase tracking-wider">Trusted</span>
            </div>

            {/* Produce Banner Image */}
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60 border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80"
                alt="Fresh Vegetables and Fruits from Local Shops"
                className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
