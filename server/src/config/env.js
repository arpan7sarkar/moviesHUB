require('dotenv').config();

const requiredEnv = [
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'TMDB_API_KEY',
  'CLIENT_URL'
];

const validateEnv = () => {
  const missing = requiredEnv.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
};

module.exports = validateEnv();
