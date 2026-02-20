import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { AuditEvent } from './audit-event.entity';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@InjectRepository(AuditEvent) private readonly repo: Repository<AuditEvent>) {}

  async append(event: Partial<AuditEvent>): Promise<AuditEvent> {
    const entity = this.repo.create(event);
    const saved = await this.repo.save(entity);
    this.logger.debug(`Audit event: ${saved.event_type} actor=${saved.actor_id} resource=${saved.resource_type}/${saved.resource_id}`);
    return saved;
  }

  async query(params: {
    zone_id?: string;
    resource_type?: string;
    resource_id?: string;
    event_type?: string;
    actor_id?: string;
    from?: string;
    to?: string;
    page: number;
    page_size: number;
  }) {
    const where: FindOptionsWhere<AuditEvent> = {};
    if (params.zone_id) where.zone_id = params.zone_id;
    if (params.resource_type) where.resource_type = params.resource_type;
    if (params.resource_id) where.resource_id = params.resource_id;
    if (params.event_type) where.event_type = params.event_type;
    if (params.actor_id) where.actor_id = params.actor_id;
    if (params.from && params.to) {
      where.timestamp = Between(new Date(params.from), new Date(params.to));
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (params.page - 1) * params.page_size,
      take: params.page_size,
      order: { timestamp: 'DESC' },
    });

    return { data, pagination: { total, page: params.page, page_size: params.page_size } };
  }
}
