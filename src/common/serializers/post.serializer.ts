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
    // poll: post.poll,
    poll: post.poll
      ? {
          id: post.poll.id,
          question: post.poll.question,
          pollOptions: post.poll.pollOptions.map((option) => ({
            id: option.id,
            content: option.content,
            order: option.order,
            count: option.count,
            isVoted: option.pollVotes?.length > 0 || false,
          })),
          totalVotes: post.poll.pollOptions.reduce(
            (sum, option) => sum + option.count,
            0,
          ),
          // votedOptionId:
          //   post.poll.pollOptions.find((opt) => opt.pollVotes?.length > 0)
          //     ?.id || null,
        }
      : null,

    comments: post._count.comments,
    isSaved: post.savedPosts ? post.savedPosts.length > 0 : false,
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
