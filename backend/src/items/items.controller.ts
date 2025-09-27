import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('items')
@ApiBearerAuth()
@Controller('items')
@UseGuards(RolesGuard)
export class ItemsController {
  constructor(private service: ItemsService) {}

  @Get()
  async list(@Req() req: any) {
    const role = req.user?.role || 'VIEWER';
    return this.service.list(role);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Req() req: any) {
    const role = req.user?.role || 'VIEWER';
    return this.service.get(id, role);
  }

  @Post()
  @Roles(Role.ADMIN, Role.LOGISTICIAN, Role.STOREKEEPER)
  create(@Body() dto: CreateItemDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.LOGISTICIAN)
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
