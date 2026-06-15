const express    = require('express');
const path       = require('path');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const config          = require('./config');
const portfolioRoutes = require('../modules/portfolio/portfolio.routes');

function createApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '10kb' }));

  const allowedOrigins = [
    'https://vediyukti.works',
    'https://www.vediyukti.works',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
  ];

  app.use(cors({
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
