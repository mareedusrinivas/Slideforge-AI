const aiService = require('../services/aiService');
const { Presentation } = require('../models/Presentation');
const logger = require('../utils/logger');

const getStatus = async (req, res, next) => {
  try {
    const status = aiService.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
};

const chat = async (req, res, next) => {
  try {
    const { message, context, scope } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.'
      });
    }

    const response = await aiService.chat({ message, context, scope });
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const generatePresentation = async (req, res, next) => {
  try {
    const { topic, slideCount = 5, tone = 'Professional', style = 'obsidianViolet' } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Presentation topic is required.'
      });
    }

    const presentationData = await aiService.generatePresentation({
      topic,
      slideCount: Math.min(Math.max(parseInt(slideCount, 10) || 5, 2), 10),
      tone,
      style
    });

    // Save directly to repository
    const saved = await Presentation.create(presentationData);
    logger.info(`AI generated complete presentation: ${saved._id} for topic: "${topic}"`);

    res.status(201).json({
      success: true,
      message: 'Presentation generated successfully.',
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

const editSlide = async (req, res, next) => {
  try {
    const { slide, instruction, theme } = req.body;

    if (!slide || !instruction) {
      return res.status(400).json({
        success: false,
        message: 'Slide and instruction are required.'
      });
    }

    const response = await aiService.editSlide({ slide, instruction, theme });
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const generateImage = async (req, res, next) => {
  try {
    const { prompt, style } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Image prompt is required.'
      });
    }

    const result = await aiService.generateImage({ prompt, style });
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatus,
  chat,
  generatePresentation,
  editSlide,
  generateImage
};
