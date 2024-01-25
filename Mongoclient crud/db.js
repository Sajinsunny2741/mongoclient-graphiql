const { MongoClient } = require("mongodb");

const connectionString = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(connectionString);

async function connect() {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
}

module.exports = { connect, client };
