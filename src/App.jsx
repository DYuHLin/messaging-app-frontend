import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './assets/Style.css'
import Sidebar from './Components/Sidebar'

function App() {
  return (
    <div className="root-layout">
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <ToastContainer position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition: Bounce/>
    </div>
  )
}

export default App
