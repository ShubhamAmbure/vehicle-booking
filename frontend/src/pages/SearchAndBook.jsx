import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

export default function SearchAndBook() {
  const toastRef = useRef();
  const [capacityRequired, setCapacityRequired] = useState("");
  const [fromPincode, setFromPincode] = useState("");
  const [toPincode, setToPincode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [estimatedDuration, setEstimatedDuration] = useState(null);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [bookingLoadingId, setBookingLoadingId] = useState(null);

  const handleSearch = async () => {
    setIsSearching(true);
    setMessage("");
    setVehicles([]);
    setEstimatedDuration(null);
    try {
      const res = await api.get("/vehicles/available", {
        params: { capacityRequired, fromPincode, toPincode, startTime },
      });
      if (res.data.vehicles) {
        setVehicles(res.data.vehicles);
        setEstimatedDuration(res.data.estimatedRideDurationHours);
        setMessage(res.data.vehicles.length === 0 ? "No vehicles available" : "");
      } else {
        setVehicles([]);
        setEstimatedDuration(null);
        setMessage("No vehicles available");
      }
    } catch {
      setMessage("\u274c Failed to search vehicles");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBook = async (vehicleId) => {
    setBookingLoadingId(vehicleId);
    setMessage("");
    try {
      await api.post("/bookings", {
        vehicleId,
        fromPincode,
        toPincode,
        startTime,
        customerId: "cust123",
      });
      setMessage("✅ Booking successful!");
      handleSearch();
      if (toastRef.current) {
        toastRef.current.textContent = "Booking successful!";
        toastRef.current.style.display = "block";
        setTimeout(() => {
          if (toastRef.current) toastRef.current.style.display = "none";
        }, 2000);
      }
    } catch (err) {
      setMessage(err.response?.status === 409 ? "❌ Vehicle already booked" : "❌ Booking failed");
    } finally {
      setBookingLoadingId(null);
    }
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div ref={toastRef} style={{display:'none',position:'fixed',top:'2rem',right:'2rem',background:'#2563eb',color:'#fff',padding:'1rem 2rem',borderRadius:'8px',zIndex:1000,fontWeight:600,boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}}>Booking successful!</div>
      <motion.h1
        className="heading heading-search"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        🔍 Search & Book
      </motion.h1>
      <form className="form" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
        {isSearching && <div>Searching vehicles...</div>}
        {estimatedDuration && (
          <div className="message">Estimated ride duration: {estimatedDuration} hour(s)</div>
        )}
        <motion.input
          className="input"
          placeholder="Required Capacity (Kg)"
          type="number"
          value={capacityRequired}
          onChange={(e) => setCapacityRequired(e.target.value)}
          required
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <br />
      <div style={{margin:'1rem 0'}}>
        <button
          className="button button-secondary"
          onClick={async () => {
            setMessage('Seeding demo data...');
            try {
              await api.post('/debug/seed');
              setMessage('Demo data seeded — searching...');
              // small delay to allow the backend to persist
              setTimeout(() => handleSearch(), 500);
            } catch (err) {
              setMessage('Failed to seed demo data');
            }
          }}
        >
          Load Demo Data
        </button>
      </div>
      <motion.input
        className="input"
        placeholder="From Pincode"
        value={fromPincode}
        onChange={(e) => setFromPincode(e.target.value)}
        required
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
        <br />
        <motion.input
          className="input"
          placeholder="To Pincode"
          value={toPincode}
          onChange={(e) => setToPincode(e.target.value)}
          required
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
        <br />
        <motion.div
          className="datetime-input-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <input
            className="datetime-input"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </motion.div>
        <br />
        <motion.button
          type="submit"
          className="button button-secondary"
          disabled={isSearching}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          {isSearching ? (
            <>
              <div className="spinner"></div>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </motion.button>
      </form>

      <AnimatePresence>
        {vehicles.length > 0 && (
          <motion.div
            className="vehicle-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {vehicles.map((v, index) => (
              <motion.div
                key={v._id}
                className="vehicle-card"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, boxShadow: "var(--shadow-md)" }}
              >
                <div className="vehicle-info">
                  <p className="vehicle-name">{v.name}</p>
                  <p className="vehicle-details">
                    {v.capacityKg} Kg • {v.tyres} tyres
                  </p>
                </div>
                <motion.button
                  onClick={() => handleBook(v._id)}
                  className="button button-book"
                  disabled={bookingLoadingId === v._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {bookingLoadingId === v._id ? (
                    <>
                      <div className="spinner"></div>
                      Booking...
                    </>
                  ) : (
                    "Book"
                  )}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {message && (
        <motion.p
          className="message"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}