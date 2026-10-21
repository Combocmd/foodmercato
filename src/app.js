import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'views'));

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (frontend)
app.use(express.static(path.join(projectRoot, 'public')));

// ===== ROUTES PAGES (EJS) =====
app.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' });
});

app.get('/articles', (req, res) => {
  res.render('articles', { title: 'Articles' });
});

app.get('/articles/:slug', (req, res) => {
  res.render('article', { title: 'Article', slug: req.params.slug });
});

app.get('/categorie', (req, res) => {
  res.render('categorie', { title: 'Catégorie', cat: req.query.cat });
});

app.get('/recherche', (req, res) => {
  res.render('recherche', { title: 'Recherche', q: req.query.q });
});

app.get('/connexion', (req, res) => {
  res.render('connexion', { title: 'Connexion' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'À propos' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// Health check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Foodercato API opérationnelle 🍽️⚽',
    timestamp: new Date().toISOString()
  });
});

// 404 pour API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint API non trouvé',
    path: req.originalUrl
  });
});

// 404 pour pages (rend une vue 404 si tu en crées une, sinon JSON)
app.use((req, res) => {
  res.status(404).json({
    error: 'Page non trouvée',
    path: req.originalUrl
  });
});

// Gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur :', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Erreur interne du serveur'
      : err.message
  });
});

export default app;