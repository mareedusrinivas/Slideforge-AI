const mongoose = require('mongoose');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;
const dataDir = path.join(__dirname, '../../data');
const fallbackFile = path.join(dataDir, 'presentations.json');

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(fallbackFile)) {
    fs.writeFileSync(fallbackFile, JSON.stringify([]), 'utf-8');
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/slideforge';
  ensureDataDir();

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if Mongo isn't running locally
    });
    isMongoConnected = true;
    logger.info(`MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isMongoConnected = false;
    logger.warn(`MongoDB not reachable at ${uri}. Activating persistent local storage fallback: ${fallbackFile}`);
    logger.info('Presentations will be safely persisted to backend/data/presentations.json');
    return null;
  }
};

const getIsMongoConnected = () => isMongoConnected;

module.exports = {
  connectDB,
  getIsMongoConnected,
  fallbackFile
};
