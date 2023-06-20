import { IsObject, IsString } from 'class-validator';
import { CreatePrestationDto } from './create-prestation.dto';

export class CreatePrestationRequestDto {
  @IsString()
  user: string;

  @IsObject()
  prestation: CreatePrestationDto;
}
