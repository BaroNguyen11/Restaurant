import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import About from './pages/about/About'
import Menu from './pages/menu/Menu'
import Contact from './pages/contact/Contact'
import { CartProvider } from './context/CartContext'
import OrderFood from './pages/order/OrderFood'
import ProductDetails from './pages/order/ProductDetails'
import OrderTable from './pages/order/OrderTable'
import { AuthProvider } from './context/AuthContext'
import Signin from './components/Signin'
import Checkout from './pages/order/Checkout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          <Routes>
            <Route path="/" element={<App />} >
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/order/order_food" element={<OrderFood />} />
              <Route path="/order/order_table" element={<OrderTable />} />
              <Route path="/product/:id" element={<ProductDetails />} />
           
              <Route path="/contact" element={<Contact />} />
            </Route>
            <Route path="/signin" element={<Signin />} />
               <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>,
)
