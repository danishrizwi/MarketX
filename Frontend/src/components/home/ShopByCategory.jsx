import { ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

export default function ShopByCategory() {
  const { setIsCategorySidebarOpen, activeCategory, setActiveCategory } = useUI()
  const { allCategories, allProducts } = useCart()

  const handleSelect = (catId) => {
    setActiveCategory(prev => (prev === catId ? null : catId))
  }

  const categoryList = allCategories || []
  const productList  = allProducts || []

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Explore authentic products from verified local sellers</p>
        </div>

        <button
          onClick={() => setIsCategorySidebarOpen(true)}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categoryList.map((cat) => {
          const isSelected = activeCategory === cat.id
          const prodsInCat = productList.filter(p => p.category === cat.id).length
          const countLabel = cat.count || `${prodsInCat} Products`

          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`group flex flex-col items-center p-3.5 rounded-2xl bg-white border transition-all cursor-pointer text-center ${
                isSelected
                  ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20 bg-blue-50/20'
                  : 'border-gray-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {/* Circular/Rounded Image Box */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-gray-50 p-1 flex items-center justify-center mb-2.5 border border-gray-100/80 group-hover:scale-105 transition-transform duration-200">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                  onError={e => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80'
                  }}
                />
              </div>

              {/* Title */}
              <span className={`text-xs font-semibold tracking-tight transition-colors line-clamp-1 ${
                isSelected ? 'text-blue-700 font-bold' : 'text-gray-800 group-hover:text-blue-600'
              }`}>
                {cat.name}
              </span>

              <span className="text-[10px] text-gray-400 mt-0.5">
                {countLabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Active Filter Clear banner if filtered */}
      {activeCategory && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center justify-between text-xs text-blue-900 border border-blue-100">
          <span>
            Filtering by <strong>{categoryList.find(c => c.id === activeCategory)?.name || activeCategory}</strong>
          </span>
          <button
            onClick={() => setActiveCategory(null)}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

    </section>
  )
}
