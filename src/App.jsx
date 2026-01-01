
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const location = useLocation();
  const noMarginPages = ['/signin', '/signup'];
  const isNoMargin = noMarginPages.includes(location.pathname);
  return (
    <>
      <div className={isNoMargin ? 'pt-0' : 'pt-20'}>
        <div className="header">
          <Header />
        </div>
        <div className="content">
          <Outlet />
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
