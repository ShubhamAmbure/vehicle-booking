import { useState, useRef } from "react";
import { motion } from "framer-motion";
import api from "../api";

export default function AddVehicle() {
  const [name, setName] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [tyres, setTyres] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef();
  const capacityRef = useRef();
  const tyresRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/vehicles", {
        name,
        capacityKg: parseInt(capacityKg),
        tyres: parseInt(tyres),
      });
      setMessage("✅ Vehicle added successfully!");
      setName("");
      setCapacityKg("");
      setTyres("");
      if (nameRef.current) nameRef.current.focus();
    } catch {
      setMessage("❌ Failed to add vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (capacityRef.current) capacityRef.current.focus();
    }
  };
  const handleCapacityKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tyresRef.current) tyresRef.current.focus();
    }
  };
  const handleTyresKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tyresRef.current) tyresRef.current.blur();
    }
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h1 
        className="heading heading-add"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        🚛 Add Vehicle
      </motion.h1>
      <form onSubmit={handleSubmit} className="form">
        <motion.input
          className="input"
          placeholder="Vehicle Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          ref={nameRef}
          onKeyDown={handleNameKeyDown}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <br />
        <motion.input
          className="input"
          placeholder="Capacity (Kg)"
          type="number"
          value={capacityKg}
          onChange={(e) => setCapacityKg(e.target.value)}
          required
          ref={capacityRef}
          onKeyDown={handleCapacityKeyDown}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
        <br />
        <motion.input
          className="input"
          placeholder="Tyres"
          type="number"
          value={tyres}
          onChange={(e) => setTyres(e.target.value)}
          required
          ref={tyresRef}
          onKeyDown={handleTyresKeyDown}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
        <br />
        <motion.button 
          type="submit" 
          className="button button-primary"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Adding...
            </>
          ) : (
            "Add Vehicle"
          )}
        </motion.button>
      </form>
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