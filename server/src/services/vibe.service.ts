import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VibeService {
  static async getTopVibes() {
    const vibes = await prisma.vibe.findMany({
      where: {
        useCount: {
          gte: 3
        }
      },
      orderBy: {
        useCount: 'desc'
      },
      take: 3,
      select: {
        word: true
      }
    });
    
    return vibes.map(v => v.word);
  }

  static async suggestVibes(query: string) {
    const vibes = await prisma.vibe.findMany({
      where: {
        word: {
          startsWith: query.toLowerCase(),
        }
      },
      orderBy: {
        useCount: 'desc'
      },
      take: 5,
      select: {
        word: true
      }
    });

    return vibes.map(v => v.word);
  }
}
