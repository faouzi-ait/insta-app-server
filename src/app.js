require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: '*', credentials: true }));
app.options('*', cors({ origin: '*', credentials: true }));

// app.use(cors({ origin: `http://localhost:3001`, credentials: true }));
// app.options('*', cors({ origin: 'http://localhost:3001', credentials: true }));

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // res.setHeader('Access-Control-Allow-Origin', '*');

    let allowedDomains = ['http://localhost:3000', 'http://192.168.0.147:4000', 'https://insta-web.netlify.app' ];
    let origin = req.headers.origin;
    
    if(allowedDomains.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
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

