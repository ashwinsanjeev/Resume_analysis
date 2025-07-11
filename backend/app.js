require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
const http = require("http");

const app = express();
const server = http.createServer(app);

// CORS middleware (put FIRST)
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://127.0.0.1:5500',
      'http://localhost:5000',
      'http://52.66.132.71:3000',
      'https://resumeanalysis.duckdns.org',
      'https://apiresumeanalysis.duckdns.org',
      'http://127.0.0.1:5501'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
}));
app.use(express.static('public'));

// Manual CORS preflight handling
app.options('/api/*', cors());

// Logging and JSON parsing
app.use(morgan('dev'));
app.use(express.json());

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true
}));

// Log received files (optional)
app.use((req, res, next) => {
  if (req.files) {
    console.log('Received files:', Object.keys(req.files));
  }
  next();
});

// Routes
app.use('/api', apiRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("App works properly ✅");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
