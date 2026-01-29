import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddViewCountToTracks1738194000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('tracks', 'view_count');
    if (hasColumn) {
      return;
    }

    await queryRunner.addColumn(
      'tracks',
      new TableColumn({
        name: 'view_count',
        type: 'bigint',
        default: 0,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('tracks', 'view_count');
    if (!hasColumn) {
      return;
    }

    await queryRunner.dropColumn('tracks', 'view_count');
  }
}
