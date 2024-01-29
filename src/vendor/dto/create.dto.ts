import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword
} from "class-validator";

export class CreateVendorDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({ required: true })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    userName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    lastName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    otherName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    phone: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ default: true, required: false })
    isActive: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ default: false, required: false })
    isEmailVerified: boolean;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    salt: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ required: false, default: Role.VENDOR })
    role: Role;
}

