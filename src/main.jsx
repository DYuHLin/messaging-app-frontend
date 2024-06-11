import React from 'react'
import ReactDOM from 'react-dom/client'
import { UserProvider } from './Context/UserContext'
import Router from './Router.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  </UserProvider>
)
