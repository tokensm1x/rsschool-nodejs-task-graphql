import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { memberType, updateTypeDto } from './schema';

const getMemberTypes = {
  type: new GraphQLList(memberType),
  async resolve(parent: any, args: any, context: any) {
    const { fastify } = context;
    return await fastify.db.memberTypes.findMany();
  },
};

const getMemberTypeById = {
  type: memberType,
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  async resolve(parent: any, args: any, context: any) {
    const { fastify } = context;
    const type = await fastify.db.memberTypes.findOne({
      key: 'id',
      equals: args.id,
    });
    if (!type) {
      throw new Error('Type not found');
    }
    return type;
  },
};

const updateType = {
  type: memberType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    data: {
      type: new GraphQLNonNull(updateTypeDto),
    },
  },
  async resolve(parent: any, args: any, context: any) {
    try {
      const { id, data } = args;
      const { fastify } = context;
      return await fastify.db.memberTypes.change(id, data);
    } catch (e: any) {
      throw new Error(e.message || e);
    }
  },
};

export { getMemberTypes, getMemberTypeById, updateType };
