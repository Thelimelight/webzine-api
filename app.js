const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Environment
const port = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// Database Connection
const dbConnect = require("./config/connection");

// CORS Options
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://webzine.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Global Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight support
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", apiLimiter);

app.use("/uploads", (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.sendStatus(204);
  }

  next();
}, express.static(path.join(path.resolve(), "uploads")));

// Optional: Log origin of image requests
app.use((req, res, next) => {
  if (req.path.startsWith("/uploads")) {
    const referer = req.headers.referer || "unknown";
    console.log("🛰️ Upload request from referer:", referer);
  }
  next();
});

// API Routes
const authRoutes = require("./routes/authRouter");
const adminRoutes = require("./routes/postRouter");
const categoryRoutes = require("./routes/categoryRouter");
const publicRouter = require("./routes/publicRouter");

app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/", publicRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🔗 API available at http://localhost:${port}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to the database:", err);
  });