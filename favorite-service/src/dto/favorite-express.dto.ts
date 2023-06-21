import { IsNotEmpty, IsString } from 'class-validator';

export class FavoriteRequestDto {
  @IsString()
  @IsNotEmpty()
  prestationId: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class GetFavoritesDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class FavoriteResultDto {
  status: boolean;
  message: 'ADDED' | 'DELETED';
}
