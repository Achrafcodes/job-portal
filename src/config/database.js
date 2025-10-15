// ✅ database.js
import mongoose from 'mongoose';

export const dbStart = async () => {
  const db_url = process.env.MONGODB_URI;
  if (!db_url) {
    console.error('❌ MONGODB_URI is not defined!');
    return;
  }

  try {
    await mongoose.connect(db_url);
    console.log('✅ Database connected successfully!');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  }
};
