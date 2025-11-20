// common/db.js
const { MongoClient } = require("mongodb");

let cachedDb;

async function getDb() {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "mock_oauth";
  if (!uri) throw new Error("MONGODB_URI not set");

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 3 });
  await client.connect();
  cachedDb = client.db(dbName);
  return cachedDb;
}

module.exports = { getDb };
