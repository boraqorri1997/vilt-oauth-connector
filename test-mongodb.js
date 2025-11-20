// test-mongodb.js - Place this in your project root
const { MongoClient } = require('mongodb');

async function testMongoDB() {
  console.log("Starting MongoDB connection test");
  
  // Hardcoded connection string
  const uri = "mongodb+srv://boraqorri_db_user:DQPlRvArs9ADwv4O@mockoauth.7mc8a3d.mongodb.net/mock_oauth?retryWrites=true&w=majority";
  const dbName = "mock_oauth";
  
  console.log(`Connecting to: ${dbName}`);
  console.log(`Using URI: ${uri.replace(/\/\/(.+?)@/, '//****:****@')}`);
  
  try {
    const client = new MongoClient(uri, { 
      serverSelectionTimeoutMS: 5000, 
      maxPoolSize: 3 
    });
    
    console.log("Attempting connection...");
    await client.connect();
    console.log("Connection successful!");
    
    const db = client.db(dbName);
    console.log(`Connected to database: ${db.databaseName}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Create a test document
    if (collections.length === 0 || !collections.some(c => c.name === 'clients')) {
      console.log("Creating 'clients' collection...");
      await db.createCollection('clients');
    }
    
    console.log("Inserting test document...");
    const result = await db.collection('clients').insertOne({
      clientId: 'testvilt',
      clientSecret: 'testsecret',
      testField: 'This is a test',
      createdAt: new Date()
    });
    
    console.log("Document inserted:", result.insertedId);
    
    // Find the document
    const doc = await db.collection('clients').findOne({ clientId: 'testvilt' });
    console.log("Found document:", doc);
    
    // Close connection
    await client.close();
    console.log("Connection closed");
    
    return true;
  } catch (error) {
    console.error("MongoDB test failed:", error);
    return false;
  }
}

testMongoDB()
  .then(success => {
    console.log("Test completed:", success ? "SUCCESS" : "FAILED");
    process.exit(0);
  })
  .catch(err => {
    console.error("Unexpected error:", err);
    process.exit(1);
  });