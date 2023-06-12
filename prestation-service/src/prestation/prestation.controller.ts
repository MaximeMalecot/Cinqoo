import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreatePrestationRequestDto } from './dto/create-prestation-request.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { PrestationService } from './prestation.service';

@Controller()
export class PrestationController {
  constructor(private readonly appService: PrestationService) {}

  @EventPattern('PRESTATION.GET_HELLO')
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @EventPattern('PRESTATION.CREATE')
  async create(@Payload() data: CreatePrestationRequestDto) {
    const { user, prestation } = data;
    return await this.appService.create(prestation, user);
  }

  @EventPattern('PRESTATION.GET_PRESTATIONS_OF_USER')
  async getPrestationsOfUser(userId: string) {
    console.log('userId', userId);
    return await this.appService.getPrestationsOfUser(userId);
  }

  @EventPattern('PRESTATION.GET_ACTIVE_PRESTATIONS_OF_USER')
  async getActivePrestationsOfUser(userId: string) {
    return await this.appService.getActivePrestationsOfUser(userId);
  }

  @EventPattern('PRESTATION.GET_ONE')
  async getPrestation(id: string) {
    return await this.appService.getPrestation(id);
  }

  @EventPattern('PRESTATION.UPDATE_ONE')
  async updatePrestation(
    @Payload() data: { id: string; prestation: UpdatePrestationDto },
  ) {
    const { id, prestation } = data;
    return await this.appService.updatePrestation(id, prestation);
  }
}
