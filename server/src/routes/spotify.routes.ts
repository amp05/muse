import { Router } from 'express';
import { SpotifyController } from '../controllers/spotify.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/search', authenticate, SpotifyController.searchTracks);

export default router;