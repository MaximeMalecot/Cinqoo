import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsMongoIdObject } from 'src/decorators/mongoId.decorator';

export class CreateReportDto {
  @IsOptional()
  @IsMongoIdObject()
  service: string;

  @IsOptional()
  @IsMongoIdObject()
  target: string;

  @IsNotEmpty()
  @IsMongoIdObject()
  reportReason: string;
}
