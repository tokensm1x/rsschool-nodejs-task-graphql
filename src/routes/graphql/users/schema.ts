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

const user: any = new GraphQLObjectType({
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
          equals: parent.id,
        });
        return posts;
      },
    },
    profile: {
      type: profile,
      async resolve(parent: any, args: any, context: any) {
        return await context.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });
      },
    },
    memberType: {
      type: memberType,
      async resolve(parent: any, args: any, context: any) {
        const profile = await context.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });
        if (!profile) {
          return null;
        }
        return await context.db.memberTypes.findOne({
          key: 'id',
          equals: profile.memberTypeId,
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(user),
      async resolve(parent: any, args: any, context: any) {
        return await context.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: parent.id,
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(user),
      async resolve(parent: any, args: any, context: any) {
        return await context.db.users.findMany({
          key: 'id',
          equalsAnyOf: parent.subscribedToUserIds,
        });
      },
    },
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

const subscriptionDto = new GraphQLInputObjectType({
  name: 'subscriptionDto',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export { user, createUserDto, updateUserDto, subscriptionDto };
