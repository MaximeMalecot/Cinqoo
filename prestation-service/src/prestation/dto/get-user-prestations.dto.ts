import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetUserPrestationsDto {
  @IsString()
  userId: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
