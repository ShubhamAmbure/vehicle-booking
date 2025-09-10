
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

function estimateDurationHours(fromPincode, toPincode) {
	const from = parseInt(fromPincode);
	const to = parseInt(toPincode);
	if (isNaN(from) || isNaN(to)) return 1;
	const a = Math.abs(to - from);
	const hours = a % 24;
	return hours === 0 ? 1 : hours;
}

async function addVehicle(req, res) {
	try {
		const { name, capacityKg, tyres } = req.body;
		if (
			!name ||
			typeof name !== 'string' ||
			typeof capacityKg !== 'number' ||
			typeof tyres !== 'number' ||
			isNaN(capacityKg) ||
			isNaN(tyres)
		) {
			return res.status(400).json({ message: 'Invalid payload' });
		}
		const v = await Vehicle.create({ name, capacityKg, tyres });
		return res.status(201).json(v);
	} catch (err) {
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
}

async function getAvailableVehicles(req, res) {
	try {
		const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
		if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
			return res.status(400).json({ message: 'Missing query params' });
		}
		const capacity = Number(capacityRequired);
		if (isNaN(capacity) || capacity <= 0) {
			return res.status(400).json({ message: 'Invalid capacityRequired' });
		}
		const est = estimateDurationHours(fromPincode, toPincode);
		const start = new Date(startTime);
		if (isNaN(start.getTime())) {
			return res.status(400).json({ message: 'Invalid startTime' });
		}
		const end = new Date(start.getTime() + est * 60 * 60 * 1000);

		const candidates = await Vehicle.find({ capacityKg: { $gte: capacity } });
		const vehicleIds = candidates.map(v => v._id);

		const overlapping = await Booking.find({
			vehicleId: { $in: vehicleIds },
			$or: [
				{ startTime: { $lt: end }, endTime: { $gt: start } }
			]
		}).distinct('vehicleId');

		const available = candidates.filter(
			v => !overlapping.map(id => id.toString()).includes(v._id.toString())
		);

		return res.json({ estimatedRideDurationHours: est, vehicles: available });
	} catch (err) {
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
}

module.exports = { addVehicle, getAvailableVehicles, estimateDurationHours };