const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Config
const env = require('./config/env');
const connectDB = require('./config/db');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect to Database
connectDB();

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply rate limiter to all requests
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tmdb', require('./routes/tmdbRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MoviesHUB API' });
});

// Error Handling
app.use(errorHandler);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${env.NODE_ENV} mode on port ${PORT}`);
});
