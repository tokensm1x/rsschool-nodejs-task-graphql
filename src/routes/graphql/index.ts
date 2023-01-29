import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema, schema } from './schema';
import { graphql } from 'graphql';

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
      const { query, variables } = request.body;
      return await graphql({
        schema: schema,
        source: String(query),
        variableValues: variables,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
