import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QuizCreateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  duration: number;
}
