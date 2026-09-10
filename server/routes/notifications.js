import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({
    $or: [{ user: req.user._id }, { isGlobal: true }],
  })
    .populate('relatedProject', 'name projectId')
    .sort('-createdAt')
    .limit(50);
  res.json(notifications);
});

router.put('/:id/read', protect, async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json(notification);
});

router.put('/read-all', protect, async (req, res) => {
  await Notification.updateMany(
    { $or: [{ user: req.user._id }, { isGlobal: true }], isRead: false },
    { isRead: true }
  );
  res.json({ message: 'All notifications marked as read' });
});

export default router;
