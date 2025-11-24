const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// Seed demo vehicles and an optional booking. This is intended for local
// development / demo only. It will create vehicles if they don't already exist.
router.post('/seed', async (req, res) => {
  try {
    const existing = await Vehicle.find().limit(1);
    if (existing.length > 0) {
      return res.json({ message: 'Demo data already present' });
    }

    const vehicles = await Vehicle.create([
      { name: 'Small Truck', capacityKg: 500, tyres: 4 },
      { name: 'Medium Truck', capacityKg: 1500, tyres: 6 },
      { name: 'Large Truck', capacityKg: 4000, tyres: 8 },
    ]);

    // Optionally create a booking for the medium truck to demonstrate overlap
    const medium = vehicles.find(v => v.name.includes('Medium'));
    if (medium) {
      const now = new Date();
      const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      await Booking.create({
        vehicleId: medium._id,
        fromPincode: '400001',
        toPincode: '400050',
        startTime: start,
        endTime: end,
        customerId: 'demo-cust',
      });
    }

    return res.json({ message: 'Demo data seeded', vehicles });
  } catch (err) {
    return res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

module.exports = router;
