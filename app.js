const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT 
const dbConnect = require('./config/connection');
const cors = require('cors')
const corsOption = {
    origin: ["http://localhost:5173", "http://localhost:5000"]
}

// Require Routes
const authRoutes =  require('./routes/authRouter')
const amdinRoutes = require('./routes/postRouter')
const categoryRoutes = require('./routes/categoryRouter');
const publicRouter = require('./routes/publicRouter')

// Middleware 
app.use(cors(corsOption));
app.use(express.json());

// Routes
app.use('/',publicRouter);
app.use('/api/auth', authRoutes);
app.use('/api/', amdinRoutes)
app.use('/api/categories', categoryRoutes);

app.use('/uploads', express.static('uploads'));

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