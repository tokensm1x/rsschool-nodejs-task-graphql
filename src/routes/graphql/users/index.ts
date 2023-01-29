import { GraphQLList } from 'graphql';
import { user } from './schema';

export const getUsers = {
  type: new GraphQLList(user),
  async resolve(parent: any, args: any, context: any) {
    return await context.db.users.findMany();
  },
};
