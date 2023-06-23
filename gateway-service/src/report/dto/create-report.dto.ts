import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsMongoIdObject } from 'src/decorators/mongoId.decorator';

export class CreateReportDto {
  @IsOptional()
  @IsMongoIdObject()
  service: string;

  @IsOptional()
  @IsMongoIdObject()
  target: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsMongoIdObject()
  reportReason: string;
}
