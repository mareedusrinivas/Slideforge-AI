const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');

router.get('/', presentationController.getAllPresentations);
router.post('/', presentationController.createPresentation);
router.get('/:id', presentationController.getPresentationById);
router.put('/:id', presentationController.updatePresentation);
router.patch('/:id', presentationController.patchPresentation);
router.delete('/:id', presentationController.deletePresentation);
router.post('/:id/duplicate', presentationController.duplicatePresentation);

module.exports = router;
