import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { getDatabaseConfig } from '../config/configuration';

config();

const dbConfig = getDatabaseConfig();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  ...dbConfig,
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
