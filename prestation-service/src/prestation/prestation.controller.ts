import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreatePrestationRequestDto } from './dto/create-prestation-request.dto';
import { GetUserPrestationsDto } from './dto/get-user-prestations.dto';
import { SearchPrestationsDto } from './dto/search-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { PrestationService } from './prestation.service';

@Controller()
export class PrestationController {
  constructor(private readonly appService: PrestationService) {}

  @EventPattern('PRESTATION.GET_ALL')
  async getAll() {
    return await this.appService.getAll();
  }

  @EventPattern('PRESTATION.GET_ALL_ADMIN')
  async getAllAdmin() {
    return await this.appService.getAllAdmin();
  }

  @EventPattern('PRESTATION.CREATE')
  async create(@Payload() data: CreatePrestationRequestDto) {
    const { user, prestation, image } = data;
    return await this.appService.create(prestation, user, image);
  }

  @EventPattern('PRESTATION.GET_PRESTATIONS_OF_USER')
  async getPrestationsOfUser(@Payload() data: GetUserPrestationsDto) {
    const { userId, active } = data;
    return await this.appService.getPrestationsOfUser(userId, active);
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
    @Payload()
    data: {
      id: string;
      prestation: UpdatePrestationDto;
      image: any;
    },
  ) {
    const { id, prestation, image } = data;
    return await this.appService.updatePrestation(id, prestation, image);
  }

  @EventPattern('PRESTATION.ENABLE_ONE')
  async enablePrestation(id: string) {
    return await this.appService.enablePrestation(id);
  }

  @EventPattern('PRESTATION.DISABLE_ONE')
  async disablePrestation(id: string) {
    return await this.appService.disablePrestation(id);
  }

  @EventPattern('PRESTATION.SOFT_DELETE_ALL_BY_USER')
  async softDeletePrestationsOfUser(userId: string) {
    return await this.appService.softDeletePrestationsOfUser(userId);
  }

  @EventPattern('PRESTATION.DELETE_ONE')
  async deletePrestation(id: string) {
    return await this.appService.deletePrestation(id);
  }

  @EventPattern('PRESTATION.SEARCH')
  async searchPrestations(
    @Payload()
    data: SearchPrestationsDto,
  ) {
    return await this.appService.searchPrestations(data);
  }
}
