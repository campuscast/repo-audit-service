import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly svc: AuditService) {}

  @Post()
  async append(@Body() body: any) {
    return this.svc.append(body);
  }

  @Post('telemetry')
  async telemetry(@Body() body: {
    device_id: string;
    current_release_id?: string;
    playback_status?: string;
    errors?: string[];
    invalid_signature?: boolean;
  }) {
    const eventType = body.invalid_signature ? 'security.signature_invalid' : 'player.telemetry';
    return this.svc.append({
      event_type: eventType,
      actor_type: 'device',
      actor_id: body.device_id,
      resource_type: 'release',
      resource_id: body.current_release_id || 'unknown',
      action: body.invalid_signature ? 'signature_invalid' : 'telemetry_report',
      detail: {
        playback_status: body.playback_status,
        errors: body.errors || [],
      },
    });
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
