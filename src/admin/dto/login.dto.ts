import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAdminDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({ required: true })
    password: string;
}