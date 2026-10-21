import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

// Connexion à MongoDB puis démarrage serveur
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════╗
║       🍽️  FOODERCATO SERVER  ⚽             ║
╠═══════════════════════════════════════════════╣
║  🚀 Serveur démarré sur le port ${PORT}         ║
║  🌍 http://localhost:${PORT}                    ║
║  📡 API Health : http://localhost:${PORT}/api/health ║
║  📁 Frontend : http://localhost:${PORT}/         ║
╚═══════════════════════════════════════════════╝
      `);
    });

    // Gestion arrêt propre
    const shutdown = async (signal) => {
      console.log(`\n📴 ${signal} reçu, arrêt en cours...`);
      server.close(async () => {
        console.log('✅ Serveur HTTP fermé');
        process.exit(0);
      });
      
      // Force close après 10s
      setTimeout(() => {
        console.error('⚠️ Arrêt forcé');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Échec démarrage :', error);
    process.exit(1);
  }
};

startServer();
