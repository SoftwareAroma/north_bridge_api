import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateProductCategoryDto, CreateProductDto } from './dto/create.dto';
import { ProductCategory as ProductCategoryModel, Product as ProductModel } from '@prisma/client';
import { Express } from 'express';
import { UpdateProductDto } from './dto/update.dto';
import { UpdateStoreCategoryDto } from '@store/dto/update.dto';
import { UPLOADS_DIR } from '@shared/environment';

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

        try {
            // if files is not empty, upload the file buffer to postgres
            let _imageList: Array<string> = [];
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
                    // add the id to the _imageList
                    _imageList.push(_file.id);
                }
            }

            return await this.prismaService.product.create({
                data: {
                    ...data,
                    images: {
                        connect: _imageList?.map((image) => ({ id: image })),
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all products
     * @returns Array<ProductModel>
     */
    async getProducts(): Promise<Array<ProductModel>> {
        try {
            const _products = await this.prismaService.product.findMany({
                include: {
                    categories: true,
                    store: true,
                    images: true,
                },
            });

            // get the full file path for each image from the uploads folder
            const _ = _products.map((product) => {
                product.images = product.images.map((image) => {
                    image.path = `${UPLOADS_DIR}/products/${image.path}`;
                    return image;
                });
                return product;
            });

            return _products;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a product
     * @param id id of product
     * @returns [ProductModel]
     */
    async getProduct(id: string): Promise<ProductModel> {
        try {
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

        try {// if files is not empty, upload the file buffer to postgres
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a product
     * @param id id of product to delete
     * @returns [string]
     */
    async deleteProduct(id: string): Promise<string> {
        try {
            const _product = await this.prismaService.product.delete({
                where: {
                    id: id,
                },
            });
            return _product.id;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Add a product category to a product
     * @param productId product id to add category to
     * @param productCategoryId the category id to add
     * @returns [ProductModel]
     */
    async addProductCategory(productId: string, productCategoryId: string): Promise<ProductModel> {
        try {
            return this.prismaService.product.update({
                where: {
                    id: productId,
                },
                data: {
                    categories: {
                        connect: {
                            id: productCategoryId,
                        },
                    },
                },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a product category from a product
     * @param productId product id to remove category from
     * @param storeCategoryId store category id to remove
     * @returns [ProductModel]
     */
    async removeProductCategory(productId: string, productCategoryId: string): Promise<ProductModel> {
        try {
            return this.prismaService.product.update({
                where: {
                    id: productId,
                },
                data: {
                    categories: {
                        disconnect: {
                            id: productCategoryId,
                        },
                    },
                },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Create a product category
     * @param data [CreateStoreCategoryDto]
     * @returns ProductCategoryModel object
     */
    async createProductCategory(data: CreateProductCategoryDto): Promise<ProductCategoryModel> {
        try {// make the name lower case
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all product categories
     * @returns Array<ProductCategory>
     */
    async getProductCategories(): Promise<Array<ProductCategoryModel>> {
        try {
            return await this.prismaService.productCategory.findMany();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a store category
     * @param id id of store category
     * @returns ProductCategoryModel object
     */
    async getProductCategory(id: string): Promise<ProductCategoryModel> {
        try {
            return await this.prismaService.productCategory.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a store category
     * @param id id of product category to update
     * @param data [UpdateStoreCategoryDto]
     * @returns ProductCategoryModel object
     */
    async updateProductCategory(id: string, data: UpdateStoreCategoryDto): Promise<ProductCategoryModel> {
        try {
            return await this.prismaService.productCategory.update({
                where: {
                    id: id,
                },
                data: data,
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a product category
     * @param id id of product category to delete
     * @returns [string]
     */
    async deleteProductCategory(id: string): Promise<string> {
        try {
            const _category = await this.prismaService.productCategory.delete({
                where: {
                    id: id,
                },
            });
            return _category.id;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
