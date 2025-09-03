import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { listMedia, deleteMedia, upload } from '../controllers/media.controller.js';

const router = Router();

/**
 * @openapi
 * /api/media:
 *   get:
 *     summary: List media files
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authRequired, listMedia);
router.delete('/:name', authRequired, deleteMedia);
router.post('/upload', authRequired, upload.single('file'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}`, name: req.file.filename });
});

export default router;

