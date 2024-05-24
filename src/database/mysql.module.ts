import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from 'src/common/env';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      entities: [__dirname + '../../**/entities/*.entity{.ts,.js}'],
      migrations: [__dirname + 'migrations/*{.ts}'],
      synchronize: true,
      migrationsRun: false,
      logging: true,
    }),
  ],
})
export class MysqlModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      const database = await this.dataSource.initialize();
      console.log(`Connected to database: ${database.options.database}`);
    } catch (err) {
      console.error('Failed to connect to database:', err);
    }
  }
}
