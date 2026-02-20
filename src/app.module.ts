import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from './audit/audit.module';
import { AuditEvent } from './audit/audit-event.entity';
import { HealthController } from './common/health.controller';
import { appConfig, dbConfig, validate } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig],
      validate,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://campuscast:campuscast@localhost:5432/audit_db',
      entities: [AuditEvent],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    AuditModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
