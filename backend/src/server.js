
require('dotenv').config();
const app = require('./app');
const db = require('./config/db');


const PORT = process.env.PORT || 4000;
console.log('Starting backend server (development)');

db.connect().then(() => {
app.listen(PORT, () => console.log('Server running on', PORT));
}).catch(err => {
console.error('DB connect failed', err);
process.exit(1);
});