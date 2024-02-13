import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsStrongPassword
} from "class-validator";

export class CreateAdminDto {
    @IsEmail()
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
    @IsOptional()
    @ApiProperty({ required: false })
    firstName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    lastName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    otherName: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    phone: string;

    @IsString()
    @IsOptional()
    salt: string;

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
    @ApiProperty({ default: Role.ADMIN, required: false })
    role: Role;
}
