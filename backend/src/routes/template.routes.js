import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getDraft, saveDraft, getPublished, publish } from '../controllers/template.controller.js';

const router = Router();

/**
 * @openapi
 * /api/templates/{id}/draft:
 *   get:
 *     summary: Get draft template by id
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/draft', authRequired, getDraft);
router.put('/:id/draft', authRequired, saveDraft);
router.get('/:id/published', getPublished);
router.put('/:id/publish', authRequired, publish);

export default router;

