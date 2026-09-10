import mongoose from 'mongoose';

const updateCommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const projectUpdateSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    update: { type: String, required: true },
    progressChange: { type: Number, default: 0 },
    status: { type: String, enum: ['On Track', 'At Risk', 'Delayed', 'Completed'], default: 'On Track' },
    comments: [updateCommentSchema],
  },
  { timestamps: true }
);

export default mongoose.model('ProjectUpdate', projectUpdateSchema);
