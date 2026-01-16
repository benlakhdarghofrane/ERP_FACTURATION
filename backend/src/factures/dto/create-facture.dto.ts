import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFactureItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  quantite: number;

  @IsNumber()
  prix_unitaire: number;
}

export class CreateFactureDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsDateString()
  @IsNotEmpty()
  date_emission: string;

  @IsDateString()
  @IsOptional()
  date_echeance?: string;

  @IsNumber()
  @IsOptional()
  taux_tva?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFactureItemDto)
  items: CreateFactureItemDto[];
}
