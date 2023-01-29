import { GraphQLObjectType, GraphQLString } from 'graphql';

export const post = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});
