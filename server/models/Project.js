import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: { type: String, required: true },
    coordinates: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    description: { type: String, default: '' },
    startDate: { type: Date, required: true },
    expectedCompletionDate: { type: Date, required: true },
    actualCompletionDate: { type: Date },
    totalBudget: { type: Number, required: true, min: 0 },
    utilizedBudget: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['Planning', 'Active', 'On Hold', 'Delayed', 'Completed', 'Cancelled'],
      default: 'Planning',
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
    healthScore: { type: Number, default: 100, min: 0, max: 100 },
    isDemo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
