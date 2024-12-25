import { BaseEntity } from './base.interface';
import { BasePost } from './post.interface';
import { BaseUser } from './user.interface';

export interface CommentResponse extends BaseEntity {
  content: string;
  post: BasePost;
  user: BaseUser;
  isLiked: boolean;
  likes: number;
  repliesCount: number;
}
