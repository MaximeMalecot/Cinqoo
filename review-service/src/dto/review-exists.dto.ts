import { IsString } from 'class-validator';

export class ReviewExistsDto {
  @IsString()
  prestationId: string;
  @IsString()
  userId: string;
}
