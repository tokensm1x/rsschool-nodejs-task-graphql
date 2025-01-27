import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema, schema } from './schema';
import { graphql, parse } from 'graphql';
import { validate } from 'graphql/validation';
import depthLimit from 'graphql-depth-limit';
import DataLoader from 'dataloader';
import { batchUsers, batchSubscribedUsers } from './data-loaders/users-loader';

const depth_limit = 6;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request: any, reply) {
      const { query } = request.body;
      const isInvalid = !!validate(schema, parse(query), [
        depthLimit(depth_limit),
      ]).length;
      if (isInvalid) {
        return reply.send({
          data: null,
          errors: `Depth limit validation error (Max ${depth_limit}) levels`,
        });
      }
      return await graphql({
        schema: schema,
        source: query,
        contextValue: {
          fastify: fastify,
          usersLoader: new DataLoader((keys) => batchUsers(keys, fastify)),
          subscribedUsersLoader: new DataLoader((keys) =>
            batchSubscribedUsers(keys, fastify)
          ),
        },
      });
    }
  );
};

export default plugin;
