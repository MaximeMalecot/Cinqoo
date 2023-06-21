import { IsString } from 'class-validator';

export class DoneRequestDto {
  @IsString()
  applicant: string;
  @IsString()
  serviceId: string;
}
