const mongoose = require('mongoose');

const connectDB = async () => {
  try {


    await mongoose.connect("mongodb+srv://kepemo4299:aziz1234@cluster0.kwwtg.mongodb.net/pfe");
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;