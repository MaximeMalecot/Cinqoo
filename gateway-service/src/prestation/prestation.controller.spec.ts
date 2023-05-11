import { Test, TestingModule } from '@nestjs/testing';
import { PrestationController } from './prestation.controller';

describe('PrestationController', () => {
  let controller: PrestationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestationController],
    }).compile();

    controller = module.get<PrestationController>(PrestationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
