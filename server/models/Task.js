import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Completed', 'Blocked', 'Overdue'],
      default: 'To Do',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
