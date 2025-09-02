const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// 🌍 Environment
const port = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// 🔗 Database Connection
const dbConnect = require('./config/connection');

// ✅ Dynamic CORS Setup — MUST be first
// const allowedOrigins = [
//   'https://webzine.onrender.com',
//   'http://localhost:5173',
// ];
const allowedOrigins = ['*'];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 Incoming Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Preflight support

// 🛡️ Security & Performance
app.use(helmet());
app.use(compression());
app.use(express.json());

// 🚦 Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// 📁 Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📦 API Routes
const authRoutes = require('./routes/authRouter');
const adminRoutes = require('./routes/postRouter');
const categoryRoutes = require('./routes/categoryRouter');
const publicRouter = require('./routes/publicRouter');
const { log } = require('console');

app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/', publicRouter);

// 🖼️ Static Files – User Interface
app.use('/', express.static(path.join(__dirname, 'site-docs', 'dist')));
app.get('*', (req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/uploads') ||
    req.path.startsWith('/admin')
  ) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'site-docs', 'dist', 'index.html'));
});

// 🖥️ Static Files – Admin Panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// 🧪 Dev Logging
if (!isProd) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// 🚫 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ❌ Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 🚀 Start Server
dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🔗 API available at http://localhost:${port}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to the database:', err);
  });