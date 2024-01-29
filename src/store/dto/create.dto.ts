import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateStoreDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    about: string;

    @IsPhoneNumber()
    @ApiProperty()
    phone: string;

    @IsString()
    @ApiProperty()
    address: string;

    @IsString()
    @ApiProperty()
    location: string;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    storeCategories: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    vendorId: string;

}

export class CreateStoreCategoryDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @ApiProperty()
    storeId: string;

}
