import { Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CustomApiResponse } from '@shared/utils';
import { Product as ProductModel } from '@prisma/client';
import { CreateProductDto } from './dto/create.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller({ path: 'product', version: '1' })
export class ProductController {
    constructor(
        private productService: ProductService,
    ) { }

    @Post('create')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Product created successfully',
        type: CustomApiResponse,
    })
    async createProduct(
        @Body() data: CreateProductDto,
    ): Promise<CustomApiResponse<{ product: ProductModel }>> {
        const product = await this.productService.createProduct(data);
        return new CustomApiResponse<{ product: ProductModel }>({
            data: { product: product },
            message: 'Product created successfully',
            success: true,
        });
    }

    @Get('products')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Products fetched successfully',
        type: CustomApiResponse,
    })
    async getProducts(): Promise<CustomApiResponse<{ products: Array<ProductModel> }>> {
        const products = await this.productService.getProducts();
        return new CustomApiResponse<{ products: Array<ProductModel> }>({
            data: { products: products },
            message: 'Products retrieved successfully',
            success: true,
        });
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product fetched successfully',
        type: CustomApiResponse,
    })
    async getProduct(
        @Body() id: string,
    ): Promise<CustomApiResponse<{ product: ProductModel }>> {
        const product = await this.productService.getProduct(id);
        return new CustomApiResponse<{ product: ProductModel }>({
            data: { product: product },
            message: 'Product retrieved successfully',
            success: true,
        });
    }

    @Patch(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product updated successfully',
        type: CustomApiResponse,
    })
    async updateProduct(
        @Body() id: string,
        @Body() data: CreateProductDto,
    ): Promise<CustomApiResponse<{ product: ProductModel }>> {
        const product = await this.productService.updateProduct(id, data);
        return new CustomApiResponse<{ product: ProductModel }>({
            data: { product: product },
            message: 'Product updated successfully',
            success: true,
        });
    }

    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product deleted successfully',
        type: CustomApiResponse,
    })
    async deleteProduct(
        @Body() id: string,
    ): Promise<CustomApiResponse<{ product: string }>> {
        const product = await this.productService.deleteProduct(id);
        return new CustomApiResponse<{ product: string }>({
            data: { product: product },
            message: 'Product deleted successfully',
            success: true,
        });
    }

}
