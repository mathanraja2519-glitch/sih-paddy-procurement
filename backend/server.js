// backend/server.js
const express = require('express');
const cors = require('cors');
const store = require('./data/store');
const centresRouter = require('./routes/centres');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins during hackathon / local dev
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/centres', centresRouter);
app.use('/api/bookings', bookingsRouter);

// GET /api/crops - List of supported crops with MSP rates
app.get('/api/crops', (req, res) => {
  try {
    const crops = store.getAllCrops();
    return res.json({ success: true, count: crops.length, data: crops });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'healthy',
    service: 'DoCA Smart Mandi Procurement API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

const path = require('path');

// Serve static frontend assets in production if built
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Fallback to React index.html for non-API client routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: `Endpoint '${req.originalUrl}' not found on this server.`
    });
  }
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

// Global 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' not found on this server.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🌾 DoCA Smart Mandi Procurement REST API`);
  console.log(`  🚀 Running on: http://localhost:${PORT}`);
  console.log(`  📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

module.exports = app;
