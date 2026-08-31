// backend/routes/bookings.js
const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/bookings - Filterable bookings list for staff and overview
router.get('/', (req, res) => {
  try {
    const { centreId, date, status, search } = req.query;
    const bookings = store.getBookingsList({ centreId, date, status, search });
    return res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/bookings/token/:token or GET /api/bookings/:token - Fetch single booking with queue position & SMS history
router.get('/:token', (req, res) => {
  try {
    const booking = store.getBookingByTokenOrMobile(req.params.token);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `No booking found matching Token or Mobile '${req.params.token}'. Please verify your details.`
      });
    }
    return res.json({ success: true, data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/bookings - Create new farmer slot booking
router.post('/', (req, res) => {
  try {
    const { farmerName, mobile, aadhaarLast4, cropId, quantity, centreId, date, slotId, source } = req.body;

    if (!farmerName || !mobile || !cropId || !centreId || !slotId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields (farmerName, mobile, cropId, centreId, slotId are mandatory).'
      });
    }

    if (mobile.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit mobile number for SMS notifications.'
      });
    }

    const newBooking = store.createBooking({
      farmerName,
      mobile,
      aadhaarLast4,
      cropId,
      quantity: parseFloat(quantity) || 10,
      centreId,
      date,
      slotId,
      source: source || 'WEB'
    });

    const enriched = store.getBookingByTokenOrMobile(newBooking.token);
    return res.status(201).json({
      success: true,
      message: 'Slot booked successfully! SMS Token dispatched.',
      data: enriched
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH /api/bookings/:id/status - Staff updates farmer status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, note, moistureContent, qualityGrade, weighedQuantity, utrNumber, bankName } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required.' });
    }

    const updated = store.advanceBookingStatus(req.params.id, status, {
      note,
      moistureContent,
      qualityGrade,
      weighedQuantity,
      utrNumber,
      bankName
    });

    return res.json({
      success: true,
      message: `Status updated to ${status} successfully.`,
      data: updated
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/bookings/ivr-simulate - Simulate IVR phone call booking
router.post('/ivr-simulate', (req, res) => {
  try {
    const { mobile, centreId, cropId, quantity } = req.body;
    const today = store.getTodayDateString(0);
    const slots = store.getSlotsForCentre(centreId || 'KRN-01', today);
    const availableSlot = slots.find(s => s.status !== 'FULL') || slots[0];

    const booking = store.createBooking({
      farmerName: 'Kisan Mitra (IVR Caller)',
      mobile: mobile || '9800011223',
      aadhaarLast4: '9999',
      cropId: cropId || 'WHEAT',
      quantity: quantity || 25,
      centreId: centreId || 'KRN-01',
      date: today,
      slotId: availableSlot.id,
      source: 'IVR_VOICE_CALL'
    });

    return res.status(201).json({
      success: true,
      message: 'IVR Booking simulated successfully.',
      data: store.getBookingByTokenOrMobile(booking.token)
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
