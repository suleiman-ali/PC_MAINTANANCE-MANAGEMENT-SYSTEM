import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import Services from './pages/Services'
import BookService from './pages/BookService'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import ManageServices from './pages/ManageServices'
import AllBookings from './pages/AllBookings'
import Navbar from './components/Navbar'
import './App.css'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (adminOnly && !user.is_admin) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

function App() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>
  }
  
  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              {user?.is_admin ? <Navigate to="/admin" /> : <UserDashboard />}
            </PrivateRoute>
          } />
          <Route path="/services" element={
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          } />
          <Route path="/book/:serviceId?" element={
            <PrivateRoute>
              <BookService />
            </PrivateRoute>
          } />
          <Route path="/my-bookings" element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute adminOnly>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/services" element={
            <PrivateRoute adminOnly>
              <ManageServices />
            </PrivateRoute>
          } />
          <Route path="/admin/bookings" element={
            <PrivateRoute adminOnly>
              <AllBookings />
            </PrivateRoute>
          } />
          
          {/* Default Redirect */}
          <Route path="/" element={
            user ? (
              user.is_admin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
            ) : <Navigate to="/login" />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
