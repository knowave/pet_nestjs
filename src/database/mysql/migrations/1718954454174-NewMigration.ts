import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1718954454174 implements MigrationInterface {
  name = 'NewMigration1718954454174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`like\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` varchar(36) NULL, \`feedId\` varchar(36) NULL, \`commentId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feed\` ADD \`likeCount\` int NOT NULL COMMENT '좋아요 수' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`likeCount\` int NOT NULL COMMENT '좋아요 수' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` ADD CONSTRAINT \`FK_e8fb739f08d47955a39850fac23\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` ADD CONSTRAINT \`FK_fcafd5e13c3d3bcc70db02d4cd0\` FOREIGN KEY (\`feedId\`) REFERENCES \`feed\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` ADD CONSTRAINT \`FK_d86e0a3eeecc21faa0da415a18a\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_d86e0a3eeecc21faa0da415a18a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_fcafd5e13c3d3bcc70db02d4cd0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_e8fb739f08d47955a39850fac23\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`likeCount\``,
    );
    await queryRunner.query(`ALTER TABLE \`feed\` DROP COLUMN \`likeCount\``);
    await queryRunner.query(`DROP TABLE \`like\``);
  }
}
