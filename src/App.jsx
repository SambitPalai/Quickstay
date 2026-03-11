import AddRoom from "./components/room/AddRoom.jsx"
import EditRoom from './components/room/EditRoom.jsx'
import ExistingRooms from './components/room/ExistingRooms.jsx'
import RoomListing from './components/room/RoomListing.jsx'
import Admin from './components/admin/Admin.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home/Home.jsx'
import NavBar from "./components/layout/NavBar.jsx"
import Footer from "./components/layout/Footer.jsx"
import Checkout from "./components/booking/Checkout.jsx"
import BookingSuccess from "./components/booking/BookingSuccess.jsx"
import Signup from "./components/auth/Signup.jsx"


function App() {

  return ( 
  <>
  <main>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/edit-room/:roomId" element={<EditRoom/>} />
        <Route path="/existing-rooms" element={<ExistingRooms/>} />
        <Route path="/add-room" element={<AddRoom/>} />
        <Route path="/book-room/:roomId" element={<Checkout />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/browse-all-rooms" element={<RoomListing/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </Router>
    <Footer />   
  </main>
  </>
)}

export default App
