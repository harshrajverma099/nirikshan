import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['risk', 'task', 'milestone', 'budget', 'project', 'system'],
      default: 'system',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['info', 'warning', 'success', 'critical'], default: 'info' },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    isRead: { type: Boolean, default: false },
    isGlobal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
