import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';
import { memberType } from '../member-types/schema';
import { post } from '../posts/schema';
import { profile } from '../profiles/schema';

const user = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    posts: {
      type: new GraphQLList(post),
      async resolve(parent: any, args: any, context: any) {
        const posts = await context.db.posts.findMany({
          key: 'userId',
          equals: args.id,
        });
        return posts;
      },
    },
    profile: { type: profile },
    memberType: { type: memberType },
  }),
});

const createUserDto = new GraphQLInputObjectType({
  name: 'createUserDto',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const updateUserDto = new GraphQLInputObjectType({
  name: 'updateUserDto',
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

export { user, createUserDto, updateUserDto };
