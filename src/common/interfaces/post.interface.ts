import { ReactionType } from '@prisma/client';
import { BaseEntity } from './base.interface';
import { TagResponse } from './tag.interface';
import { BaseUser } from './user.interface';

export interface PostResponse extends BaseEntity {
  content: string;
  file: { url: string; name: string };
  images: { url: string; name: string }[];
  poll: {
    id: number;
    question: string;
    pollOptions: { id: number; content: string; order: number }[];
    votedOptionId: any;
  };
  tags: TagResponse[];
  user: BaseUser;
  reactions?: {
    count: number;
    items: {
      id: number;
      type: ReactionType;
      user: BaseUser;
    }[];
  };
  comments?: number;
  isSaved?: boolean;
  isReacted?: boolean;
  reactionType?: ReactionType;
}

export interface BasePost {
  id: number;
  // content: string;
}
