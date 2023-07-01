import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Command } from 'nestjs-command';
import { firstValueFrom } from 'rxjs';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';

@Injectable()
export class CategorySeed {
  constructor(
    @Inject('PRESTATION_SERVICE')
    private readonly categoryService: ClientProxy,
  ) {}

  @Command({
    command: 'db:seed:categories',
    describe: 'seed categories',
  })
  async seed() {
    console.log('SEEDING CATEGORIES -----');
    let categories: Array<CreateCategoryDto> = [
      {
        name: 'Awesome AI',
        description:
          "Categorie des prestations touchant à l'intelligence artificielle",
      },
      {
        name: 'Worpress',
        description:
          'Categorie des prestations touchant à la création de sites bofs sans trop se fouler',
      },
      {
        name: 'Moto',
        description: 'Categorie des prestations de moto',
      },
    ];
    for (let i = 0; i < categories.length; i++) {
      let tmpCategory = await firstValueFrom(
        this.categoryService.send('CATEGORY.CREATE_ONE', categories[i]),
      );
      console.log(`Created category with id: ${tmpCategory._id}`);
    }
  }
}
