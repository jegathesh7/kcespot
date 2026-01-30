const dotenv = require("dotenv");
dotenv.config();  
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");

const app = express();
connectDB();


app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.listen(PORT, () => console.log(`Server running on ${PORT}`));