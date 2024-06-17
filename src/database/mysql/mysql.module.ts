import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ormModuleOptions } from './type-orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ormModuleOptions)],
})
export class MysqlModule implements OnModuleInit {
  private readonly logger = new Logger(MysqlModule.name);
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      if (this.dataSource.isInitialized)
        this.logger.log(
          `Connected to database: ${this.dataSource.options.database}`,
        );
    } catch (err) {
      this.logger.error('Failed to connect to database:', err);
    }
  }
}
