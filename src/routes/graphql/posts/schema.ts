import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const post = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

const createPostDto = new GraphQLInputObjectType({
  name: 'createPostDto',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const updatePostDto = new GraphQLInputObjectType({
  name: 'updatePostDto',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export { post, createPostDto, updatePostDto };
