const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// 🌍 Environment
const port = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// 🔗 Database Connection
const dbConnect = require("./config/connection");

// ✅ CORS Options
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
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 🛡️ Security & Performance
app.use(helmet());
app.use(compression());
app.use(express.json());

// 🚦 Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", apiLimiter);

// 📁 Static Uploads
app.use(
  "/uploads",
  cors({
    origin: [
      "http://localhost:5173",
      "https://webzine.onrender.com",
    ],
    credentials: true
  }),
  express.static(path.join(path.resolve(), "uploads"))
);

// 📦 API Routes
const authRoutes = require("./routes/authRouter");
const adminRoutes = require("./routes/postRouter");
const categoryRoutes = require("./routes/categoryRouter");
const publicRouter = require("./routes/publicRouter");

app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/", publicRouter);

// 🚫 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
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
    console.error("❌ Failed to connect to the database:", err);
  });
