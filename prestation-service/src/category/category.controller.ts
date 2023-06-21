import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller()
export class CategoryController {
  constructor(private readonly appService: CategoryService) {}

  @EventPattern('CATEGORY.GET_HELLO')
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @EventPattern('CATEGORY.GET_ALL')
  async getAll() {
    return await this.appService.getAll();
  }

  @EventPattern('CATEGORY.GET_ONE')
  async getOne(id: number) {
    return await this.appService.getOne(id);
  }

  @EventPattern('CATEGORY.CREATE_ONE')
  async createOne(@Payload() data: CreateCategoryDto) {
    return await this.appService.createOne(data);
  }

  @EventPattern('CATEGORY.UPDATE_ONE')
  async updateOne(@Payload() data: UpdateCategoryDto) {
    return await this.appService.updateOne(data);
  }
}
