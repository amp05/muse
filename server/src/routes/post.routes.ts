import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, PostController.createPost);
router.get('/feed', authenticate, PostController.getFeed);

export default router;