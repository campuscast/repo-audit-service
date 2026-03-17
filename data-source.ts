import { DataSource } from 'typeorm';
import { AuditEvent } from './src/audit/audit-event.entity';
import { Init1700000000000 } from './src/migrations/1700000000000-Init';

export default new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://campuscast:campuscast@localhost:5432/audit_db',
  entities: [AuditEvent],
  migrations: [Init1700000000000],
});
