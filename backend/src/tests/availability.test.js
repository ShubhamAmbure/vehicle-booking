const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

const app = require('../app');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { estimateDurationHours } = require('../controllers/vehicleController');


let mongod;


beforeAll(async () => {
mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();
await mongoose.connect(uri);
});


afterAll(async () => {
await mongoose.disconnect();
await mongod.stop();
});


afterEach(async () => {
await Vehicle.deleteMany();
await Booking.deleteMany();
});


test('POST /api/vehicles creates vehicle', async () => {
const res = await request(app).post('/api/vehicles').send({ name: 'Truck A', capacityKg: 1000, tyres: 6 });
expect(res.status).toBe(201);
expect(res.body.name).toBe('Truck A');
});


test('GET /api/vehicles/available respects overlapping bookings', async () => {
	const v = await Vehicle.create({ name: 'V1', capacityKg: 1000, tyres: 6 });
	const bookingStart = new Date('2025-01-01T10:00:00Z');
	const bookingEnd = new Date(bookingStart.getTime() + estimateDurationHours('1000', '1010') * 60 * 60 * 1000);
	await Booking.create({ vehicleId: v._id, fromPincode: '1000', toPincode: '1010', startTime: bookingStart, endTime: bookingEnd, customerId: 'c1' });

	const searchStart = bookingStart;
	const res = await request(app).get('/api/vehicles/available')
		.query({ capacityRequired: 500, fromPincode: '1000', toPincode: '1010', startTime: searchStart.toISOString() });

	expect(res.status).toBe(200);
	expect(res.body.vehicles.length).toBe(0);
});


test('POST /api/bookings creates booking and conflicts return 409', async () => {
const v = await Vehicle.create({ name: 'V2', capacityKg: 2000, tyres: 8 });
const res1 = await request(app).post('/api/bookings').send({ vehicleId: v._id, fromPincode: '2000', toPincode: '2010', startTime: '2025-01-01T10:00:00Z', customerId: 'u1' });
expect(res1.status).toBe(201);
const res2 = await request(app).post('/api/bookings').send({ vehicleId: v._id, fromPincode: '2005', toPincode: '2015', startTime: '2025-01-01T11:00:00Z', customerId: 'u2' });
expect(res2.status).toBe(409);
});