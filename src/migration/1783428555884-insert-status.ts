import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertStatus1783428555884 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO public.payment_status(id, name) VALUES (1, 'Done');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public.payment_status WHERE id = 1;
    `);
  }
}
