import { IsArray, IsBoolean, IsString } from 'class-validator';

class Answer {
  @IsString()
  label: string;

  @IsBoolean()
  isRight: boolean;
}

export class QuestionUpdateDto {
  @IsString()
  label: string;

  @IsArray()
  answers: Array<Answer>;
}
