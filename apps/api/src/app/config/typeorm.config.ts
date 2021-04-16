import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as entities from '../entities';

export enum ConfigEnum {
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',
  DB_SYNCHRONIZE = 'DB_SYNCHRONIZE',
  DB_LOGING = 'DB_LOGING',
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
}

export type typeOrmConfigType = (
  configService: ConfigService
) => TypeOrmModuleOptions;

const entitiesArr = Object.keys(entities).map((entity) => entities[entity]);

export const typeOrmConfig: typeOrmConfigType = (
  configService: ConfigService
) => {
  return {
    type: 'postgres',
    host: configService.get<string>(ConfigEnum.DB_HOST),
    port: +configService.get<number>(ConfigEnum.DB_PORT),
    username: configService.get<string>(ConfigEnum.DB_USERNAME),
    password: configService.get<string>(ConfigEnum.DB_PASSWORD),
    database: configService.get<string>(ConfigEnum.DB_DATABASE),
    migrationsRun: false,
    entities: [...entitiesArr],
    synchronize:
      configService.get<string>(ConfigEnum.DB_SYNCHRONIZE) === 'true',
    logging: configService.get<string>(ConfigEnum.DB_LOGING) === 'true',
  };
};
