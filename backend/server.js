require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const repoRoutes = require("./routes/selectRepo");
const graphRoute = require("./routes/scan");
const graphRoutes = require("./routes/graphRoutes");


// Connect MongoDB
connectDB();

const app = express();

app.use(cors({
    origin: ["https://code-graph-phi.vercel.app", "http://localhost:3000"],
    credentials: true,
  }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/github",repoRoutes)
app.use("/api/scan", graphRoute);
app.use("/api/graph", graphRoutes);
            
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
