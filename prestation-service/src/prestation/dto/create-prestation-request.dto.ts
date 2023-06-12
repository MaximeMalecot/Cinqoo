import { IsObject } from 'class-validator';
import { CreatePrestationDto } from './create-prestation.dto';

export class CreatePrestationRequestDto {
  @IsObject()
  user: any;

  @IsObject()
  prestation: CreatePrestationDto;
}
