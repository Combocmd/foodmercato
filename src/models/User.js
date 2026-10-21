import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  pseudo: {
    type: String,
    required: [true, 'Le pseudo est obligatoire'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Le pseudo doit faire au moins 3 caractères'],
    maxlength: [30, 'Le pseudo ne peut pas dépasser 30 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [8, 'Le mot de passe doit faire au moins 8 caractères'],
    select: false // Ne pas renvoyer par défaut
  },
  role: {
    type: String,
    enum: ['admin', 'redacteur'],
    default: 'redacteur'
  },
  avatar: {
    url: String,
    alt: String
  },
  bio: {
    type: String,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
  },
  actif: {
    type: Boolean,
    default: true
  },
  dernierConnexion: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour nom complet
userSchema.virtual('nomComplet').get(function() {
  return `${this.prenom} ${this.nom}`;
});

// Index
userSchema.index({ email: 1 });
userSchema.index({ pseudo: 1 });

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 12);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.motDePasse);
};

export default mongoose.model('User', userSchema);
