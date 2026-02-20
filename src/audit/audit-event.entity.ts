import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_events')
@Index(['zone_id', 'timestamp'])
@Index(['resource_type', 'resource_id'])
@Index(['actor_id', 'timestamp'])
export class AuditEvent {
  @PrimaryGeneratedColumn('uuid')
  event_id: string;

  @Column()
  event_type: string;

  @Column()
  actor_type: string;

  @Column()
  actor_id: string;

  @Column({ nullable: true })
  zone_id: string;

  @Column({ nullable: true })
  resource_type: string;

  @Column({ nullable: true })
  resource_id: string;

  @Column()
  action: string;

  @Column('jsonb', { default: '{}' })
  detail: Record<string, any>;

  @Column({ nullable: true })
  causal_chain: string;

  @Column({ nullable: true })
  session_id: string;

  @Column({ nullable: true })
  correlation_id: string;

  @Column({ nullable: true })
  ip_address: string;

  @CreateDateColumn()
  timestamp: Date;
}
