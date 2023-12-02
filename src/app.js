require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:8000', credentials: true }));
app.options('*', cors({ origin: 'http://localhost:8000', credentials: true }));

// app.use(cors({ origin: `http://localhost:3001`, credentials: true }));
// app.options('*', cors({ origin: 'http://localhost:3001', credentials: true }));

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    let allowedDomains = ['http://localhost:3001','http://localhost:8000' ];
    let origin = req.headers.origin;
    
    if(allowedDomains.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const memoRoutes = require('./routes/memoRoutes');
const dbConnection = require('./models/db');

app.use(userRoutes);
app.use(memoRoutes);

app.listen(port, () => {
  dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
});

