import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ToolEventType } from '@prisma/client';

@ApiTags('tools')
@ApiBearerAuth()
@Controller('tools')
export class ToolsController {
  constructor(private service: ToolsService) {}

  @Get()
  list() { return this.service.list(); }

  @Post()
  create(@Body() body: any) { return this.service.create(body); }

  @Post(':id/events')
  event(@Param('id') id: string, @Body() body: any) {
    return this.service.event(id, { type: body.type as ToolEventType, locationId: body.locationId, personName: body.personName, notes: body.notes });
  }
}
