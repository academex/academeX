import { basePostSelect } from './post.select';
import { baseUserSelect } from './user.select';

export const baseCommentSelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: baseUserSelect,
  },
  post: {
    select: basePostSelect,
  },
} as const;
