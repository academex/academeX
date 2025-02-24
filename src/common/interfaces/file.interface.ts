import { LibraryType, ReactionType } from '@prisma/client';
import { BaseEntity } from './base.interface';
import { TagResponse } from './tag.interface';
import { BaseUser } from './user.interface';

export interface LibraryFileResponse extends BaseEntity {
  name: string;
  type: LibraryType;
  description: string;
  url: string;
  size?: number;
  mimeType?: string;
  stars: number;
  yearNum: number;
  subject: string;
  tags: TagResponse[];
  user: BaseUser;
  isStared?: boolean;
}
