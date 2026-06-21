const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/portfolio')
  .then(() => {
    console.log('✅ MongoDB Connected!');
  })
  .catch((err) => {
    console.log('⚠️ MongoDB not connected - thats OK for now!');
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});