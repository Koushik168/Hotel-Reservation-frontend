import './App.css'
import Layout from './layouts/Layout'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

// PAGES
import Register from './pages/Register'
import Login from './pages/Login'
import AddHotel from './pages/AddHotel'
import EditHotel from './pages/EditHotel'
import MyHotels from './pages/MyHotels'
import MainPage from './pages/MainPage'
import Details from './pages/Details'
import Info from './pages/Info'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminAddHotel from './pages/AdminAddHotel'
import AdminEditHotel from './pages/AdminEditHotel'
import BookHotel from './pages/BookHotel'
import MyBookings from './pages/MyBookings'



function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><MainPage /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/users/register" element={<Layout><Register /></Layout>} />
        <Route path="/add-hotel" element={<Layout><AddHotel /></Layout>} />
        <Route path="/my-hotels" element={<Layout><MyHotels /></Layout>} />
        <Route path="/auth/login" element={<Layout><Login /></Layout>} />
        <Route path="/my-hotels/edit/:id" element={<Layout><EditHotel /></Layout>}></Route>
        <Route path="/view/" element={<Layout><Details /></Layout>} />
        <Route path="info/" element={<Layout><Info /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-hotel" element={<AdminAddHotel />} />
        <Route path="/admin/hotels/edit/:id" element={<AdminEditHotel />} />

        {/* Booking Routes */}
        <Route path="/book/:hotelId" element={<Layout><BookHotel /></Layout>} />
        <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
