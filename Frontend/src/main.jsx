import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UIProvider } from './context/UIContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import App from './App.jsx'
import AdminPage from './pages/AdminPage.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"      element={<App />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UIProvider>
  </StrictMode>
)
