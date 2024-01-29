import { ApiProperty } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @ApiProperty({ required: true })
    name: string;

    @IsString()
    @ApiProperty({ required: true })
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    price: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: 1 })
    quantity: number;

    @IsOptional()
    @ApiProperty({ required: false, default: ProductStatus.ACTIVE })
    status: ProductStatus;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: false, default: 1.0 })
    rating: number;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ApiProperty({ required: true })
    images: [string];

    @IsString()
    @ApiProperty({ required: true })
    storeId: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ApiProperty({ required: true })
    categories: [string];
}
