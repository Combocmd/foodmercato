import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  contenu: {
    type: String,
    required: [true, 'Le contenu est obligatoire']
  },
  extrait: {
    type: String,
    maxlength: [500, "L'extrait ne peut pas dépasser 500 caractères"]
  },
  imageUne: {
    url: String,
    alt: String
  },
  categorie: {
    type: String,
    required: [true, 'La catégorie est obligatoire'],
    enum: {
      values: ['Mercato', 'Match', 'Analyse', 'Humour', 'Rétrospective', 'Autre'],
      message: 'Catégorie invalide'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statut: {
    type: String,
    enum: ['brouillon', 'publié', 'archivé'],
    default: 'brouillon'
  },
  datePublication: {
    type: Date
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  vues: {
    type: Number,
    default: 0
  },
  aLaUne: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

articleSchema.index({ titre: 'text', contenu: 'text', tags: 'text' });
articleSchema.index({ categorie: 1, statut: 1 });
articleSchema.index({ datePublication: -1 });
articleSchema.index({ slug: 1 }, { unique: true });

articleSchema.virtual('url').get(function() {
  return `/article/${this.slug}`;
});

articleSchema.pre('save', function(next) {
  if (!this.slug && this.titre) {
    this.slug = this.titre
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  if (this.isModified('statut') && this.statut === 'publié' && !this.datePublication) {
    this.datePublication = new Date();
  }
  next();
});

articleSchema.statics.getPublies = function(options = {}) {
  const { limite = 10, page = 1, categorie, tag, aLaUne } = options;
  const query = { statut: 'publié' };
  if (categorie) query.categorie = categorie;
  if (tag) query.tags = tag;
  if (aLaUne) query.aLaUne = true;
  return this.find(query)
    .sort({ datePublication: -1 })
    .skip((page - 1) * limite)
    .limit(limite)
    .populate('auteur', 'nom prenom pseudo');
};

export default mongoose.model('Article', articleSchema);
