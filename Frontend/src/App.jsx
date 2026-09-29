// Sidebars & Drawers
import CategorySidebar from './components/sidebars/CategorySidebar'
import CartDrawer from './components/sidebars/CartDrawer'
import CheckoutDrawer from './components/sidebars/CheckoutDrawer'
import LocationDrawer from './components/sidebars/LocationDrawer'
import AuthDrawer from './components/sidebars/AuthDrawer'
import OrdersDrawer from './components/sidebars/OrdersDrawer'
import AccountDrawer from './components/sidebars/AccountDrawer'

// Header & Navigation
import Navbar from './components/header/Navbar'
import CategoryNav from './components/header/CategoryNav'

// Home Page Sections
import HeroBanner from './components/home/HeroBanner'
import FeaturesStrip from './components/home/FeaturesStrip'
import ShopByCategory from './components/home/ShopByCategory'
import FeaturedProducts from './components/home/FeaturedProducts'

// Footer
import Footer from './components/footer/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">

      {/* Header & Category Subnav */}
      <Navbar />
      <CategoryNav />

      {/* Main Home Page Content */}
      <main className="flex-1 space-y-4">
        <HeroBanner />
        <FeaturesStrip />
        <ShopByCategory />
        <FeaturedProducts />
      </main>

      {/* Footer */}
      <Footer />

      {/* Independent Sidebars / Drawers */}
      <CategorySidebar />
      <CartDrawer />
      <CheckoutDrawer />
      <LocationDrawer />
      <AuthDrawer />
      <OrdersDrawer />
      <AccountDrawer />

    </div>
  )
}
