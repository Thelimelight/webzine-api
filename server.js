const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const NODE_ENV = process.env.NODE_ENV;

dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const connectDB = require('./config/dataBase');

// routes 
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authorRoutes = require('./routes/authorRoutes');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);

app.get('/api/health', (req, res) => res.send('API is running...'));

connectDB();
app.get('/', (req,res) => {
    res.send('Hello World!');
})

const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
}) 