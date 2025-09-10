const mongoose = require('mongoose');


function getMongoUri() {
  return (
    process.env.MONGODB_URI
  );
}

async function connect(uri) {
  if (!uri) uri = getMongoUri();
  return mongoose.connect(uri, { dbName: 'fleetlink' });
}


module.exports = { connect };