import { IsNumber, IsString } from "class-validator";

export class CreatePriceDto{
    @IsString()
    productId: string;

    @IsNumber()
    amount: number;

}