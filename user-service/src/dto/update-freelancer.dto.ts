import { IsString } from 'class-validator';

export class UpdateFreelancerDto {
  @IsString()
  description: string;
}
