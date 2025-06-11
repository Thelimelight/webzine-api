const mongoose = require('mongoose');

async function connectDB () {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME,
    })
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection failed: ', err);
    })
}

module.exports = connectDB; 