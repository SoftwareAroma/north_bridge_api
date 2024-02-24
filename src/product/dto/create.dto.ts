import { ApiProperty } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @ApiProperty({ required: true })
    name: string;

    @IsString()
    @ApiProperty({ required: true })
    description: string;


    @IsObject()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: { amount: "0.0", currency: "GHS" } })
    price: {
        "amount": string,
        "currency": string,
    };

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: 1 })
    quantity: string;

    @IsOptional()
    @ApiProperty({ required: false, default: ProductStatus.ACTIVE })
    status: ProductStatus;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ required: false, default: 1.0 })
    rating: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ApiProperty({ required: false, default: [] })
    images: string[];

    @IsString()
    @ApiProperty({ required: true })
    storeId: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ApiProperty({ required: true })
    categories: string[];
}


export class CreateProductCategoryDto {
    @IsString()
    @ApiProperty({ required: true })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    description: string;
}