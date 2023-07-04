import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CheckObjectIdPipe } from 'src/pipes/checkobjectid.pipe';
import { QuestionCreateDto } from './dto/question-create.dto';
import { QuestionUpdateDto } from './dto/question-update.dto';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { QuizUpdateDto } from './dto/quiz-update.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    @Inject('QUIZ_SERVICE') private readonly quizService: ClientProxy,
  ) {}

  @Get()
  @Roles(ROLE.FREELANCER, ROLE.ADMIN)
  public getHello() {
    return this.quizService.send('QUIZ.GET_ALL', {});
  }

  @Post()
  @Roles(ROLE.ADMIN)
  public createQuiz(@Body() body: QuizCreateDto) {
    return this.quizService.send('QUIZ.CREATE', body);
  }

  @Put(':id')
  @Roles(ROLE.ADMIN)
  public updateQuiz(
    @Param('id', CheckObjectIdPipe) id: string,
    @Body() body: QuizUpdateDto,
  ) {
    return this.quizService.send('QUIZ.UPDATE', {
      quizId: id,
      ...body,
    });
  }

  @Get(':id')
  @Roles(ROLE.FREELANCER)
  public getQuizPublic(@Param('id', CheckObjectIdPipe) id: string) {
    return this.quizService.send('QUIZ.GET_PUBLIC', id);
  }

  @Get(':id/full')
  @Roles(ROLE.ADMIN)
  public getQuizFull(@Param('id', CheckObjectIdPipe) id: string) {
    return this.quizService.send('QUIZ.GET_FULL', id);
  }

  @Post(':id/question')
  @Roles(ROLE.ADMIN)
  public createQuestion(
    @Param('id', CheckObjectIdPipe) id: string,
    @Body() body: QuestionCreateDto,
  ) {
    return this.quizService.send('QUIZ.CREATE_QUESTION', {
      quizId: id,
      ...body,
    });
  }

  @Get('questions/:id')
  @Roles(ROLE.ADMIN)
  public getQuestionFull(@Param('id', CheckObjectIdPipe) id: string) {
    return this.quizService.send('QUIZ.GET_FULL_QUESTION', id);
  }

  @Put('questions/:id')
  @Roles(ROLE.ADMIN)
  public updateQuestion(
    @Param('id', CheckObjectIdPipe) id: string,
    @Body() body: QuestionUpdateDto,
  ) {
    return this.quizService.send('QUIZ.UPDATE_QUESTION', {
      questionId: id,
      ...body,
    });
  }

  @Delete('questions/:id')
  @Roles(ROLE.ADMIN)
  public deleteQuestion(@Param('id', CheckObjectIdPipe) id: string) {
    return this.quizService.send('QUIZ.DELETE_QUESTION', id);
  }
}
