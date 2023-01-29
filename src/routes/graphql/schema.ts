import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { getMemberTypes } from './member-types';
import { getPosts } from './posts';
import { getProfiles } from './profiles';
import { getUsers } from './users/index';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: getUsers,
      posts: getPosts,
      profiles: getProfiles,
      memberTypes: getMemberTypes,
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
