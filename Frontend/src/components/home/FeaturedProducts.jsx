import { useState } from 'react'
import { Plus, Minus, Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

export default function FeaturedProducts() {
  const { cartItems, addToCart, updateQuantity, setIsCartOpen, allProducts } = useCart()
  const { activeCategory, searchQuery, selectedLocation } = useUI()
  const [flashId, setFlashId] = useState(null)

  // Filter from dynamic allProducts (seeded from static data, admin-managed)
  const filteredProducts = (allProducts || []).filter(prod => {
    const matchesCategory = !activeCategory || prod.category === activeCategory
    const matchesSearch   = !searchQuery   || prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAdd = (product) => {
    addToCart(product)
    setFlashId(product.id)
    setTimeout(() => setFlashId(null), 900)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Fresh Deals in {selectedLocation.village.split('-')[0].trim()}
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Farm Fresh
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Directly harvested this morning from nearby village farms</p>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
          <span>View Cart</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredProducts.map((product) => {
          const cartItem   = cartItems.find(i => i.id === product.id)
          const inCart     = !!cartItem
          const qty        = cartItem?.quantity ?? 0
          const isFlashing = flashId === product.id
          const isOutOfStock = product.inStock === false || (product.stock !== undefined && product.stock <= 0)

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-blue-100 shadow-2xs hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 bg-gray-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                  loading="lazy"
                />
                {product.discount && !isOutOfStock && (
                  <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    {product.discount}
                  </span>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-600/90 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
                {!isOutOfStock && product.stock > 0 && product.stock <= 5 && (
                  <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    Only {product.stock} left!
                  </span>
                )}
                {!isOutOfStock && (
                  <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs text-[11px] font-bold text-gray-800">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                )}
                {inCart && (
                  <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in duration-200">
                    {qty}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">{product.unit}</p>
                </div>

                <div className="pt-1 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-black text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block">Inclusive of all taxes</span>
                  </div>

                  {isOutOfStock ? (
                    <button disabled className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200">
                      Out of Stock
                    </button>
                  ) : inCart ? (
                    <div className={`flex items-center rounded-xl overflow-hidden border transition-all ${isFlashing ? 'border-emerald-400 shadow-sm shadow-emerald-400/30' : 'border-blue-600'}`}>
                      <button onClick={() => updateQuantity(product.id, -1)} className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-black text-blue-600 bg-white min-w-[24px] text-center">{qty}</span>
                      <button
                        onClick={() => handleAdd(product)}
                        disabled={qty >= product.stock}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(product)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isFlashing ? 'bg-emerald-500 text-white scale-95' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-500/20'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">No products found matching your current filter.</p>
        </div>
      )}
    </section>
  )
}
