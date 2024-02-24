import { ApiProperty } from "@nestjs/swagger";
import { Cart, Role } from "@prisma/client";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;

    @IsString()
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

    @IsString()
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
    @ApiProperty({ default: Role.USER, required: false })
    role: Role;
}

export class CreateCartDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    price: number;
}