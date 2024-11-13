import { PrismaClient } from '@prisma/client';
import { CreatePostDTO } from '../types/post.types';

const prisma = new PrismaClient();

export class PostService {
  static async createPost(userId: string, data: CreatePostDTO) {
    const vibes = await Promise.all(
      data.vibes.map(async (word) => {
        const vibe = await prisma.vibe.upsert({
          where: { word: word.toLowerCase() },
          update: { useCount: { increment: 1 } },
          create: { word: word.toLowerCase() },
        });
        return vibe;
      })
    );

    return await prisma.post.create({
      data: {
        caption: data.caption,
        userId,
        songs: {
          create: data.songs,
        },
        vibes: {
          connect: vibes.map(v => ({ id: v.id })),
        },
      },
      include: {
        songs: true,
        vibes: {
          select: {
            word: true,
            useCount: true,
          },
        },
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
    friendIds.push(userId);

    return await prisma.post.findMany({
      where: {
        userId: {
          in: friendIds,
        },
      },
      include: {
        songs: true,
        vibes: {
          select: {
            word: true,
            useCount: true,
          },
        },
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