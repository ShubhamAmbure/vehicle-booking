const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vehicles = require('./routes/vehicles');
const bookings = require('./routes/bookings');
const debug = require('./routes/debug');


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/vehicles', vehicles);
app.use('/api/bookings', bookings);
app.use('/api/debug', debug);


app.get('/', (req, res) => res.send('FleetLink API'));


module.exports = app;