import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  mark: number;
  @IsOptional()
  @IsString()
  comment?: string;
  @IsString()
  prestationId: string;
  @IsString()
  userId: string;
}
