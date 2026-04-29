const { MongoClient } = require('mongodb');
const env = require('../config/env');

let client;
let db;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function connectToMongo() {
  if (db) {
    return db;
  }

  const maxAttempts = 10;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      client = new MongoClient(env.mongoUri);
      await client.connect();
      db = client.db(env.mongoDbName);
      break;
    } catch (error) {
      client = undefined;

      if (attempt === maxAttempts) {
        throw error;
      }

      console.log(`MongoDB connection failed, retrying (${attempt}/${maxAttempts})...`);
      await wait(1000);
    }
  }

  await getProductsCollection().createIndexes([
    { key: { category: 1 }, name: 'category_idx' },
    { key: { name: 1 }, name: 'name_idx' },
    { key: { createdAt: -1 }, name: 'created_at_idx' },
  ]);

  return db;
}

function getDb() {
  if (!db) {
    throw new Error('MongoDB has not been connected');
  }

  return db;
}

function getProductsCollection() {
  return getDb().collection('products');
}

async function closeMongo() {
  if (client) {
    await client.close();
  }

  client = undefined;
  db = undefined;
}

module.exports = {
  connectToMongo,
  getDb,
  getProductsCollection,
  closeMongo,
};
