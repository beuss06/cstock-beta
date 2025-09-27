import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ToolEventType } from '@prisma/client';

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}

  list() { return this.prisma.tool.findMany({ include: { events: true } }); }
  create(data: any) { return this.prisma.tool.create({ data }); }
  event(toolId: string, data: { type: ToolEventType; locationId?: string; personName?: string; notes?: string }) {
    return this.prisma.toolEvent.create({ data: { ...data, toolId } });
  }
}
