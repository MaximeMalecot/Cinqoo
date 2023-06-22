import { IsString } from 'class-validator';

export class SendMailDto {
  @IsString()
  targetId: string;
  @IsString()
  subject: string;
  @IsString()
  text: string;
}
