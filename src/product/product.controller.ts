import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiResponse } from '@shared/utils';
import { Product as ProductModel } from '@prisma/client';
import { CreateProductDto } from './dto/create.dto';

@Controller({ path: 'product', version: '1' })
export class ProductController {
    constructor(
        private productService: ProductService,
    ) { }

    @Post('create')
    async createProduct(
        @Body() data: CreateProductDto,
    ): Promise<ApiResponse<{ product: ProductModel }>> {
        const product = await this.productService.createProduct(data);
        return new ApiResponse<{ product: ProductModel }>({
            data: { product: product },
            message: 'Product created successfully',
            success: true,
        });
    }

    @Get('products')
    async getProducts(): Promise<ApiResponse<{ products: Array<ProductModel> }>> {
        const products = await this.productService.getProducts();
        return new ApiResponse<{ products: Array<ProductModel> }>({
            data: { products: products },
            message: 'Products retrieved successfully',
            success: true,
        });
    }

    @Get(':id')
    async getProduct(
        @Body() id: string,
    ): Promise<ApiResponse<{ product: ProductModel }>> {
        const product = await this.productService.getProduct(id);
        return new ApiResponse<{ product: ProductModel }>({
            data: { product: product },
            message: 'Product retrieved successfully',
            success: true,
        });
    }

    @Patch(':id')
    async updateProduct(
        @Body() id: string,
        @Body() data: CreateProductDto,
    ): Promise<ApiResponse<{ product: ProductModel }>> {
        const product = await this.productService.updateProduct(id, data);
        return new ApiResponse<{ product: ProductModel }>({
            data: { product: product },
            message: 'Product updated successfully',
            success: true,
        });
    }

    @Delete(':id')
    async deleteProduct(
        @Body() id: string,
    ): Promise<ApiResponse<{ product: string }>> {
        const product = await this.productService.deleteProduct(id);
        return new ApiResponse<{ product: string }>({
            data: { product: product },
            message: 'Product deleted successfully',
            success: true,
        });
    }

}
