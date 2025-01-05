import { Prisma, User } from '@prisma/client';
import { baseUserSelect } from './user.select';
import { count } from 'console';

export const postSelect = (user?: User) =>
  ({
    id: true,
    content: true,
    postUploads: {
      select: {
        id: true,
        url: true,
        name: true,
      },
    },
    poll: {
      select: {
        id: true,
        question: true,
        pollOptions: {
          select: {
            id: true,
            content: true,
            order: true,
            count: true,
            pollVotes: user
              ? {
                  where: {
                    userId: user.id,
                  },
                  select: {
                    id: true,
                  },
                  take: 1,
                }
              : undefined,
          },
        },
      },
    },
    fileUrl: true,
    fileName: true,
    createdAt: true,
    updatedAt: true,
    tags: {
      select: {
        id: true,
        name: true,
      },
    },
    user: {
      select: baseUserSelect,
    },
    reactions: {
      take: 3,
      select: {
        id: true,
        type: true,
        user: {
          select: baseUserSelect,
        },
      },
      distinct: ['type' as const] satisfies Prisma.ReactionScalarFieldEnum[],
    },
    ...(user && {
      savedPosts: {
        where: { userId: user.id },
        select: { id: true },
        take: 1,
      },
    }),
    _count: {
      select: {
        reactions: true,
        comments: true,
      },
    },
  }) as const;

export const basePostSelect = {
  id: true,
  // content: true,
} as const;

export type PostSelectType = Prisma.PostGetPayload<{
  select: ReturnType<typeof postSelect>;
}>;
