import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRootInUser1780917071974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            INSERT INTO public."user"(
            name,email,cpf,type_user,phone,password)
            VALUES ('root', 'root@root.com', '12345678901', 2, '31925325252', '$2b$10$ddZze6ZZ9jHpDteMqTyWc.wt2T6yPy8WeGc01YAwwx8/5RSDHs0TO');  
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DELETE FROM public."user"
                WHERE email like 'root@root.com'; 
        `);
    }
}
