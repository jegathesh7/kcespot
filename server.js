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
  "https://localhost:5173",
  "https://kcespotlight2.vercel.app",
  "https://kcespotlight2-git-main-poovarasans-projects-e0246408.vercel.app",
  "https://kcespotlight2-c5g5htfg2-poovarasans-projects-e0246408.vercel.app"

];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
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
