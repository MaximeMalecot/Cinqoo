import { IsString } from 'class-validator';

export class PublishDto {
  @IsString()
  link: string;

  @IsString()
  name: string;
}
