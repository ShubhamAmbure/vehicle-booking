const mongoose = require('mongoose');

// Connect to MongoDB.
// - If MONGODB_URI is provided, use it.
// - If not provided and NODE_ENV !== 'production', start an in-memory
//   MongoDB for development/testing using mongodb-memory-server.
// - If not provided and NODE_ENV === 'production', throw a clear error so
//   deployments fail fast and you set the required env var (MONGODB_URI).
async function connect(uri) {
  if (!uri) {
    uri = process.env.MONGODB_URI;
  }

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI is not set. In production you must set MONGODB_URI to a valid MongoDB connection string.');
    }

    // Development fallback: start an in-memory MongoDB so developers can run
    // the project with no extra setup.
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    console.log('Started in-memory MongoDB for development');
  }

  return mongoose.connect(uri, { dbName: 'fleetlink' });
}

module.exports = { connect };