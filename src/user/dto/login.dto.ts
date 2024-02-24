import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    email: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }, {
        message: 'password is too weak, it must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol or special character.'
    })
    @ApiProperty({ required: true })
    password: string;
}