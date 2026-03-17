import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Real initial migration for audit_db.
 * Tables: audit_events
 */
export class Init1700000000000 implements MigrationInterface {
  name = 'Init1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_events" (
        "event_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "event_type" character varying NOT NULL,
        "actor_type" character varying NOT NULL,
        "actor_id" character varying NOT NULL,
        "zone_id" character varying,
        "resource_type" character varying,
        "resource_id" character varying,
        "action" character varying NOT NULL,
        "detail" jsonb NOT NULL DEFAULT '{}',
        "causal_chain" character varying,
        "session_id" character varying,
        "correlation_id" character varying,
        "ip_address" character varying,
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_events" PRIMARY KEY ("event_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_zone_timestamp"
        ON "audit_events" ("zone_id", "timestamp")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_resource"
        ON "audit_events" ("resource_type", "resource_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_actor_timestamp"
        ON "audit_events" ("actor_id", "timestamp")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_events"`);
  }
}
