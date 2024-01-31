import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CustomApiResponse } from '@shared/utils';
import { Product as ProductModel } from '@prisma/client';
import { CreateProductDto } from './dto/create.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckPolicies, JwtAuthGuard, PoliciesGuard } from '@shared';
import { CreateProductPolicyHandler, DeleteProductPolicyHandler, UpdateProductCategoryPolicyHandler } from '@shared/casl/handler/policy.handler';
import { ProductResponse, ProductsResponse } from './dto/response.dto';
import { StringResponse } from '@app/response/response.dto';

@ApiTags('Product')
@Controller({ path: 'product', version: '1' })
export class ProductController {
    constructor(
        private productService: ProductService,
    ) { }

    @CheckPolicies(new CreateProductPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Post('create')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Product created successfully',
        type: ProductResponse,
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
        type: ProductsResponse,
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
        type: ProductResponse,
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

    @CheckPolicies(new UpdateProductCategoryPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Patch(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product updated successfully',
        type: ProductResponse,
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

    @CheckPolicies(new DeleteProductPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product deleted successfully',
        type: StringResponse,
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
