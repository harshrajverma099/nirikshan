import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    category: {
      type: String,
      enum: ['Project Proposal', 'Budget', 'Tender', 'Report', 'Approval', 'Progress Report', 'Other'],
      default: 'Other',
    },
    filePath: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: 'application/octet-stream' },
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);
