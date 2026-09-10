import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
    approvedBudget: { type: Number, required: true, min: 0 },
    allocatedBudget: { type: Number, default: 0, min: 0 },
    utilizedBudget: { type: Number, default: 0, min: 0 },
    remainingBudget: { type: Number, default: 0, min: 0 },
    utilizationPercentage: { type: Number, default: 0, min: 0, max: 100 },
    entries: [
      {
        category: { type: String, required: true },
        amount: { type: Number, required: true },
        description: { type: String, default: '' },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Budget', budgetSchema);
