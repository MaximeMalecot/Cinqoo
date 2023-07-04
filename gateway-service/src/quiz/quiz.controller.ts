import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { QuizCreateDto } from './dto/quiz-create.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    @Inject('QUIZ_SERVICE') private readonly quizService: ClientProxy,
  ) {}

  @Get()
  @Public()
  //   @Roles(ROLE.ADMIN)
  public getHello() {
    return this.quizService.send('QUIZ.HELLO', {});
  }

  @Post()
  @Public()
  public createQuiz(@Body() body: QuizCreateDto) {
    return this.quizService.send('QUIZ.CREATE', body);
  }
}
