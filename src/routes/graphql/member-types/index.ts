import { GraphQLList } from 'graphql';
import { memberType } from './schema';

export const getMemberTypes = {
  type: new GraphQLList(memberType),
  async resolve(parent: any, args: any, context: any) {
    return await context.db.memberTypes.findMany();
  },
};
