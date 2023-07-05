import { IsArray, IsBoolean, IsString } from 'class-validator';

class Answer {
  @IsString()
  label: string;

  @IsBoolean()
  isRight: boolean;
}

export class QuestionCreateDto {
  @IsString()
  quizId: string;

  @IsString()
  label: string;

  @IsArray()
  answers: Array<Answer>;
}
