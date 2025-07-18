require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); // ✅ required to serve static files

const connectDB = require("./config/db");
const authRoutes = require('./routes/auth');
const githubRoutes = require('./routes/gitub');
const scanRoutes = require('./routes/scanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const fileRoutes = require("./routes/file");
const reportRoutes = require('./routes/reportRoutes');

// Connect MongoDB
connectDB();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// ✅ Serve loader.io verification file
app.get('/loaderio-40c56fe35a275cbff4f14d3a7899da8c.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'loaderio-40c56fe35a275cbff4f14d3a7899da8c.txt'));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/file", fileRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
