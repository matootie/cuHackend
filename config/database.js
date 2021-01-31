module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DB_HOST', 'localhost'),
        port: env.int('DB_PORT', 5432),
        database: env('DB_NAME', 'strapi'),
        username: env('DB_USER', 'strapi'),
        password: env('DB_PASSWORD', 'strapi')
      },
      options: {},
    },
  },
});
