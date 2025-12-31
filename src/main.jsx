import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
        <Route index element={<Home />} />
        <Route path="/about" element={<div>About Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
