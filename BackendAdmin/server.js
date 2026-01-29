require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const app = express();
connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/achievers", require("./routes/achieverRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));