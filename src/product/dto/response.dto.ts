import { ApiProperty } from "@nestjs/swagger";
import { StoreResponseObject } from "@store/dto/response.dto";

class ProductCategoryObject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

class ProductCategoryDataRes {
    @ApiProperty({ type: ProductCategoryObject })
    productCategory: ProductCategoryObject;
}

class ProductCategoryDataRes2 {
    @ApiProperty({ type: [ProductCategoryObject] })
    productCategories: [ProductCategoryObject];
}


export class ProductCategoryResponse {
    @ApiProperty()
    data: ProductCategoryDataRes;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

export class ProductCategoriesResponse {
    @ApiProperty()
    data: ProductCategoryDataRes2;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

// store
export class ProductObject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    rating: number;

    @ApiProperty()
    images: string[];

    @ApiProperty()
    status: string;

    @ApiProperty()
    storeId: string;

    @ApiProperty()
    store: StoreResponseObject;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}


class ProductDataRes {
    @ApiProperty({ type: ProductObject })
    product: ProductObject;
}

class ProductDataRes2 {
    @ApiProperty({ type: [ProductObject] })
    products: [ProductObject];
}


export class ProductResponse {
    @ApiProperty()
    data: ProductDataRes;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

export class ProductsResponse {
    @ApiProperty()
    data: ProductDataRes2;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}