import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.location.findMany({ orderBy: { name: 'asc' } });
  }
  get(id: string) {
    return this.prisma.location.findUnique({ where: { id } });
  }
  create(data: any) {
    return this.prisma.location.create({ data });
  }
  update(id: string, data: any) {
    return this.prisma.location.update({ where: { id }, data });
  }
  archive(id: string) {
    return this.prisma.location.update({ where: { id }, data: { archived: true } });
  }
}
