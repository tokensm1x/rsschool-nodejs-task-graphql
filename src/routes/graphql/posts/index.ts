import { GraphQLList } from 'graphql';
import { post } from './schema';

export const getPosts = {
  type: new GraphQLList(post),
  async resolve(parent: any, args: any, context: any) {
    return await context.db.posts.findMany();
  },
};
