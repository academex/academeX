import { Prisma, User } from '@prisma/client';
import { baseUserSelect } from './user.select';

export const librarySelect = (user?: User) =>
  ({
    id: true,
    name: true,
    type: true,
    description: true,
    url: true,
    size: true,
    mimeType: true,
    stars: true,
    yearNum: true,
    subject: true,
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
    ...(user && {
      star: {
        where: { userId: user.id },
        select: { id: true },
        take: 1,
      },
    }),
  }) as const;

export type librarySelectType = Prisma.PostGetPayload<{
  select: ReturnType<typeof librarySelect>;
}>;
