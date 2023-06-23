import { IsString } from 'class-validator';

export class ReviewRequestDto {
  @IsString()
  prestationId: string;
}
