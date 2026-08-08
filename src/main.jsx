import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import ScrollToTop from './pages/ScrollToTop'
import ModalLogin from './components/ModalLogin'
import Chatbot from './components/ChatBot'

// Lazy load page components
const Home = lazy(() => import('./pages/home/Home.jsx'))
const About = lazy(() => import('./pages/about/About'))
const Menu = lazy(() => import('./pages/menu/Menu'))
const Contact = lazy(() => import('./pages/contact/Contact'))
const OrderFood = lazy(() => import('./pages/order/OrderFood'))
const ProductDetails = lazy(() => import('./pages/order/ProductDetails'))
const OrderTable = lazy(() => import('./pages/order/OrderTable'))
const Signin = lazy(() => import('./components/Signin'))
const Checkout = lazy(() => import('./pages/order/Checkout'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Profile = lazy(() => import('./pages/profile/Profile'))
const Info = lazy(() => import('./pages/profile/Info'))
const MyOrder = lazy(() => import('./pages/profile/MyOrder'))
const Settings = lazy(() => import('./pages/profile/Settings'))
const DashBoard = lazy(() => import('./admin/DashBoard'))
const Admin = lazy(() => import('./admin/Admin'))
const AdminProducts = lazy(() => import('./admin/AdminProducts'))
const AdminOrders = lazy(() => import('./admin/AdminOrders'))
const AdminReviews = lazy(() => import('./admin/AdminReviews'))
const AdminReservations = lazy(() => import('./admin/AdminReservations'))
const ManageUser = lazy(() => import('./admin/ManageUser'))

import { AuthProvider as CustomAuthProvider } from './context/AuthContext' // Keep AuthContext import correct

const PageLoader = () => (
  <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[9999] overflow-hidden">
    <div className="h-full bg-[#9e1c20] shadow-[0_0_8px_#9e1c20,0_0_5px_#9e1c20] animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
    <style>{`
      @keyframes loading-bar {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(-30%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <CustomAuthProvider>
        <CartProvider>
          <ModalLogin />
          <Chatbot />
          <Suspense fallback={<PageLoader />}>
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
                <Route path="/" element={<Profile />}>
                  <Route path='/infomation' element={<Info/>}/>
                  <Route path='/my_order' element={<MyOrder/>}/>
                  <Route path='/settings' element={<Settings/>}/>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/signin" element={<Signin />} />
              <Route path='/admin' element={<Admin />}>
                <Route index element={<DashBoard />} />
                <Route path='products' element={<AdminProducts />} />
                <Route path='orders' element={<AdminOrders />} />
                <Route path='reviews' element={<AdminReviews />} />
                <Route path='reservations' element={<AdminReservations />} />
                <Route path='users' element={<ManageUser />} />
              </Route>
            </Routes>
          </Suspense>
        </CartProvider>
      </CustomAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
