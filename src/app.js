const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const userRouter = require('./routes/user');
const classRouter = require('./routes/class');
const assignmentRouter = require('./routes/assignment');

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

app.get('/', (req, res) => {
  res.send('Welcome to EduVerse API');
});

// Middleware to log request method and URL
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use('/api/users', userRouter); // Correct route path for users
app.use('/api/classes', classRouter);
app.use('/api/assignments', assignmentRouter);

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
