import { Prisma, User } from '@prisma/client';
import { baseUserSelect } from './user.select';

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
      SavedPost: {
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

export type PostSelectType = Prisma.PostGetPayload<{
  select: ReturnType<typeof postSelect>;
}>;
