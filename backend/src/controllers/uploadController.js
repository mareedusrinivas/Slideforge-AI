const path = require('path');
const logger = require('../utils/logger');

const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded or file type is not supported.'
      });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    logger.info(`File uploaded: ${req.file.filename} (${req.file.size} bytes)`);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage
};
