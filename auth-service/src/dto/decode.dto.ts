import { IsString } from "class-validator";

export class DecodeDto {
    @IsString()
    public token: string;
}
