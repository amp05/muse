import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/error';
import { routeNotFound } from './middleware/routeNotFound';
import authRouter from './routes/auth.routes';
import postRouter from './routes/post.routes';
import spotifyRouter from './routes/spotify.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Auth
app.use('/api/auth', authRouter);

// Posts
app.use('/api/posts', postRouter);

// Spotify
app.use('/api/spotify', spotifyRouter);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

export default app;