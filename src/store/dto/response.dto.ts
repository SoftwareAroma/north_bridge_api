import { ApiProperty } from "@nestjs/swagger";
import { ProductObject } from "@product/dto/response.dto";
import { VendorResponseObject } from "@vendor/dto/response.dto";

export class StoreCategoryObject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    storeId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

class StoreCategoryDataRes {
    @ApiProperty({ type: StoreCategoryObject })
    storeCategory: StoreCategoryObject;
}

export class StoreCategoryResponse {
    @ApiProperty()
    data: StoreCategoryDataRes;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

class StoreCategoriesDataRes2 {
    @ApiProperty({ type: [StoreCategoryDataRes] })
    storeCategories: [StoreCategoryDataRes];
}

export class StoreCategoriesResponse {
    @ApiProperty()
    data: StoreCategoriesDataRes2;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}


// Response Objects
export class StoreResponseObject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    about: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    categories: [StoreCategoryObject];

    @ApiProperty()
    products: [ProductObject];

    @ApiProperty()
    vendor: VendorResponseObject;

    @ApiProperty()
    vendorId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

class DataRes {
    @ApiProperty({ type: StoreResponseObject })
    store: StoreResponseObject;
}


export class StoreResponse {
    @ApiProperty()
    data: DataRes;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

class DataRes2 {
    @ApiProperty({ type: [StoreResponseObject] })
    stores: [StoreResponseObject];
}

export class StoresResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: DataRes2;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}
