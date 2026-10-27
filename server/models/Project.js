import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    image: { type: String, default: '' },
    github: { type: String, default: '' },
    live: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model('Project', projectSchema);
