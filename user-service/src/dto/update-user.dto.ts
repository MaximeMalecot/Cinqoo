import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
} from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public username?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsStrongPassword()
    oldPassword: string;

    @IsOptional()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}
