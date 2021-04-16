import path = require('path');
require('dotenv').config({ path: `.env.production` });

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrationsRun: true,
  migrationsTableName: 'migration',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGING === 'true',
  entities: [path.join(__dirname, '/src/app/entities/**.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/../../migration/**{.ts,.js}')],
  cli: {
    migrationsDir: '/migration',
    entitiesDir: 'apps/api/src/app/entities',
  },
};
