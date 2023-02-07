import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { profile, createProfileDto, updateProfileDto } from './schema';

const getProfiles = {
  type: new GraphQLList(profile),
  async resolve(parent: any, args: any, context: any) {
    const { fastify } = context;
    return await fastify.db.profiles.findMany();
  },
};

const getProfileById = {
  type: profile,
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  async resolve(parent: any, args: any, context: any) {
    const { fastify } = context;
    const profile = await fastify.db.profiles.findOne({
      key: 'id',
      equals: args.id,
    });
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  },
};

const createProfile = {
  type: profile,
  args: {
    data: { type: new GraphQLNonNull(createProfileDto) },
  },
  async resolve(parent: any, args: any, context: any) {
    const { fastify } = context;
    return await fastify.db.profiles.create(args.data);
  },
};

const updateProfile = {
  type: profile,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(updateProfileDto) },
  },
  async resolve(parent: any, args: any, context: any) {
    try {
      const { id, data } = args;
      const { fastify } = context;
      return await fastify.db.profiles.change(id, data);
    } catch (e: any) {
      throw new Error(e.message || e);
    }
  },
};

export { getProfiles, getProfileById, createProfile, updateProfile };
