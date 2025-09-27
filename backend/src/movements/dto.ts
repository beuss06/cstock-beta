import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MovementType } from '@prisma/client';

export class CreateMovementDto {
  @IsEnum(MovementType) type!: MovementType;
  @IsString() itemId!: string;

  @IsInt() @Min(1)
  qty!: number;

  @IsOptional() @IsString()
  fromLocationId?: string;

  @IsOptional() @IsString()
  toLocationId?: string;

  @IsOptional() @IsString()
  blNo?: string;

  @IsOptional() @IsString()
  poNo?: string;

  @IsOptional() @IsString()
  personName?: string;

  @IsOptional() @IsString()
  siteRoom?: string;

  @IsOptional() @IsString()
  reason?: string;
}
