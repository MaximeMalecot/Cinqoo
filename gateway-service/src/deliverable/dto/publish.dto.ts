import { IsString } from 'class-validator';

export class PublishDto {
  file: any;

  @IsString()
  name: string;
}
