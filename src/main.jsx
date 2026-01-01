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
import NotFound from './pages/NotFound'
import ScrollToTop from './pages/ScrollToTop'
import ModalLogin from './components/ModalLogin'
import Chatbot from './components/ChatBot'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <ModalLogin />
          <Chatbot/>
          <Routes>
            <Route path="/" element={<App />} >
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/order/order_food" element={<OrderFood />} />
              <Route path="/order/order_table" element={<OrderTable />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/signin" element={<Signin />} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>,
)
