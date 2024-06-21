import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from 'src/common/env';
import { DataSource, DataSourceOptions } from 'typeorm';

export const ormModuleOptions: DataSourceOptions = {
  type: 'mysql',
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [__dirname + '../../../**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: process.env.NODE_ENV === 'prod' ? true : false,
};

export const AppDataSource = new DataSource(ormModuleOptions);
