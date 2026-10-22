require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const logger = require('./utils/logger');
const { Presentation } = require('./models/Presentation');
const templateService = require('./services/templateService');

const PORT = process.env.PORT || 5000;

const seedInitialDataIfEmpty = async () => {
  try {
    const existing = await Presentation.find({});
    if (!existing || existing.length === 0) {
      logger.info('Database is empty. Seeding realistic starter presentation...');
      const seedDeck = templateService.createPresentationFromTemplate('business-pitch-deck', 'NexusAI - Pitch Deck');
      if (seedDeck) {
        await Presentation.create(seedDeck);
        logger.info('Successfully seeded starter presentation: "NexusAI - Pitch Deck"');
      }
    }
  } catch (err) {
    logger.warn('Seed data check skipped or failed:', err.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedInitialDataIfEmpty();

    app.listen(PORT, () => {
      logger.info(`===================================================`);
      logger.info(`🚀 SlideForge AI Backend running on port ${PORT}`);
      logger.info(`🔗 API Health: http://localhost:${PORT}/api/health`);
      logger.info(`===================================================`);
    });
  } catch (error) {
    logger.error('Failed to start SlideForge AI backend:', error.message);
    process.exit(1);
  }
};

startServer();
