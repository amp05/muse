import { Request, Response } from 'express';
import { PostService } from '../services/post.service';
import { CreatePostDTO } from '../types/post.types';

export class PostController {
  static async createPost(req: Request<{}, {}, CreatePostDTO>, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const post = await PostService.createPost(userId, req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getFeed(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const posts = await PostService.getFeed(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}