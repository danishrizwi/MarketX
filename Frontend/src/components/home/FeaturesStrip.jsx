import { Store, Truck, Tag, ShieldCheck, RotateCcw } from 'lucide-react'

const features = [
  {
    icon: Store,
    title: 'Local Vendors',
    subtitle: 'Support Local Shops',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    subtitle: 'To Your Village',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    icon: Tag,
    title: 'Best Prices',
    subtitle: 'Everyday',
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    icon: ShieldCheck,
    title: 'Fresh & Quality',
    subtitle: 'Products',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    subtitle: 'Hassle Free',
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  }
]

export default function FeaturesStrip() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {features.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 shadow-2xs hover:shadow-md transition-all group"
            >
              <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{item.title}</h4>
                <p className="text-[11px] sm:text-xs text-gray-500 truncate">{item.subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
