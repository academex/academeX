import { BaseEntity } from './base.interface';
import { BaseUser } from './user.interface';

export interface ReplyResponse extends BaseEntity {
  content: string;
  comment: {
    id: number;
  };
  user: BaseUser;
  isLiked?: boolean;
  likes: number;
  repliedTo: BaseUser | null;
}
