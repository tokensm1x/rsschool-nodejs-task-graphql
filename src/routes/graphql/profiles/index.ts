import { GraphQLList } from 'graphql';
import { profile } from './schema';

export const getProfiles = {
  type: new GraphQLList(profile),
  async resolve(parent: any, args: any, context: any) {
    return await context.db.profiles.findMany();
  },
};
