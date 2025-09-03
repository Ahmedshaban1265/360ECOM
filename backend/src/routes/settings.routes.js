import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getGlobal, saveGlobal } from '../controllers/settings.controller.js';

const router = Router();

/**
 * @openapi
 * /api/settings/global:
 *   get:
 *     summary: Get global theme tokens
 *     tags: [Settings]
 */
router.get('/global', getGlobal);
router.put('/global', authRequired, saveGlobal);

export default router;

