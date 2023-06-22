import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
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

  @IsString()
  @IsOptional()
  categories?: any;

  @IsNumber()
  @IsPositive()
  price: number;
}
