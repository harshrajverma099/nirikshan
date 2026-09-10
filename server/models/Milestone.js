import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    targetDate: { type: Date, required: true },
    completedDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Delayed'],
      default: 'Pending',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Milestone', milestoneSchema);
