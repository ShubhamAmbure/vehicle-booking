const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vehicles = require('./routes/vehicles');
const bookings = require('./routes/bookings');


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/vehicles', vehicles);
app.use('/api/bookings', bookings);


app.get('/', (req, res) => res.send('FleetLink API'));


module.exports = app;