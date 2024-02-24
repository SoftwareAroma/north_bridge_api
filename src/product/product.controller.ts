import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CustomApiResponse } from '@shared/utils';
import {
    ProductCategory as ProductCategoryModel,
    Product as ProductModel
} from '@prisma/client';
import { CreateProductCategoryDto, CreateProductDto } from './dto/create.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckPolicies, JwtAuthGuard, PoliciesGuard } from '@shared';
import {
    CreateProductCategoryPolicyHandler,
    CreateProductPolicyHandler,
    DeleteProductPolicyHandler,
    UpdateProductCategoryPolicyHandler,
    UpdateProductPolicyHandler
} from '@shared/casl/handler/policy.handler';
import {
    ProductCategoriesResponse,
    ProductCategoryResponse,
    ProductResponse,
    ProductsResponse
} from './dto/response.dto';
import { StringResponse } from '@app/response/response.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerLimits, multerStorage } from './multer/multier.service';
import { UpdateProductDto } from './dto/update.dto';
import Express from 'express';

@ApiTags('Products Endpoints')
@Controller({ path: 'product', version: '1' })
export class ProductController {
    constructor(
        private productService: ProductService,
    ) { }

    /// ---------------------------------------- ///
    /// --------------- PRODUCT ---------------- ///
    /// ---------------------------------------- ///

    @CheckPolicies(new CreateProductPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Post('create')
    @UseInterceptors(FilesInterceptor('files', 4, {
        limits: multerLimits,
        storage: multerStorage,
    }))
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Product created successfully',
        type: ProductResponse,
    })
    async createProduct(
        @Body() data: CreateProductDto,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ): Promise<CustomApiResponse<{ product: ProductModel }>> {
        // console.log(data);
        // console.log(files);
        const product: ProductModel = await this.productService.createProduct(data, files);
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
        const products: Array<ProductModel> = await this.productService.getProducts();
        return new CustomApiResponse<{ products: Array<ProductModel> }>({
            data: { products: products },
            message: 'Products retrieved successfully',
            success: true,
        });
    }

    @Get('product/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product fetched successfully',
        type: ProductResponse,
    })
    async getProduct(
        @Param('id') id: string,
    ): Promise<CustomApiResponse<{ product: ProductModel }>> {
        const product: ProductModel = await this.productService.getProduct(id);
        return new CustomApiResponse<{ product: ProductModel }>({
            data: { product: product },
            message: 'Product retrieved successfully',
            success: true,
        });
    }

    @CheckPolicies(new UpdateProductCategoryPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Patch('product/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product updated successfully',
        type: ProductResponse,
    })
    async updateProduct(
        @Param('id') id: string,
        @Body() data: UpdateProductDto,
    ): Promise<CustomApiResponse<{ product: ProductModel }>> {
        const product: ProductModel = await this.productService.updateProduct(id, data);
        return new CustomApiResponse<{ product: ProductModel }>({
            data: { product: product },
            message: 'Product updated successfully',
            success: true,
        });
    }

    @CheckPolicies(new DeleteProductPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Delete('product/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product deleted successfully',
        type: StringResponse,
    })
    async deleteProduct(
        @Param('id') id: string,
    ): Promise<CustomApiResponse<{ product: string }>> {
        const product: string = await this.productService.deleteProduct(id);
        return new CustomApiResponse<{ product: string }>({
            data: { product: product },
            message: 'Product deleted successfully',
            success: true,
        });
    }


    /**
     * Add a category to a product
     * @param id id of product to add category to
     * @param categoryId category id to add
     * @returns CustomApiResponse<{ product: ProductModel }>()
     */
    @CheckPolicies(new UpdateProductPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Patch('add-category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store updated successfully',
        type: ProductResponse,
    })
    async addCategory(
        @Param('id') id: string,
        @Body() categoryId: string,
    ): Promise<CustomApiResponse<{ product: ProductModel }>> {
        const _product: ProductModel = await this.productService.addProductCategory(id, categoryId);
        return new CustomApiResponse<{ product: ProductModel }>({
            data: { product: _product },
            message: 'Product updated successfully',
            success: true,
        });
    }

    /**
     * 
     * @param id id of product to remove category from
     * @param categoryId category id to remove
     * @returns CustomApiResponse<{ product: ProductModel }>()
     */
    @CheckPolicies(new UpdateProductPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Patch('remove-category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store updated successfully',
        type: ProductResponse,
    })
    async removeCategory(
        @Param('id') id: string,
        @Body() categoryId: string,
    ): Promise<CustomApiResponse<{ product: ProductModel }>> {
        const _product: ProductModel = await this.productService.removeProductCategory(id, categoryId);
        return new CustomApiResponse<{ product: ProductModel }>({
            data: { product: _product },
            message: 'Product updated successfully',
            success: true,
        });
    }


    /// ---------------------------------------- ///
    /// --------------- CATEGORY --------------- ///
    /// ---------------------------------------- ///

    @CheckPolicies(new CreateProductCategoryPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Post('create-category')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product deleted successfully',
        type: ProductCategoryResponse,
    })
    async createProductCategory(
        @Body() data: CreateProductCategoryDto,
    ): Promise<CustomApiResponse<{ productCategory: ProductCategoryModel }>> {
        const product: ProductCategoryModel = await this.productService.createProductCategory(data);
        return new CustomApiResponse<{ productCategory: ProductCategoryModel }>({
            data: { productCategory: product },
            message: 'Product created successfully',
            success: true,
        });
    }

    @Get('categories')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product categories fetched successfully',
        type: ProductCategoriesResponse,
    })
    async getProductCategories(): Promise<CustomApiResponse<{ productCategories: Array<ProductCategoryModel> }>> {
        const productCategories: Array<ProductCategoryModel> = await this.productService.getProductCategories();
        return new CustomApiResponse<{ productCategories: Array<ProductCategoryModel> }>({
            data: { productCategories: productCategories },
            message: 'Product categories retrieved successfully',
            success: true,
        });
    }

    @Get('category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product category fetched successfully',
        type: ProductCategoryResponse,
    })
    async getProductCategory(
        @Param('id') id: string,
    ): Promise<CustomApiResponse<{ productCategory: ProductCategoryModel }>> {
        const productCategory: ProductCategoryModel = await this.productService.getProductCategory(id);
        return new CustomApiResponse<{ productCategory: ProductCategoryModel }>({
            data: { productCategory: productCategory },
            message: 'Product category retrieved successfully',
            success: true,
        });
    }

    @CheckPolicies(new UpdateProductCategoryPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Patch('category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product category updated successfully',
        type: ProductCategoryResponse,
    })
    async updateProductCategory(
        @Param('id') id: string,
        @Body() data: CreateProductCategoryDto,
    ): Promise<CustomApiResponse<{ productCategory: ProductCategoryModel }>> {
        const productCategory: ProductCategoryModel = await this.productService.updateProductCategory(id, data);
        return new CustomApiResponse<{ productCategory: ProductCategoryModel }>({
            data: { productCategory: productCategory },
            message: 'Product category updated successfully',
            success: true,
        });
    }

    @CheckPolicies(new DeleteProductPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Delete('category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product category deleted successfully',
        type: StringResponse,
    })
    async deleteProductCategory(
        @Param('id') id: string,
    ): Promise<CustomApiResponse<{ productCategory: string }>> {
        const productCategory: string = await this.productService.deleteProductCategory(id);
        return new CustomApiResponse<{ productCategory: string }>({
            data: { productCategory: productCategory },
            message: 'Product category deleted successfully',
            success: true,
        });
    }

}
