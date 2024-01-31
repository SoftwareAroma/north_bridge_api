import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateProductCategoryDto, CreateProductDto } from './dto/create.dto';
import { ProductCategory as ProductCategoryModel, Product as ProductModel } from '@prisma/client';
import { Express } from 'express';
import { UpdateProductDto } from './dto/update.dto';
import { UpdateStoreCategoryDto } from '@store/dto/update.dto';

@Injectable()
export class ProductService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    /**
     * Create a new product
     * @param data [CreateProductDto]
     * @returns ProductModel
     */
    async createProduct(data: CreateProductDto, images?: Array<Express.Multer.File>): Promise<ProductModel> {

        // if files is not empty, upload the file buffer to postgres
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const file = images[i];
                const _file = await this.prismaService.file.create({
                    data: {
                        name: file.filename,
                        size: file.size,
                        type: file.mimetype,
                        path: file.path,
                    },
                });
                data.images.push(_file.id);
            }
        }

        return await this.prismaService.product.create({
            data: {
                ...data,
                images: {
                    connect: data.images?.map((image) => ({ id: image })),
                },
                categories: {
                    connect: data.categories?.map((category) => ({ id: category })),
                },
            },
            include: {
                categories: true,
                store: true,
                images: true,
            },
        });
    }

    /**
     * Get all products
     * @returns Array<ProductModel>
     */
    async getProducts(): Promise<Array<ProductModel>> {
        const _products = await this.prismaService.product.findMany({
            include: {
                categories: true,
                store: true,
                images: true,
            },
        });

        // get the full file path for each image from the uploads folder
        // const products = _products.map((product) => {
        //     product.images = product.images.map((image) => {
        //         image.path = `${process.env.APP_URL}/uploads/${image.path}`;
        //         return image;
        //     });
        //     return product;
        // });

        return _products;
    }

    /**
     * Get a product
     * @param id id of product
     * @returns [ProductModel]
     */
    async getProduct(id: string): Promise<ProductModel> {
        return await this.prismaService.product.findUnique({
            where: {
                id: id,
            },
            include: {
                categories: true,
                store: true,
                images: true,
            },
        });
    }

    /**
     * Update a product
     * @param id id of product to update
     * @param data [CreateProductDto]
     * @returns [ProductModel]
     */
    async updateProduct(
        id: string, data: UpdateProductDto,
        images?: Array<Express.Multer.File>
    ): Promise<ProductModel> {

        // if files is not empty, upload the file buffer to postgres
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const file = images[i];
                const _file = await this.prismaService.file.create({
                    data: {
                        name: file.filename,
                        size: file.size,
                        type: file.mimetype,
                        path: file.path,
                    },
                });
                data.images.push(_file.id);
            }
        }
        return await this.prismaService.product.update({
            where: {
                id: id,
            },
            data: {
                ...data,
                images: {
                    connect: data.images?.map((image) => ({ id: image })),
                },
                categories: {
                    connect: data.categories?.map((category) => ({ id: category })),
                },
            },
            include: {
                categories: true,
                store: true,
                images: true,
            },
        });
    }

    /**
     * Delete a product
     * @param id id of product to delete
     * @returns [string]
     */
    async deleteProduct(id: string): Promise<string> {
        const _product = await this.prismaService.product.delete({
            where: {
                id: id,
            },
        });
        return _product.id;
    }

    /**
     * Create a product category
     * @param data [CreateStoreCategoryDto]
     * @returns ProductCategoryModel object
     */
    async createProductCategory(data: CreateProductCategoryDto): Promise<ProductCategoryModel> {
        // make the name lower case
        data.name = data.name.toLowerCase();
        // check if the category already exists
        const _category = await this.prismaService.productCategory.findUnique({
            where: {
                name: data.name,
            },
        });
        if (_category) {
            throw new HttpException('Product Category already Exist', HttpStatus.CONFLICT);
        }
        return await this.prismaService.productCategory.create({
            data: data,
        });
    }

    /**
     * Get all product categories
     * @returns Array<ProductCategory>
     */
    async getProductCategories(): Promise<Array<ProductCategoryModel>> {
        return await this.prismaService.productCategory.findMany();
    }

    /**
     * Get a store category
     * @param id id of store category
     * @returns ProductCategoryModel object
     */
    async getProductCategory(id: string): Promise<ProductCategoryModel> {
        return await this.prismaService.productCategory.findUnique({
            where: {
                id: id,
            },
        });
    }

    /**
     * Update a store category
     * @param id id of product category to update
     * @param data [UpdateStoreCategoryDto]
     * @returns ProductCategoryModel object
     */
    async updateProductCategory(id: string, data: UpdateStoreCategoryDto): Promise<ProductCategoryModel> {
        return await this.prismaService.productCategory.update({
            where: {
                id: id,
            },
            data: data,
        });
    }

    /**
     * Delete a product category
     * @param id id of product category to delete
     * @returns [string]
     */
    async deleteProductCategory(id: string): Promise<string> {
        const _category = await this.prismaService.productCategory.delete({
            where: {
                id: id,
            },
        });
        return _category.id;
    }
}
