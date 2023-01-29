import { GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';

export const user = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  }),
});
