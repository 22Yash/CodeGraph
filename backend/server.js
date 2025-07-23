require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");

// Temporarily comment out route imports
const authRoutes = require("./routes/auth");
// const repoRoutes = require("./routes/selectRepo");
// const graphRoute = require("./routes/scan");
// const graphRoutes = require("./routes/graphRoutes");

// Connect MongoDB
connectDB();

const app = express();

// ✅ Fix CORS
const allowedOrigins = [
  "https://code-graph-phi.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.options('*', cors()); // ✅ Preflight support

app.use(cookieParser());
app.use(express.json());

// Temporarily comment out all route usages
app.use("/api/auth", authRoutes);
// app.use("/api/github", repoRoutes);
// app.use("/api/scan", graphRoute);
// app.use("/api/graph", graphRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));