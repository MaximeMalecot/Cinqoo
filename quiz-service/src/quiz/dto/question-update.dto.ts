import { IsArray, IsBoolean, IsString } from 'class-validator';

class Answer {
  @IsString()
  label: string;

  @IsBoolean()
  isRight: boolean;
}

export class RequestQuestionUpdateDto {
  @IsString()
  questionId: string;

  @IsString()
  label: string;

  @IsArray()
  answers: Array<Answer>;
}

export class QuestionUpdateDto {
  @IsString()
  label: string;

  @IsArray()
  answers: Array<Answer>;
}
