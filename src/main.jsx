import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginView from './routes/LoginView.jsx' 
import DashboardView from './routes/DashboardView.jsx' 
import EditProfileView from './routes/EditProfileView.jsx'
import SignOutView from './routes/SignOutView.jsx' 
import PublicProfileView from './routes/PublicProfileView.jsx' 
import ChooseUsernameView from './routes/ChooseUsernameView.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='login' element={<LoginView />} />
      <Route path='dashboard' element={<DashboardView />} />
      <Route path='dashboard/profile' element={<EditProfileView />} />
      <Route path='signout' element={<SignOutView />} />
      <Route path='u/:username' element={<PublicProfileView />} />
      <Route path='choose-username' element={<ChooseUsernameView />} />
    </Routes>
  </BrowserRouter>
)
