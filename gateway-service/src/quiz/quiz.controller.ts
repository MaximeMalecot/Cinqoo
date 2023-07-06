import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
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

  @Delete(':id')
  @Roles(ROLE.ADMIN)
  public deleteQuiz(@Param('id', CheckObjectIdPipe) id: string) {
    return this.quizService.send('QUIZ.DELETE', id);
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

  /// RESULTS

  @Get('results')
  @Roles(ROLE.FREELANCER, ROLE.ADMIN)
  public getSelfResults(@Req() req: any) {
    return this.quizService.send('RESULT.GET_RESULTS_OF_USER', req.user._id);
  }

  @Get('results/success/self')
  @Roles(ROLE.FREELANCER, ROLE.ADMIN)
  public getSelfSuccess(@Req() req: any) {
    return this.quizService.send('RESULT.GET_SUCCES_OF_USER', req.user._id);
  }

  @Get('results/success/:id')
  @Public()
  public getSuccessOfUser(
    @Req() req: any,
    @Param('id', CheckObjectIdPipe) id: string,
  ) {
    return this.quizService.send('RESULT.GET_SUCCES_OF_USER', id);
  }

  @Get('results/quiz/:id')
  @Roles(ROLE.FREELANCER, ROLE.ADMIN)
  public getSelfResultsOfQuiz(
    @Req() req: any,
    @Param('id', CheckObjectIdPipe) id: string,
  ) {
    return this.quizService.send('RESULT.GET_RESULT_OF_QUIZ_FOR_USER', {
      userId: req.user._id,
      quizId: id,
    });
  }

  @Get('results/:id')
  @Roles(ROLE.ADMIN)
  public getResults(@Param('id', CheckObjectIdPipe) id: string) {
    return this.quizService.send('RESULT.GET_RESULTS_OF_USER', id);
  }

  @Get('results/success/:id')
  public getResultOfQuiz(@Param('id', CheckObjectIdPipe) id: string) {
    return this.quizService.send('RESULT.GET_SUCCES_OF_USER', id);
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
  @Roles(ROLE.FREELANCER, ROLE.ADMIN)
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
}
