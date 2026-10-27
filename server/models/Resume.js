import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
