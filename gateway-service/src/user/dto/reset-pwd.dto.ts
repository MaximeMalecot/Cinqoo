import { IsString, IsStrongPassword } from 'class-validator';
import { IsMongoIdObject } from 'src/decorators/mongoId.decorator';

export class ResetPasswordDto {
  @IsString()
  @IsMongoIdObject()
  readonly token: string;

  @IsString()
  @IsStrongPassword()
  readonly password: string;
}

export class ResetPasswordRequestDto {
  @IsString()
  readonly email: string;
}
