/*
  This script drops the entire MongoDB database configured by MONGODB_URI
  or the default local database. Use with caution.
*/

const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shelead';

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`Connected to MongoDB database: ${dbName}`);

    const collections = await db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('No collections found. Database already empty.');
    } else {
      console.log(`Found ${collections.length} collections. Dropping database...`);
      await db.dropDatabase();
      console.log('Database dropped successfully.');
    }
  } catch (err) {
    console.error('Failed to reset database:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

run();


