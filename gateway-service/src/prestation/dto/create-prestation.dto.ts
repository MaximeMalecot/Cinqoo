import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePrestationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  revisionNb?: number;

  @IsInt()
  delay: number;

  @IsString()
  image: string; // Provisoire

  @IsArray()
  @IsOptional()
  categories?: string[];
}
