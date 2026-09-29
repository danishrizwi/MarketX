import { useEffect, useRef, useState } from 'react'
import { MapPin, Search, User, ShoppingCart, ChevronDown, Menu, LogOut, Settings, Package } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

export default function Navbar() {
  const { totalItemsCount, setIsCartOpen } = useCart()
  const {
    selectedLocation,
    setIsLocationDrawerOpen,
    setIsAuthDrawerOpen,
    setIsCategorySidebarOpen,
    searchQuery,
    setSearchQuery,
    user,
    setUser,
    setIsOrdersDrawerOpen,
    setIsAccountDrawerOpen,
  } = useUI()

  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setUser(null)
    setProfileOpen(false)
  }

  const firstName = user?.name?.split(' ')[0] ?? ''

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCategorySidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <a href="/" className="flex flex-col select-none leading-none">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Market<span className="text-orange-600">X</span>
              </span>

              <span className="text-[10px] sm:text-xs font-medium tracking-wide text-slate-500 mt-1 ml-2.5">
                Your Own Market
              </span>
            </a>
          </div>

          {/* Location Trigger Selector */}
          <button
            onClick={() => setIsLocationDrawerOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-gray-200 cursor-pointer"
            title="Change Delivery Location"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-gray-400 leading-tight">Deliver to</div>
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <span>{selectedLocation.village}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-gray-400"
              />
              <button
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Action Icons: Login/Profile + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* ── Logged-in: Avatar + Name + Dropdown ── */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-label="User profile menu"
                >
                  {/* Avatar circle — shows first letter of first name */}
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black shadow-sm select-none">
                    {user.avatar}
                  </div>
                  {/* First name */}
                  <span className="hidden md:inline text-xs font-semibold text-gray-800">{firstName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black select-none shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{user.name}</p>
                        <p className="text-[11px] text-gray-500">+91 {user.phone}</p>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => { setIsOrdersDrawerOpen(true); setProfileOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        My Orders
                      </button>
                      <button
                        onClick={() => { setIsAccountDrawerOpen(true); setProfileOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Account Settings
                      </button>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged-out: Login button ── */
              <button
                onClick={() => setIsAuthDrawerOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden md:inline">Login</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              title="Open Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs border-2 border-white animate-in zoom-in">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  )
}
