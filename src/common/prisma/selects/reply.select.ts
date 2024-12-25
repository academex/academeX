import { Prisma } from '@prisma/client';
import { baseUserSelect } from './user.select';

export const baseReplySelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const replySelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: baseUserSelect,
  },
  comment: {
    select: {
      id: true,
    },
  },
  parent: {
    select: {
      user: {
        select: baseUserSelect,
      },
    },
  },
} as const;

export type ReplySelectType = Prisma.PostGetPayload<{
  select: typeof replySelect;
}>;
