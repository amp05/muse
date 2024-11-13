import { Request, Response } from 'express';
import { VibeService } from '../services/vibe.service';

export class VibeController {
  static async getTopVibes(req: Request, res: Response) {
    try {
      const vibes = await VibeService.getTopVibes();
      res.json(vibes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch top vibes' });
    }
  }

  static async suggestVibes(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (typeof query !== 'string') {
        res.status(400).json({ message: 'Query parameter must be a string' });
        return;
      }
      const suggestions = await VibeService.suggestVibes(query);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch vibe suggestions' });
    }
  }
}
