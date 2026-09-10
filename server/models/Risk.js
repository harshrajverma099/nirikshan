import mongoose from 'mongoose';

const riskSchema = new mongoose.Schema(
  {
    riskId: { type: String, required: true, unique: true, uppercase: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    probability: { type: Number, required: true, min: 1, max: 5 },
    impact: { type: Number, required: true, min: 1, max: 5 },
    riskScore: { type: Number, default: 0 },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
    mitigationPlan: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['Open', 'Mitigated', 'Closed', 'Monitoring'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

riskSchema.pre('save', function (next) {
  this.riskScore = this.probability * this.impact;
  if (this.riskScore >= 20) this.severity = 'Critical';
  else if (this.riskScore >= 12) this.severity = 'High';
  else if (this.riskScore >= 6) this.severity = 'Medium';
  else this.severity = 'Low';
  next();
});

export default mongoose.model('Risk', riskSchema);
