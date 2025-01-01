import { PaginatedResponse, PostResponse } from '../interfaces';
import { PostSelectType } from '../prisma/selects';

export const serializePost = (post: PostSelectType): PostResponse => {
  return {
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    tags: post.tags,
    user: post.user,
    file: {
      url: post.fileUrl,
      name: post.fileName,
    },
    images: post.postUploads.map((upload) => ({
      url: upload.url,
      name: upload.name,
    })),
    comments: post._count.comments,
    isSaved: post.savedPost ? post.savedPost.length > 0 : false,
    reactions: {
      count: post._count.reactions,
      items: post.reactions,
    },
  };
};

export const serializePaginatedPosts = (
  data: PostResponse[],
  meta: { page: number; limit: number; total: number },
): PaginatedResponse<PostResponse> => {
  return {
    data,
    meta: {
      ...meta,
      PagesCount: Math.ceil(meta.total / meta.limit),
    },
  };
};
