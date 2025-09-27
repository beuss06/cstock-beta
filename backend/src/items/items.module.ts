import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { RolesGuard } from '../auth/roles.guard'; // ← ajoute

@Module({
  providers: [ItemsService, RolesGuard], // ← déclare le guard ici
  controllers: [ItemsController],
})
export class ItemsModule {}
