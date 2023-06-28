import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROLE } from 'src/auth/enums/role.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    @Inject('PRESTATION_SERVICE')
    private readonly categoryService: ClientProxy,
  ) {}

  @Get('all')
  @Public()
  public getAll() {
    return this.categoryService.send('CATEGORY.GET_ALL', {});
  }

  @Get(':categoryId')
  @Public()
  public getOne(@Param('categoryId') categoryId: string) {
    return this.categoryService.send('CATEGORY.GET_ONE', categoryId);
  }

  @Get(':categoryId/prestations')
  @Public()
  public getPrestationsByCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.send(
      'CATEGORY.GET_PRESTATION_BY_CATEGORY',
      categoryId,
    );
  }

  @Post()
  @Roles(ROLE.ADMIN)
  public createOne(@Body() data: CreateCategoryDto) {
    return this.categoryService.send('CATEGORY.CREATE_ONE', data);
  }

  @Patch(':categoryId')
  @Roles(ROLE.ADMIN)
  public updateOne(
    @Param('categoryId') categoryId: string,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoryService.send('CATEGORY.UPDATE_ONE', {
      id: categoryId,
      ...data,
    });
  }
}
