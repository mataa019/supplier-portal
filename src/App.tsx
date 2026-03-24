import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './component/PrivateRoute';
import Welcome from './Auth/Welcome'
import Login from './Auth/login'
import Register from './Auth/register'
import VerifyOtp from './Auth/VerifyOtp'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './dashboard/home'
import Categories from './dashboard/Categories'
import Application from './dashboard/ApplyCategory'
import Documents from './dashboard/document'
import Payment from './dashboard/Payment'
import Submit from './dashboard/Submit'
import Applications from './dashboard/Applications'

// Admin imports
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './admin/Dashboard'
import AdminSuppliers from './admin/Suppliers'
import AdminApplications from './admin/Applications'
import AdminPayments from './admin/Payments'
import AdminCategories from './admin/Categories'
import AdminUsers from './admin/Users'
import ProfilePage from './dashboard/profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* Protected Supplier Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="categories" element={<Categories />} />
            <Route path="apply" element={<Application />} />
            <Route path="documents" element={<Documents />} />
            <Route path="payment" element={<Payment />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="submit" element={<Submit />} />
            <Route path="applications" element={<Applications />} />
          </Route>
          {/* Protected Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="suppliers" element={<AdminSuppliers />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

