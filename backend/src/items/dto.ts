import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateItemDto {
  @IsString()
  refCode!: string;

  @IsString()
  label!: string;

  @IsOptional() @IsString()
  ean?: string;

  @IsOptional() @IsString()
  family?: string;

  @IsOptional() @IsString()
  unit?: string;

  @IsOptional() @IsUrl()
  photoUrl?: string;
}

export class UpdateItemDto {
  @IsOptional() @IsString()
  label?: string;

  @IsOptional() @IsString()
  ean?: string;

  @IsOptional() @IsString()
  family?: string;

  @IsOptional() @IsString()
  unit?: string;

  @IsOptional() @IsUrl()
  photoUrl?: string;
}
