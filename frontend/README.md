
# FleetLink Logistics Booking System

FleetLink is a full-stack logistics vehicle booking system. It allows users to add vehicles, search for available vehicles, book them for specific routes and times, and manage bookings. The project is built with React (frontend), Node.js/Express (backend), and MongoDB (Atlas or local).

## Features
- Add new vehicles with capacity and tyre count
- Search for available vehicles by capacity, route, and time
- Book vehicles for specific time windows (no overlap allowed)
- List and cancel bookings
- Responsive, modern UI (no Tailwind)
- Robust backend with strict validation and overlap logic
- Environment-based MongoDB config (Atlas/local)
- Unit tests for booking logic

## Tech Stack
- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas or local
- **Testing:** Jest, Supertest

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
1. `cd backend`
2. Create a `.env` file with:
	```
	MONGODB_URI=your_mongodb_atlas_or_local_uri
	```
3. Install dependencies:
	```
	npm install
	```
4. Start the backend:
	```
	npm run dev
	```
5. Run tests:
	```
	npm test
	```

### Frontend Setup
1. `cd frontend`
2. Install dependencies:
	```
	npm install
	```
3. Create a `.env` file (optional) with:
	```
	VITE_API_URL=http://localhost:4000/api
	```
4. Start the frontend:
	```
	npm run dev
	```

## Usage
- Visit `http://localhost:5173` (or the port shown) to use the app.
- Add vehicles, search and book, and manage bookings from the UI.

## Project Structure

```
backend/
	src/
		controllers/
		models/
		routes/
		config/
		tests/
frontend/
	src/
		pages/
		api.js
		App.jsx
```

## API Endpoints

### Vehicles

**POST /api/vehicles**
- Add a new vehicle
- Body: `{ name: string, capacityKg: number, tyres: number }`
- Response: Created vehicle object

**GET /api/vehicles/available**
- Search for available vehicles
- Query params: `capacityRequired`, `fromPincode`, `toPincode`, `startTime` (ISO string)
- Response: `{ estimatedRideDurationHours: number, vehicles: [ ... ] }`

### Bookings

**POST /api/bookings**
- Create a new booking
- Body: `{ vehicleId, fromPincode, toPincode, startTime, customerId }`
- Response: Created booking object

**GET /api/bookings**
- List all bookings
- Response: Array of booking objects (with vehicle populated)

**DELETE /api/bookings/:id**
- Cancel a booking by ID
- Response: `{ message: 'Booking cancelled' }`
```

## License
MIT
