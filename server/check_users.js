import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bharatbenefit');
    const users = await User.find({});
    console.log("Users in DB:");
    users.forEach(u => console.log(u.email, u.password));
    
    // Clear users to allow fresh start
    await User.deleteMany({});
    console.log("Cleared all users so we can test fresh registration.");
    process.exit();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
check();
