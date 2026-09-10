import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', protect, async (req, res) => {
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  if (req.query.category) filter.category = req.query.category;
  const documents = await Document.find(filter)
    .populate('uploadedBy', 'name email')
    .populate('project', 'name projectId')
    .sort('-createdAt');
  res.json(documents);
});

router.post('/', protect, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const doc = await Document.create({
    project: req.body.project,
    uploadedBy: req.user._id,
    name: req.body.name || req.file.originalname,
    originalName: req.file.originalname,
    category: req.body.category || 'Other',
    filePath: req.file.filename,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
  });

  const populated = await Document.findById(doc._id)
    .populate('uploadedBy', 'name email')
    .populate('project', 'name projectId');
  res.status(201).json(populated);
});

router.get('/:id/download', protect, async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  const filePath = path.join(uploadDir, doc.filePath);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server' });
  res.download(filePath, doc.originalName);
});

router.delete('/:id', protect, async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  const filePath = path.join(uploadDir, doc.filePath);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await doc.deleteOne();
  res.json({ message: 'Document deleted' });
});

export default router;
