const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { upload } = require('../services/storageService');

router.post('/', upload.single('file'), uploadController.uploadImage);

module.exports = router;
