import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  list(userRole?: string) {
    // Masquage des prix par défaut dans la requête (côté serveur).
    const includePrices = ['ADMIN','LOGISTICIAN','ACCOUNTING'].includes(userRole || '');
    return this.prisma.item.findMany({
      include: { prices: includePrices, supplier: true, stocks: true },
      orderBy: { label: 'asc' },
    });
  }

  get(id: string, userRole?: string) {
    const includePrices = ['ADMIN','LOGISTICIAN','ACCOUNTING'].includes(userRole || '');
    return this.prisma.item.findUnique({
      where: { id },
      include: { prices: includePrices, supplier: true, stocks: true },
    });
  }

  create(dto: CreateItemDto) {
    return this.prisma.item.create({ data: dto });
  }

  update(id: string, dto: UpdateItemDto) {
    return this.prisma.item.update({ where: { id }, data: dto });
  }

  delete(id: string) {
    return this.prisma.item.delete({ where: { id } });
  }
}
