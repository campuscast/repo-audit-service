import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly svc: AuditService) {}

  @Post()
  async append(@Body() body: any) {
    return this.svc.append(body);
  }

  @Get()
  async query(
    @Query('zone_id') zone_id?: string,
    @Query('resource_type') resource_type?: string,
    @Query('resource_id') resource_id?: string,
    @Query('event_type') event_type?: string,
    @Query('actor_id') actor_id?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page = '1',
    @Query('page_size') page_size = '20',
  ) {
    return this.svc.query({
      zone_id, resource_type, resource_id, event_type, actor_id, from, to,
      page: parseInt(page, 10), page_size: parseInt(page_size, 10),
    });
  }
}
