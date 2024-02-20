const express = require('express');
const router = express.Router();
const plansController = require('../controllers/plans');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', plansController.getAllPlanEntries);

router.post('/', isAuthenticated, plansController.createPlanEntry);

router.get('/:id', isAuthenticated, plansController.getPlanEntryById);

router.put('/:id', isAuthenticated, plansController.updatePlanEntryById);

router.delete('/:id', isAuthenticated, plansController.deletePlanEntryById);

router.get('/user_id/:user_id', isAuthenticated, plansController.getPlanEntriesByUserId);

router.get('/user_id/:user_id/event_id/:event_id', isAuthenticated, plansController.getPlanEntriesByUserIdAndEventId);

module.exports = router;