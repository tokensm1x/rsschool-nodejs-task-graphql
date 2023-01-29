import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { post, createPostDto, updatePostDto } from './schema';

const getPosts = {
  type: new GraphQLList(post),
  async resolve(parent: any, args: any, context: any) {
    return await context.db.posts.findMany();
  },
};

const getPostById = {
  type: post,
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  async resolve(parent: any, args: any, context: any) {
    const post = await context.db.posts.findOne({
      key: 'id',
      equals: args.id,
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  },
};

const createPost = {
  type: post,
  args: {
    data: {
      type: new GraphQLNonNull(createPostDto),
    },
  },
  async resolve(parent: any, args: any, context: any) {
    return await context.db.posts.create(args.data);
  },
};

const updatePost = {
  type: post,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    data: {
      type: new GraphQLNonNull(updatePostDto),
    },
  },
  async resolve(parent: any, args: any, context: any) {
    try {
      const { id, data } = args;
      return await context.db.posts.change(id, data);
    } catch (e: any) {
      throw new Error(e.message || e);
    }
  },
};

export { getPosts, getPostById, createPost, updatePost };
