require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.0.147:4000',
  'https://e-commerce-2-back-u7ju.onrender.com',
  'https://insta-web.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Enable credentials for cross-origin requests
}));

app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Content-Type', 'application/json'); 
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Express JSON parser
app.use(express.json());

// Import your routes
const dbConnection = require('./configuration/db');
const memoRoutes = require('./routes/memoRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const postRoutes = require('./routes/postRoutes');

// Use routes
app.use(memoRoutes);
app.use(userRoutes);
app.use(contactRoutes);
app.use(postRoutes);

// Start the server
app.listen(port, () => {
  dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
  console.log(`Server running on port ${port}`);
});
