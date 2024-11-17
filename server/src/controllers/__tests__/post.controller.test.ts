import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import { prismaMock } from '../../test/singleton';

jest.mock('jsonwebtoken');

describe('PostController', () => {
  const mockUserId = '123';
  const mockToken = 'mock-jwt-token';
  const validAuthHeader = `Bearer ${mockToken}`;

  beforeEach(() => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
  });

  describe('POST /api/posts', () => {
    const validPostData = {
      caption: 'Test post',
      songs: [
        {
          title: 'Test Song',
          artist: 'Test Artist',
          albumArt: 'http://example.com/art.jpg',
          spotifyId: 'spotify123'
        }
      ],
      vibes: ['chill', 'happy']
    };

    it('should successfully create a post', async () => {
      // Arrange
      const date = new Date();
      const mockVibes = validPostData.vibes.map(word => ({
        id: `vibe-${word}`,
        word,
        useCount: 1,
        createdAt: date,
        updatedAt: date
      }));

      const mockPost = {
        id: 'post123',
        caption: validPostData.caption,
        userId: mockUserId,
        createdAt: date,
        updatedAt: date,
        songs: [{
          id: 'song123',
          ...validPostData.songs[0],
          postId: 'post123'
        }],
        vibes: mockVibes.map(v => ({
          word: v.word,
          useCount: v.useCount
        })),
        user: {
          id: mockUserId,
          username: 'testuser'
        }
      };

      prismaMock.vibe.upsert.mockResolvedValueOnce(mockVibes[0]);
      prismaMock.vibe.upsert.mockResolvedValueOnce(mockVibes[1]);
      prismaMock.post.create.mockResolvedValue(mockPost);

      // Act
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', validAuthHeader)
        .send(validPostData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(201);
      // JSON parse/stringify to avoid date/string conversion issues
      expect(response.body).toEqual(JSON.parse(JSON.stringify(mockPost)));

      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: {
          caption: validPostData.caption,
          userId: mockUserId,
          songs: {
            create: validPostData.songs
          },
          vibes: {
            connect: mockVibes.map(v => ({ id: v.id }))
          }
        },
        include: {
          songs: true,
          vibes: {
            select: {
              word: true,
              useCount: true
            }
          },
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });
    });

    it('should return 401 when no auth token is provided', async () => {
      // Act
      const response = await request(app)
        .post('/api/posts')
        .send(validPostData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Authentication required'
      });
    });

    it('should return 401 when invalid auth token is provided', async () => {
      // Arrange
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', 'Bearer invalid-token')
        .send(validPostData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid token'
      });
    });
  });

  describe('GET /api/posts/feed', () => {
    it('should successfully return user feed', async () => {
      // Arrange
      const date = new Date();
      const mockPosts = [{
        id: 'post123',
        caption: 'Test post',
        userId: mockUserId,
        createdAt: date,
        updatedAt: date,
        songs: [{
          id: 'song123',
          title: 'Test Song',
          artist: 'Test Artist',
          albumArt: 'http://example.com/art.jpg',
          spotifyId: 'spotify123',
          postId: 'post123'
        }],
        vibes: [{
          word: 'chill',
          useCount: 1
        }],
        user: {
          id: mockUserId,
          username: 'testuser'
        }
      }];

      prismaMock.user.findUnique.mockResolvedValue({
        id: mockUserId,
        friends: [{ id: 'friend123' }]
      } as any);

      prismaMock.post.findMany.mockResolvedValue(mockPosts);

      // Act
      const response = await request(app)
        .get('/api/posts/feed')
        .set('Authorization', validAuthHeader)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(200);
      // JSON parse/stringify to avoid date/string conversion issues
      expect(response.body).toEqual(JSON.parse(JSON.stringify(mockPosts)));

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: {
          userId: {
            in: ['friend123', mockUserId]
          }
        },
        include: {
          songs: true,
          vibes: {
            select: {
              word: true,
              useCount: true
            }
          },
          user: {
            select: {
              id: true,
              username: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });
  });
});
