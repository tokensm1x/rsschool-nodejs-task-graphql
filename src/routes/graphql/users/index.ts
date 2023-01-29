import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { user, createUserDto, updateUserDto, subscriptionDto } from './schema';

const getUsers = {
  type: new GraphQLList(user),
  async resolve(parent: any, args: any, context: any) {
    return await context.db.users.findMany();
  },
};

const getUserById = {
  type: user,
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  async resolve(parent: any, args: any, context: any) {
    const user = await context.db.users.findOne({
      key: 'id',
      equals: args.id,
    });
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
    return await context.db.users.create(args.data);
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
      return await context.db.users.change(id, data);
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
    const { id, userId } = args.data;
    const user = await context.db.users.findOne({ key: 'id', equals: id });
    if (!user) {
      throw new Error('User not found');
    } else {
      const secondUser = await context.db.users.findOne({
        key: 'id',
        equals: userId,
      });
      if (!secondUser) {
        throw new Error('User not found');
      } else {
        if (secondUser.subscribedToUserIds.includes(id)) {
          throw new Error(`Already subscribed`);
        } else {
          return await context.db.users.change(userId, {
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
    const { id, userId } = args.data;
    const user = await context.db.users.findOne({ key: 'id', equals: id });
    if (!user) {
      throw new Error('User not found');
    } else {
      const secondUser = await context.db.users.findOne({
        key: 'id',
        equals: userId,
      });
      if (!secondUser) {
        throw new Error('User not found');
      } else {
        const userIndex = secondUser.subscribedToUserIds.indexOf(id);
        if (userIndex < 0) {
          throw new Error(`User not subscribed`);
        } else {
          secondUser.subscribedToUserIds.splice(userIndex, 1);
          return await context.db.users.change(userId, {
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
