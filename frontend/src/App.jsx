import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AddVehicle from "./pages/AddVehicle";
import SearchAndBook from "./pages/SearchAndBook";
import Bookings from "./pages/Bookings";

function App() {
  return (
    <Router>
      <motion.nav 
        className="nav"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
            <Link className="nav-link" to="/">Add Vehicle</Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
            <Link className="nav-link" to="/search">Search & Book</Link>
            <Link className="nav-link" to="/bookings">Bookings</Link>
        </motion.div>
      </motion.nav>
      <Routes>
  <Route path="/" element={<AddVehicle />} />
  <Route path="/search" element={<SearchAndBook />} />
  <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </Router>
  );
}

export default App;