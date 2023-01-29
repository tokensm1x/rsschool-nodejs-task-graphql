import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { getMemberTypes, getMemberTypeById, updateType } from './member-types';
import { getPosts, getPostById, createPost, updatePost } from './posts';
import {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
} from './profiles';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  unsubscribeFromUser,
  subscribeToUser,
} from './users/index';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: getUsers,
      posts: getPosts,
      profiles: getProfiles,
      memberTypes: getMemberTypes,
      memberType: getMemberTypeById,
      post: getPostById,
      profile: getProfileById,
      user: getUserById,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: createUser,
      createProfile: createProfile,
      createPost: createPost,
      updateUser: updateUser,
      updatePost: updatePost,
      updateProfile: updateProfile,
      updateType: updateType,
      unsubscribeFromUser: unsubscribeFromUser,
      subscribeToUser: subscribeToUser,
    },
  }),
});

export const graphqlBodySchema = {
  type: 'object',
  properties: {
    mutation: { type: 'string' },
    query: { type: 'string' },
    variables: {
      type: 'object',
    },
  },
  oneOf: [
    {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string' },
        variables: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
    {
      type: 'object',
      required: ['mutation'],
      properties: {
        mutation: { type: 'string' },
        variables: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
  ],
} as const;
