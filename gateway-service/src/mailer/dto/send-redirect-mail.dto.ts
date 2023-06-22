import { IsString } from 'class-validator';
import { SendMailDto } from './send-mail.dto';

export class SendRedirectMailDto extends SendMailDto {
  @IsString()
  redirectUrl: string;

  @IsString()
  label: string;
}
