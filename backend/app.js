require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
const http = require("http");
const app = express();

const server = http.createServer(app);
// Middleware
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://52.66.132.71:3000',
  'https://resumeanalysis.duckdns.org',
  'https://apiresumeanalysis.duckdns.org'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true
}));



// Routes
app.use('/api', apiRoutes);

app.get("/", (req, res) => {
  res.send("Apps work properly");
});

app.use((req, res, next) => {
  if (req.files) {
    console.log('Received files:', Object.keys(req.files));
  }
  next();
});
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

