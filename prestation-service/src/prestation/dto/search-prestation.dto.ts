import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SearchPrestationsDto {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price_min: number;

  @IsOptional()
  @Min(0)
  @IsNumber()
  price_max: number;

  @IsOptional()
  @IsArray()
  categories: string[];
}
