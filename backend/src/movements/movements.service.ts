import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovementsService {
  constructor(private prisma: PrismaService) {}

  async createMovement(data: {
    type: MovementType;
    itemId: string;
    qty: number;
    fromLocationId?: string;
    toLocationId?: string;
    personName?: string;
    siteRoom?: string;
    blNo?: string;
    poNo?: string;
    reason?: string;
    createdById: string;
  }) {
    if (data.qty <= 0) throw new BadRequestException('qty must be > 0');

    return this.prisma.$transaction(async (tx) => {
      // Stock update logic according to type
      const { type, itemId, qty, fromLocationId, toLocationId } = data;

      const inc = async (itemId: string, locationId: string, delta: number) => {
        await tx.stock.upsert({
          where: { itemId_locationId: { itemId, locationId } },
          create: { itemId, locationId, qty: Math.max(delta, 0) },
          update: { qty: { increment: delta } },
        });
      };

      if (type === 'ENTRY') {
        if (!toLocationId) throw new BadRequestException('ENTRY requires toLocationId');
        await inc(itemId, toLocationId, data.qty);
      } else if (type === 'EXIT') {
        if (!fromLocationId) throw new BadRequestException('EXIT requires fromLocationId');
        await inc(itemId, fromLocationId, -data.qty);
      } else if (type === 'TRANSFER') {
        if (!fromLocationId || !toLocationId) throw new BadRequestException('TRANSFER requires fromLocationId and toLocationId');
        await inc(itemId, fromLocationId, -data.qty);
        await inc(itemId, toLocationId, data.qty);
      } else if (type === 'RETURN') {
        if (!toLocationId) throw new BadRequestException('RETURN requires toLocationId');
        await inc(itemId, toLocationId, data.qty);
      } else if (type === 'LOSS') {
        if (!fromLocationId) throw new BadRequestException('LOSS requires fromLocationId');
        await inc(itemId, fromLocationId, -data.qty);
      }

      const movement = await tx.movement.create({ data });
      return movement;
    });
  }

  list(params: { itemId?: string; locationId?: string; limit?: number }) {
    const { itemId, locationId, limit = 100 } = params;
    return this.prisma.movement.findMany({
      where: {
        AND: [
          itemId ? { itemId } : {},
          locationId ? { OR: [{ fromLocationId: locationId }, { toLocationId: locationId }] } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
