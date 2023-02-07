import { UserEntity } from '../../../utils/DB/entities/DBUsers';

const batchUsers = async (keys: any, fastify: any): Promise<any> => {
  const users = await fastify.db.users.findMany({
    key: 'id',
    equalsAnyOf: keys,
  });

  return keys.map((k: string) => users.find((el: any) => el.id === k));
};

const batchSubscribedUsers = async (keys: any, fastify: any): Promise<any> => {
  const users = await fastify.db.users.findMany({
    key: 'subscribedToUserIds',
    inArrayAnyOf: keys,
  });

  return keys.map((k: string) =>
    users.filter((el: UserEntity) => el.subscribedToUserIds.includes(k))
  );
};

export { batchSubscribedUsers, batchUsers };
