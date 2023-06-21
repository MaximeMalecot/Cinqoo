import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SearchPrestationsDto {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price_min: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  price_max: number;

  @IsOptional()
  @IsArray()
  categories: string[];
}
