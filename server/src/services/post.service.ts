import { PrismaClient } from '@prisma/client';
import { CreatePostDTO } from '../types/post.types';

const prisma = new PrismaClient();

export class PostService {
  static async createPost(userId: string, data: CreatePostDTO) {
    return await prisma.post.create({
      data: {
        caption: data.caption,
        userId,
        songs: {
          create: data.songs,
        },
      },
      include: {
        songs: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  static async getFeed(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: {
          select: { id: true },
        },
      },
    });

    const friendIds = user?.friends.map(friend => friend.id) || [];
    friendIds.push(userId); // Include user's own posts

    return await prisma.post.findMany({
      where: {
        userId: {
          in: friendIds,
        },
      },
      include: {
        songs: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}