import { ApiProperty } from "@nestjs/swagger";
import { Cart, Role } from "@prisma/client";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;

    @IsString()
    @IsNotEmpty()
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