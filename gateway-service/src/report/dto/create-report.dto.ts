import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  service: string;

  @IsString()
  target: string;

  @IsNotEmpty()
  @IsString()
  reportReason: string;
}
