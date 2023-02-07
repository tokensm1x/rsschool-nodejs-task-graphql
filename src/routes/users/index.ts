import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: any, reply): Promise<UserEntity> {
      const user = await this.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!user) {
        throw reply.notFound('User not found');
      }
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request: any, reply): Promise<UserEntity> {
      return await this.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: any, reply): Promise<UserEntity> {
      try {
        const userId = request.params.id;
        const profile = await this.db.profiles.findOne({
          key: 'userId',
          equals: userId,
        });
        const posts = await this.db.posts.findMany({
          key: 'userId',
          equals: userId,
        });
        const subscriptions = await this.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: userId,
        });
        subscriptions.forEach(async (user) => {
          const userIndex = user.subscribedToUserIds.indexOf(userId);
          user.subscribedToUserIds.splice(userIndex, 1);
          await this.db.users.change(user.id, {
            subscribedToUserIds: user.subscribedToUserIds,
          });
        });
        posts.forEach(async (post) => {
          await this.db.posts.delete(post.id);
        });
        if (profile) {
          await this.db.profiles.delete(profile.id);
        }
        return await this.db.users.delete(request.params.id);
      } catch (error: any) {
        throw reply.badRequest(error.message);
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: any, reply): Promise<UserEntity> {
      const userId = request.params.id;
      const secondUserId = request.body.userId;
      const user = await this.db.users.findOne({ key: 'id', equals: userId });
      if (!user) {
        throw reply.notFound('User not found');
      } else {
        const secondUser = await this.db.users.findOne({
          key: 'id',
          equals: secondUserId,
        });
        if (!secondUser) {
          throw reply.badRequest('User not found');
        } else {
          if (secondUser.subscribedToUserIds.includes(userId)) {
            throw reply.badRequest(`Already subscribed`);
          } else {
            return await this.db.users.change(secondUserId, {
              subscribedToUserIds: [...secondUser.subscribedToUserIds, userId],
            });
          }
        }
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: any, reply): Promise<UserEntity> {
      const userId = request.params.id;
      const secondUserId = request.body.userId;
      const user = await this.db.users.findOne({ key: 'id', equals: userId });
      if (!user) {
        throw reply.notFound('User not found');
      } else {
        const secondUser = await this.db.users.findOne({
          key: 'id',
          equals: secondUserId,
        });
        if (!secondUser) {
          throw reply.badRequest(`User not found`);
        } else {
          const userIndex = secondUser.subscribedToUserIds.indexOf(userId);
          if (userIndex < 0) {
            throw reply.badRequest(`User not subscribed`);
          } else {
            secondUser.subscribedToUserIds.splice(userIndex, 1);
            return await this.db.users.change(secondUserId, {
              subscribedToUserIds: secondUser.subscribedToUserIds,
            });
          }
        }
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: any, reply): Promise<UserEntity> {
      try {
        return await this.db.users.change(request.params.id, request.body);
      } catch (error: any) {
        throw reply.badRequest(error.message);
      }
    }
  );
};

export default plugin;
