/**
 * Create the initial SuperAdmin account.
 * Run: node createSuperAdmin.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

async function createSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ role: 'superadmin' });
    if (existing) {
      console.log('⚠️  SuperAdmin already exists:', existing.email);
      process.exit(0);
    }

    const admin = new User({
      name: 'Super Admin',
      email: 'yugmittal689@gmail.com',
      password: 'Yugmittal@22',
      role: 'superadmin'
    });

    await admin.save();
    console.log('✅ SuperAdmin created!');
    console.log('   Email: yugmittal689@gmail.com');
    console.log('   Password: Yugmittal@22');
    console.log('   ⚠️  Change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();
