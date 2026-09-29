import { createContext, useContext, useState, useEffect } from 'react'

const UIContext = createContext()
const USER_KEY = 'marketx_current_user'

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null
  } catch {
    return null
  }
}

export function UIProvider({ children }) {
  // Sidebar / Drawer open states
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false)
  const [isLocationDrawerOpen, setIsLocationDrawerOpen]   = useState(false)
  const [isAuthDrawerOpen, setIsAuthDrawerOpen]           = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen]           = useState(false)
  const [isOrdersDrawerOpen, setIsOrdersDrawerOpen]       = useState(false)
  const [isAccountDrawerOpen, setIsAccountDrawerOpen]     = useState(false)

  // Delivery location
  const [selectedLocation, setSelectedLocation] = useState({
    village: 'Ajmer - Village A',
    pincode: '305001',
    state: 'Rajasthan',
    landmark: 'Near Govt School'
  })

  // Global search
  const [searchQuery, setSearchQuery] = useState('')

  // Category filter
  const [activeCategory, setActiveCategory] = useState(null)

  // Auth — persistent in localStorage until explicit logout
  // user shape: { name, phone, avatar, email?, address? }
  const [user, setUser] = useState(loadUser)

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }, [user])

  // Cross-tab sync for user login / logout
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === USER_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null)
        } catch {
          setUser(null)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <UIContext.Provider
      value={{
        isCategorySidebarOpen, setIsCategorySidebarOpen,
        isLocationDrawerOpen,  setIsLocationDrawerOpen,
        isAuthDrawerOpen,      setIsAuthDrawerOpen,
        isMobileMenuOpen,      setIsMobileMenuOpen,
        isOrdersDrawerOpen,    setIsOrdersDrawerOpen,
        isAccountDrawerOpen,   setIsAccountDrawerOpen,
        selectedLocation,      setSelectedLocation,
        searchQuery,           setSearchQuery,
        activeCategory,        setActiveCategory,
        user,                  setUser,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) throw new Error('useUI must be used within a UIProvider')
  return context
}
