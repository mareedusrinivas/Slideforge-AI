const { Presentation } = require('../models/Presentation');
const { createSlideFromLayout, THEME_PRESETS } = require('../utils/canvasDefaults');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const getAllPresentations = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) query.search = search;
    const presentations = await Presentation.find(query);
    res.json({
      success: true,
      count: presentations.length,
      data: presentations
    });
  } catch (error) {
    next(error);
  }
};

const getPresentationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const presentation = await Presentation.findById(id);
    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: `Presentation with id "${id}" not found.`
      });
    }
    res.json({
      success: true,
      data: presentation
    });
  } catch (error) {
    next(error);
  }
};

const createPresentation = async (req, res, next) => {
  try {
    const { title, themeId, templateId } = req.body;
    const selectedTheme = THEME_PRESETS[themeId] || THEME_PRESETS.modernIndigo;

    // Create an initial title slide
    const initialSlide = createSlideFromLayout('title', selectedTheme, title || 'Untitled Presentation');

    const newPresentationData = {
      title: title || 'Untitled Presentation',
      theme: selectedTheme,
      slideOrder: [initialSlide.id],
      slides: [initialSlide],
      dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' }
    };

    const created = await Presentation.create(newPresentationData);
    logger.info(`Created presentation: ${created._id} - "${created.title}"`);
    res.status(201).json({
      success: true,
      data: created
    });
  } catch (error) {
    next(error);
  }
};

const updatePresentation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Presentation.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Presentation with id "${id}" not found.`
      });
    }

    res.json({
      success: true,
      message: 'Presentation updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

const patchPresentation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Presentation.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Presentation with id "${id}" not found.`
      });
    }

    res.json({
      success: true,
      message: 'Presentation patched successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

const deletePresentation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Presentation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Presentation with id "${id}" not found.`
      });
    }

    logger.info(`Deleted presentation: ${id}`);
    res.json({
      success: true,
      message: 'Presentation deleted successfully.',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

const duplicatePresentation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const original = await Presentation.findById(id);
    if (!original) {
      return res.status(404).json({
        success: false,
        message: `Presentation with id "${id}" not found.`
      });
    }

    // Deep clone slides with fresh IDs
    const clonedSlides = (original.slides || []).map(slide => {
      const newSlideId = uuidv4();
      const clonedElements = (slide.elements || []).map(el => ({
        ...el,
        id: uuidv4()
      }));

      return {
        ...slide,
        id: newSlideId,
        elements: clonedElements
      };
    });

    const duplicateData = {
      title: `${original.title} (Copy)`,
      description: original.description || '',
      theme: original.theme,
      slideOrder: clonedSlides.map(s => s.id),
      slides: clonedSlides,
      dimensions: original.dimensions || { width: 1920, height: 1080, aspectRatio: '16:9' },
      thumbnail: original.thumbnail || ''
    };

    const created = await Presentation.create(duplicateData);
    logger.info(`Duplicated presentation ${id} -> ${created._id}`);
    res.status(201).json({
      success: true,
      message: 'Presentation duplicated successfully.',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPresentations,
  getPresentationById,
  createPresentation,
  updatePresentation,
  patchPresentation,
  deletePresentation,
  duplicatePresentation
};
