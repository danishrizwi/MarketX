import { useEffect, useState } from 'react'
import { X, ChevronRight, ChevronDown, Layers, Sparkles, Store } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useCart } from '../../context/CartContext'

export default function CategorySidebar() {
  const { isCategorySidebarOpen, setIsCategorySidebarOpen, activeCategory, setActiveCategory } = useUI()
  const { allCategories } = useCart()
  const [expandedCat, setExpandedCat] = useState(null)
  const [filterText, setFilterText] = useState('')

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCategorySidebarOpen) {
        setIsCategorySidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCategorySidebarOpen, setIsCategorySidebarOpen])

  if (!isCategorySidebarOpen) return null

  const categoryList = allCategories || []
  const filteredCategories = categoryList.filter(cat =>
    cat.name.toLowerCase().includes(filterText.toLowerCase()) ||
    (cat.subcategories || []).some(sub => sub.toLowerCase().includes(filterText.toLowerCase()))
  )

  const toggleExpand = (id) => {
    setExpandedCat(prev => (prev === id ? null : id))
  }

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat.id === activeCategory ? null : cat.id)
    setIsCategorySidebarOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCategorySidebarOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-left duration-300 ease-out">
          
          {/* Header */}
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">All Categories</h2>
                <p className="text-xs text-slate-300">Browse fresh goods by category</p>
              </div>
            </div>
            <button
              onClick={() => setIsCategorySidebarOpen(false)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search inside Categories */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <input
              type="text"
              placeholder="Search category or subcategory..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-gray-100">
            {filteredCategories.map((cat) => {
              const isExpanded = expandedCat === cat.id
              const isSelected = activeCategory === cat.id

              return (
                <div key={cat.id} className="py-2">
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 flex-1"
                      onClick={() => handleSelectCategory(cat)}
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-xs"
                      />
                      <div>
                        <div className="text-sm font-medium">{cat.name}</div>
                        <div className="text-xs text-gray-400">{cat.count}</div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(cat.id)
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Subcategories Accordion */}
                  {isExpanded && (
                    <div className="pl-14 pr-2 py-2 space-y-1.5 bg-gray-50/70 rounded-xl my-1">
                      {cat.subcategories.map((sub, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setActiveCategory(cat.id)
                            setIsCategorySidebarOpen(false)
                          }}
                          className="text-xs text-gray-600 hover:text-blue-600 py-1.5 px-2 rounded-lg hover:bg-white cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <span>{sub}</span>
                          <span className="text-[10px] text-gray-400">View</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                No categories found matching "{filterText}"
              </div>
            )}
          </div>

          {/* Footer Callout */}
          <div className="p-4 bg-emerald-50/70 border-t border-emerald-100 m-4 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <Store className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-emerald-900 block">Support Local Farmers</span>
              <span className="text-emerald-700">100% of produce sourced from local mandis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
