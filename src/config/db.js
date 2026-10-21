import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Options recommandées pour Mongoose 8+
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`📦 Base de données : ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB :', error.message);
    process.exit(1);
  }
};

export default connectDB;
