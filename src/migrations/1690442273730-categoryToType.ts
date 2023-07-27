import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoryToType1690442273730 implements MigrationInterface {
  name = 'categoryToType1690442273730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 실제 수행할 작업
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `category` TO `type`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // revert할 작업
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
    );
  }
}
