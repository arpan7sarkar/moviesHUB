const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const User = require('../models/User');
const env = require('../config/env');
const connectDB = require('../config/db');

/**
 * Script to promote a user to admin by email.
 * Usage: node src/utils/promoteToAdmin.js your-email@example.com
 */

const promoteUser = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Successfully promoted ${user.name} (${email}) to admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error.message);
    process.exit(1);
  }
};

promoteUser();
