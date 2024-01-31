import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsNumber()
    @Max(1000000)
    @ApiProperty({ type: Number, description: 'Amount to be converted', required: true })
    amount: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(3)
    @ApiProperty({ type: String, description: 'Currency for the transaction', required: true })
    currency: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ type: String, description: 'Email to receive the payment', required: true })
    email: string;
}