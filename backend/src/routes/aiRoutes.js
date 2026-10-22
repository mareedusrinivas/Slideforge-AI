const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/status', aiController.getStatus);
router.post('/chat', aiController.chat);
router.post('/generate-presentation', aiController.generatePresentation);
router.post('/edit-slide', aiController.editSlide);
router.post('/generate-image', aiController.generateImage);

module.exports = router;
