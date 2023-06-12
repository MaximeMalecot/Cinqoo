import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    @Inject('PRESTATION_SERVICE')
    private readonly categoryService: ClientProxy,
  ) {}

  @Get()
  public getCategoryHello() {
    return this.categoryService.send('CATEGORY.GET_HELLO', {});
  }
}
