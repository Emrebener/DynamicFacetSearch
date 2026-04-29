const app = require('./app');
const env = require('./config/env');
const { connectToMongo } = require('./db/mongo');

async function start() {
  try {
    await connectToMongo();
    app.listen(env.port, () => {
      console.log(`Flexible Product Catalogue running at http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  }
}

start();

