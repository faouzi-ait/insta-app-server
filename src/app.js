require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: '*', credentials: true }));
app.options('*', cors({ origin: '*', credentials: true }));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

const dbConnection = require('./configuration/db');
const memoRoutes = require('./routes/memoRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const postRoutes = require('./routes/postRoutes');

app.use(memoRoutes);
app.use(userRoutes);
app.use(contactRoutes);
app.use(postRoutes);

app.listen(port, () => {
  dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
});

