import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UpdatePwdUserDto {
  @IsNotEmpty()
  @IsStrongPassword()
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
