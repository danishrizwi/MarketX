import { Layers, ChevronDown } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useCart } from '../../context/CartContext'

export default function CategoryNav() {
  const { setIsCategorySidebarOpen, activeCategory, setActiveCategory } = useUI()
  const { allCategories } = useCart()

  const handleCategoryClick = (catId) => {
    setActiveCategory(prev => (prev === catId ? null : catId))
  }

  const categoryList = allCategories || []

  return (
    <nav className="bg-white border-b border-gray-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          
          {/* All Categories Sidebar Trigger */}
          <button
            onClick={() => setIsCategorySidebarOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>All Categories</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
          </button>

          <div className="h-4 w-[1px] bg-gray-200 mx-1 shrink-0" />

          {/* Category Quick Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {categoryList.map((cat) => {
              const isActive = activeCategory === cat.id

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}

            {/* More dropdown button */}
            <div className="relative group">
              <button
                onClick={() => setIsCategorySidebarOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 whitespace-nowrap transition-colors cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  )
}
