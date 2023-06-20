import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CategoryService } from './category.service';

@Controller()
export class CategoryController {
  constructor(private readonly appService: CategoryService) {}

  @EventPattern('CATEGORY.GET_HELLO')
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
