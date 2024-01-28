import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateStoreDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    about: string;

    @IsString()
    @ApiProperty()
    phone: string;

    @IsString()
    @ApiProperty()
    address: string;

    @IsString()
    @ApiProperty()
    location: string;

    @IsString()
    @ApiProperty()
    storeCategory: [string];

    @IsString()
    @ApiProperty()
    product: string;

    @IsString()
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
