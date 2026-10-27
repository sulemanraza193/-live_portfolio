import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
