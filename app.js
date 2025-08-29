const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Environment
const port = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Database
const dbConnect = require('./config/connection');

// CORS Setup
const corsOptions = {
  origin: isProd
    ? ['http://localhost:5173'] // domain name
    : ['http://localhost:5173', 'http://localhost:5000'],
};
app.use(cors(corsOptions));

// Security & Performance
app.use(helmet());
app.use(compression());
app.use(express.json());

// ✅ Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes (Express 5–safe with try-catch)
try {
  const authRoutes = require('./routes/authRouter');
  app.use('/api/auth', authRoutes);
} catch (err) {
  console.error('❌ Error loading authRouter:', err);
}

try {
  const adminRoutes = require('./routes/postRouter');
  app.use('/api', adminRoutes);
} catch (err) {
  console.error('❌ Error loading postRouter:', err);
}

try {
  const categoryRoutes = require('./routes/categoryRouter');
  app.use('/api/categories', categoryRoutes);
} catch (err) {
  console.error('❌ Error loading categoryRouter:', err);
}

try {
  const publicRouter = require('./routes/publicRouter');
  app.use('/', publicRouter);
} catch (err) {
  console.error('❌ Error loading publicRouter:', err);
}

// ✅ Static Files (Frontend - user interface)
app.use('/', express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/uploads') ||
    req.path.startsWith('/admin')
  ) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ✅ Static Files (Frontend - admin panel)
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Optional: Log requests during development
if (!isProd) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ✅ Start Server
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