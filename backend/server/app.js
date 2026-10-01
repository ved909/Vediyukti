const express    = require('express');
const path       = require('path');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const config          = require('./config');
const portfolioRoutes = require('../modules/portfolio/portfolio.routes');

function createApp() {
  const app = express();

  // Render (and most hosts) put a proxy in front of the app. Without this, every visitor
  // looks like the same IP and shares one rate-limit bucket.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc    : ["'self'"],
        scriptSrc     : ["'self'"],
        styleSrc      : ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://api.fontshare.com'],
        fontSrc       : ["'self'", 'https://fonts.gstatic.com', 'https://api.fontshare.com', 'https://cdn.fontshare.com'],
        imgSrc        : ["'self'", 'data:', 'https://*.cdninstagram.com', 'https://*.fbcdn.net'],
        connectSrc    : ["'self'"],
        frameSrc      : ["'none'"],
        objectSrc     : ["'none'"],
        baseUri       : ["'self'"],
        formAction    : ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }));
  app.use(express.json({ limit: '10kb' }));

  const allowedOrigins = [
    'https://vediyukti.works',
    'https://www.vediyukti.works',
    'https://vediyukti.onrender.com',
    'http://localhost:5000',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
  ];

  app.use('/api/', cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
  }));

  // Rate limit
  app.use('/api/', rateLimit({
    windowMs : 15 * 60 * 1000,
    max      : 30,
    message  : { success: false, message: 'Too many requests. Please try again later.' },
  }));

  app.use('/api/instagram', portfolioRoutes);

  app.get('/api/health', (_req, res) =>
    res.json({ status: 'ok', time: new Date().toISOString() })
  );

  app.use(express.static(path.resolve(__dirname, '..', '..', 'frontend')));

  app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

  return app;
}

module.exports = createApp;
