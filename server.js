const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");

const app = express();
app.set("trust proxy", 1);
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://localhost:5173",

  "https://kcespotlight2.vercel.app",
  "https://kcespotlight2-git-main-poovarasans-projects-e0246408.vercel.app",
  "https://kcespotlight2-c5g5htfg2-poovarasans-projects-e0246408.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-app-client"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(require("cookie-parser")());

// Make uploads folder static
app.use("/uploads", express.static("uploads"));

// ✅ ROUTES (paths must be EXACT)
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/achievers", require("./routes/achieverRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/unstop", require("./routes/proxyRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log("Allowed Origins:", allowedOrigins);
});

app.use("/api/check-aws", (req, res) => {
  return res.json({ message: "hello hero" });
});
