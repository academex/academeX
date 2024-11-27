export const serializePost = (post) => {
  return {
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    file: {
      url: post.fileUrl || null,
      name: post.fileName || null,
    },
    images: post.postUploads.map((upload) => ({
      id: upload.id,
      url: upload.url,
    })),
    tags: post.tags,
    user: post.user,
    reactions: {
      count: post._count.reactions,
      items: post.reactions,
    },
    comments: post._count.comments,
  };
};
