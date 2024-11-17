import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../app';
import { prismaMock } from '../../test/singleton';
import { User } from '@prisma/client';
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);
  });

  describe('POST /api/auth/register', () => {
    const validRegisterData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    };

    it('should successfully register a new user', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const date = new Date();
      
      const mockUser = {
        id: '123',
        email: validRegisterData.email,
        username: validRegisterData.username,
        createdAt: date,
      } as User;
      
      prismaMock.user.create.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegisterData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          createdAt: date.toISOString(),
        },
        token: mockToken,
      });

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: validRegisterData.email,
          username: validRegisterData.username,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });
    });

    it('should return 400 when email already exists', async () => {
      // Arrange
      prismaMock.user.create.mockRejectedValue(new Error('Unique constraint failed on the fields: (`email`)'));

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegisterData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should successfully login an existing user', async () => {
      // Arrange
      const mockUser = {
        id: '123',
        email: validLoginData.email,
        username: 'testuser',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect('Content-Type', /json/);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          createdAt: expect.any(String),
        },
        token: mockToken,
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      });
    });

    it('should return 401 when user does not exist', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid credentials',
      });
    });

    it('should return 401 when password is incorrect', async () => {
      // Arrange
      const mockUser = {
        id: '123',
        email: validLoginData.email,
        username: 'testuser',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid credentials',
      });
    });
  });
});
