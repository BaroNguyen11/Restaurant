
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <div className="header"></div>
      <div className="content">
        <Outlet />
      </div>
      <div className="footer"></div>
    </>
  )
}

export default App
