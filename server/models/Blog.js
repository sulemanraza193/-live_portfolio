import mongoose from 'mongoose';

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadingTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200)); // ~200 wpm
}

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    tags: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    author: { type: String, default: 'Salman Raza' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date, default: null },
    readingTime: { type: Number, default: 1 }, // minutes, auto-computed
    metaDescription: { type: String, trim: true, maxlength: 160 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });

// Auto-generate slug from title if not provided, and keep it unique on
// title changes. Also auto-computes reading time and sets publishedAt the
// first time a post transitions to "published".
blogSchema.pre('validate', function autoFields(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  } else if (this.slug) {
    this.slug = slugify(this.slug);
  }

  if (this.content) {
    this.readingTime = estimateReadingTime(this.content);
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.status === 'draft') {
    this.publishedAt = null;
  }

  if (!this.metaDescription && this.description) {
    this.metaDescription = this.description.slice(0, 160);
  }

  next();
});

export default mongoose.model('Blog', blogSchema);
