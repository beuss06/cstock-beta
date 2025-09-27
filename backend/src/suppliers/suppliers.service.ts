import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.supplier.findMany({ orderBy: { name: 'asc' } }); }
  create(data: any) { return this.prisma.supplier.create({ data }); }
}
