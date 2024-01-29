import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class LoginVendorDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ required: true, minLength: 8 })
    password: string;
}
