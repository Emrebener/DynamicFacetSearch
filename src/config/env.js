require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/product_catalogue',
  mongoDbName: process.env.MONGO_DB_NAME || 'product_catalogue',
};

