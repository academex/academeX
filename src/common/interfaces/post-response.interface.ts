import { ReactionType } from '@prisma/client';

export interface PostResponse {
  message?: string;
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  file: { url: string; name: string };
  images: { url: string; name: string }[];
  tags: { id: number; name: string }[];
  user: PostUser;
  reactions?: {
    count: number;
    items: {
      id: number;
      type: ReactionType;
      user: PostUser;
    };
  };
  comments?: number;
  isSaved?: boolean;
  isReacted?: boolean;
  reactionType?: ReactionType;
}

export interface PaginatedPostResponse {
  message?: string;
  data: PostResponse[];
  meta: {
    page: number;
    limit: number;
    PagesCount: number;
    total: number;
  };
}

type PostUser = {
  id: number;
  username: string;
  photoUrl: string;
  firstName?: string;
  lastName?: string;
};
