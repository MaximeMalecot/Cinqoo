import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Answer {
  _id?: string;

  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: Boolean, required: true })
  isRight: boolean;
}

const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema()
export class Question {
  _id?: string;

  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: [AnswerSchema], required: true })
  answers: Array<Answer>;
}

const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema()
export class Quiz {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: [QuestionSchema], required: false, default: [] })
  questions: Array<Question>;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
