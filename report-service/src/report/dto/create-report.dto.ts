import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  creator: string;

  @IsString()
  target: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  reportReason: string;
}
