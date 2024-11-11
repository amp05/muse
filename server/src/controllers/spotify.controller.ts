import { Request, Response } from 'express';
import { SpotifyService } from '../services/spotify.service';

export class SpotifyController {
  static async searchTracks(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
          res.status(400).json({ message: 'Query parameter is required' });
          return;
      }

      const tracks = await SpotifyService.searchTracks(query);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search tracks' });
    }
  }
}