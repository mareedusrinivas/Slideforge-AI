const express = require('express');
const router = express.Router();
const presentationRoutes = require('./presentationRoutes');
const aiRoutes = require('./aiRoutes');
const uploadRoutes = require('./uploadRoutes');
const templateRoutes = require('./templateRoutes');
const { getIsMongoConnected } = require('../config/db');
const aiService = require('../services/aiService');

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SlideForge AI Backend',
    database: getIsMongoConnected() ? 'mongodb' : 'fallback-persistent-json',
    ai: aiService.getStatus()
  });
});

router.use('/presentations', presentationRoutes);
router.use('/ai', aiRoutes);
router.use('/uploads', uploadRoutes);
router.use('/templates', templateRoutes);

module.exports = router;
