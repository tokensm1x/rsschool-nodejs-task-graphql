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
        const { fastify } = context;
        const posts = await fastify.db.posts.findMany({
          key: 'userId',
          equals: parent.id,
        });
        return posts;
      },
    },
    profile: {
      type: profile,
      async resolve(parent: any, args: any, context: any) {
        const { fastify } = context;
        return await fastify.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });
      },
    },
    memberType: {
      type: memberType,
      async resolve(parent: any, args: any, context: any) {
        const { fastify } = context;
        const profile = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });
        if (!profile) {
          return null;
        }
        return await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: profile.memberTypeId,
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(user),
      async resolve(parent: any, args: any, context: any) {
        const { subscribedUsersLoader } = context;
        return await subscribedUsersLoader.load(parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(user),
      async resolve(parent: any, args: any, context: any) {
        const { usersLoader } = context;
        return await usersLoader.loadMany(parent.subscribedToUserIds);
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
