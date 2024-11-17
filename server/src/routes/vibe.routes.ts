import { Router } from 'express';
import { VibeController } from '../controllers/vibe.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/top', authenticate, VibeController.getTopVibes);
router.get('/suggest', authenticate, VibeController.suggestVibes);

export default router;
