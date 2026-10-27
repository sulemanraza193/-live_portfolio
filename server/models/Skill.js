import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    color: { type: String, default: '#4F46E5' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
