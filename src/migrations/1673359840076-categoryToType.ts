import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoryToType1673359840076 implements MigrationInterface {
  name = 'categoryToType1673359840076';
  public async up(queryRunner: QueryRunner): Promise<void> {
    //? up에는 실제 수행할 기능
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `category` TO `type`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //? down에는 롤백시 수행할 기능
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
    );
  }
}
