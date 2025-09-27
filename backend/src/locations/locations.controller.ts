import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('locations')
@ApiBearerAuth()
@Controller('locations')
export class LocationsController {
  constructor(private service: LocationsService) {}

  @Get()
  list() { return this.service.list(); }

  @Get(':id')
  get(@Param('id') id: string) { return this.service.get(id); }

  @Post()
  create(@Body() body: any) { return this.service.create(body); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }

  @Patch(':id/archive')
  archive(@Param('id') id: string) { return this.service.archive(id); }
}
