import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './Auth/Welcome'
import Login from './Auth/login'
import Register from './Auth/register'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './dashboard/home'
import Categories from './dashboard/Categories'
import Application from './dashboard/Application'
import Documents from './dashboard/document'
import Payment from './dashboard/Payment'
import Submit from './dashboard/Submit'
import Applications from './dashboard/Applications'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="categories" element={<Categories />} />
          <Route path="apply" element={<Application />} />
          <Route path="documents" element={<Documents />} />
          <Route path="payment" element={<Payment />} />
          <Route path="submit" element={<Submit />} />
          <Route path="applications" element={<Applications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

