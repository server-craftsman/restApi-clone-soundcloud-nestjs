import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1769502167642 implements MigrationInterface {
  name = 'Initial1769502167642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tracks_status_enum" AS ENUM('uploaded', 'processing', 'ready', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "user_id" uuid NOT NULL, "object_key" character varying(512) NOT NULL, "transcoded_object_key" character varying(512), "content_type" character varying(128) NOT NULL, "size" bigint NOT NULL, "durationSeconds" numeric(10,2), "status" "public"."tracks_status_enum" NOT NULL DEFAULT 'uploaded', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_subscriptionplan_enum" AS ENUM('free', 'pro')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "provider" character varying(64), "providerId" character varying(255), "password" character varying(512), "avatar" character varying(512), "bio" text, "subscriptionPlan" "public"."users_subscriptionplan_enum" NOT NULL DEFAULT 'free', "subscriptionExpiresAt" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_subscriptionplan_enum"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(`DROP TYPE "public"."tracks_status_enum"`);
  }
}
