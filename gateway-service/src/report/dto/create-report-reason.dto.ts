import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportReasonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
