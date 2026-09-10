import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import departmentRoutes from './routes/departments.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import milestoneRoutes from './routes/milestones.js';
import riskRoutes from './routes/risks.js';
import budgetRoutes from './routes/budget.js';
import projectUpdateRoutes from './routes/projectUpdates.js';
import notificationRoutes from './routes/notifications.js';
import documentRoutes from './routes/documents.js';
import analyticsRoutes from './routes/analytics.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'NIRIKSHAN', demo: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/project-updates', projectUpdateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);

app.use((_, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`NIRIKSHAN API running on http://localhost:${PORT}`);
  });
}

export default app;
