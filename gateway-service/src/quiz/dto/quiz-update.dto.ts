import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QuizUpdateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  duration: number;
}

export class RequestQuizUpdateDto extends QuizUpdateDto {
  @IsString()
  quizId: string;
}
