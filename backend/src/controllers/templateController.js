const templateService = require('../services/templateService');
const { Presentation } = require('../models/Presentation');
const logger = require('../utils/logger');

const getAllTemplates = (req, res, next) => {
  try {
    const templates = templateService.getTemplates();
    res.json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    next(error);
  }
};

const getTemplateById = (req, res, next) => {
  try {
    const { id } = req.params;
    const template = templateService.getTemplateById(id);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: `Template with id "${id}" not found.`
      });
    }
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

const useTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const presentationData = templateService.createPresentationFromTemplate(id, title);
    if (!presentationData) {
      return res.status(404).json({
        success: false,
        message: `Template with id "${id}" not found.`
      });
    }

    const created = await Presentation.create(presentationData);
    logger.info(`Created presentation ${created._id} from template "${id}"`);

    res.status(201).json({
      success: true,
      message: 'Presentation created from template successfully.',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTemplates,
  getTemplateById,
  useTemplate
};
