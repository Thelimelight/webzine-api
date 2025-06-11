const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT 
const dbConnect = require('./config/connection');

// Middleware 
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

dbConnect()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`API is available at http://localhost:${port}/api`);
    });
})
.catch((err) => {
    console.error('Failed to connect to the database: ', err);
});