// scripts/test-connection.js
const { getDb } = require('../common/db');

async function testConnection() {
  console.log("MONGODB_URI:", process.env.MONGODB_URI);
  console.log("MONGODB_DB:", process.env.MONGODB_DB);
  
  try {
    const db = await getDb();
    console.log("Connected to database:", db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    console.log("Connection test successful!");
  } catch (error) {
    console.error("Connection test failed:", error);
  }
}

testConnection().finally(() => process.exit());