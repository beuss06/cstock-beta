import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MovementsService } from './movements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMovementDto } from './dto';

@ApiTags('movements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movements')
export class MovementsController {
  constructor(private readonly service: MovementsService) {}

  @Get()
  list(
    @Query('itemId') itemId?: string,
    @Query('locationId') locationId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.list({
      itemId,
      locationId,
      limit: limit ? parseInt(limit, 10) : 100,
    });
  }

  @Post()
  async create(@Req() req: any, @Body() body: CreateMovementDto) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Missing user token');
    return this.service.createMovement({ ...body, createdById: userId });
  }
}
