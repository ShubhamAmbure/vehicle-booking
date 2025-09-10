const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { estimateDurationHours } = require('./vehicleController');


async function createBooking(req, res) {
	const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;
	if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) return res.status(400).json({ message: 'Missing fields' });

	const vehicle = await Vehicle.findById(vehicleId);
	if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

	const est = estimateDurationHours(fromPincode, toPincode);
	const start = new Date(startTime);
	const end = new Date(start.getTime() + est * 60 * 60 * 1000);

	const conflict = await Booking.findOne({
		vehicleId,
		$or: [
			{ startTime: { $lt: end }, endTime: { $gt: start } }
		]
	});
	if (conflict) return res.status(409).json({ message: 'Vehicle already booked for overlapping time' });

	const booking = await Booking.create({ vehicleId, fromPincode, toPincode, startTime: start, endTime: end, customerId });
	res.status(201).json(booking);
}


async function getAllBookings(req, res) {
	try {
		const bookings = await Booking.find().populate('vehicleId');
		res.json(bookings);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch bookings' });
	}
}

async function deleteBooking(req, res) {
	try {
		const { id } = req.params;
		const deleted = await Booking.findByIdAndDelete(id);
		if (!deleted) return res.status(404).json({ message: 'Booking not found' });
		res.json({ message: 'Booking cancelled' });
	} catch (err) {
		res.status(500).json({ message: 'Failed to cancel booking' });
	}
}

module.exports = { createBooking, getAllBookings, deleteBooking };