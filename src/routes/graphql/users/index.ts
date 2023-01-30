import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { user, createUserDto, updateUserDto, subscriptionDto } from './schema';

const getUsers = {
  type: new GraphQLList(user),
  async resolve(parent: any, args: any, context: any) {
    const { fastify } = context;
    return await fastify.db.users.findMany();
  },
};

const getUserById = {
  type: user,
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  async resolve(parent: any, args: any, context: any) {
    const { usersLoader } = context;
    const user = await usersLoader.load(args.id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};

const createUser = {
  type: user,
  args: {
    data: { type: new GraphQLNonNull(createUserDto) },
  },
  async resolve(parent: any, args: any, context: any) {
    const { fastify } = context;
    return await fastify.db.users.create(args.data);
  },
};

const updateUser = {
  type: user,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(updateUserDto) },
  },
  async resolve(parent: any, args: any, context: any) {
    try {
      const { id, data } = args;
      const { fastify } = context;
      return await fastify.db.users.change(id, data);
    } catch (e: any) {
      throw new Error(e.message || e);
    }
  },
};

const subscribeToUser = {
  type: user,
  args: {
    data: { type: new GraphQLNonNull(subscriptionDto) },
  },
  async resolve(parent: any, args: any, context: any) {
    const { fastify, usersLoader } = context;
    const { id, userId } = args.data;
    const user = await usersLoader.load(id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const secondUser = await usersLoader.load(userId);
      if (!secondUser) {
        throw new Error('User not found');
      } else {
        if (secondUser.subscribedToUserIds.includes(id)) {
          throw new Error(`Already subscribed`);
        } else {
          return await fastify.db.users.change(userId, {
            subscribedToUserIds: [...secondUser.subscribedToUserIds, id],
          });
        }
      }
    }
  },
};

const unsubscribeFromUser = {
  type: user,
  args: {
    data: { type: new GraphQLNonNull(subscriptionDto) },
  },
  async resolve(parent: any, args: any, context: any) {
    const { fastify, usersLoader } = context;
    const { id, userId } = args.data;
    const user = await usersLoader.load(id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const secondUser = await usersLoader.load(userId);
      if (!secondUser) {
        throw new Error('User not found');
      } else {
        const userIndex = secondUser.subscribedToUserIds.indexOf(id);
        if (userIndex < 0) {
          throw new Error(`User not subscribed`);
        } else {
          secondUser.subscribedToUserIds.splice(userIndex, 1);
          return await fastify.db.users.change(userId, {
            subscribedToUserIds: secondUser.subscribedToUserIds,
          });
        }
      }
    }
  },
};

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  subscribeToUser,
  unsubscribeFromUser,
};
