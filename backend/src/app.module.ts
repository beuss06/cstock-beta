import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { LocationsModule } from './locations/locations.module';
import { MovementsModule } from './movements/movements.module';
import { ToolsModule } from './tools/tools.module';
import { HealthModule } from './health/health.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ItemsModule,
    LocationsModule,
    MovementsModule,
    ToolsModule,
    SuppliersModule,
    HealthModule,
  ],
})
export class AppModule {}
