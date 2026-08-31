// backend/routes/centres.js
const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/centres - List all procurement centres
router.get('/', (req, res) => {
  try {
    const centres = store.getAllCentres();
    return res.json({ success: true, count: centres.length, data: centres });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/centres/:id - Get specific centre details
router.get('/:id', (req, res) => {
  try {
    const centre = store.getCentreById(req.params.id);
    if (!centre) {
      return res.status(404).json({ success: false, error: 'Procurement centre not found' });
    }
    return res.json({ success: true, data: centre });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/centres/:id/slots?date=YYYY-MM-DD - Get live slots & remaining capacity
router.get('/:id/slots', (req, res) => {
  try {
    const { date } = req.query;
    const slots = store.getSlotsForCentre(req.params.id, date);
    if (!slots) {
      return res.status(404).json({ success: false, error: 'Procurement centre not found' });
    }
    return res.json({ success: true, data: slots });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/centres/:id/stats?date=YYYY-MM-DD - Live queue stats for centre
router.get('/:id/stats', (req, res) => {
  try {
    const { date } = req.query;
    const stats = store.getCentreStats(req.params.id, date);
    return res.json({ success: true, data: stats });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
