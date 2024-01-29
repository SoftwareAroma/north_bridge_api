import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateProductDto } from './dto/create.dto';
import { Product as ProductModel } from '@prisma/client';

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
    async createProduct(data: CreateProductDto): Promise<ProductModel> {
        return await this.prismaService.product.create({
            data: {
                ...data,
                categories: {
                    connect: data.categories.map((category) => ({ id: category })),
                },
            },
        });
    }

    /**
     * Get all products
     * @returns Array<ProductModel>
     */
    async getProducts(): Promise<Array<ProductModel>> {
        return await this.prismaService.product.findMany({
            include: {
                categories: true,
                store: true,
            },
        });
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
            },
        });
    }

    /**
     * Update a product
     * @param id id of product to update
     * @param data [CreateProductDto]
     * @returns [ProductModel]
     */
    async updateProduct(id: string, data: CreateProductDto): Promise<ProductModel> {
        return await this.prismaService.product.update({
            where: {
                id: id,
            },
            data: {
                ...data,
                categories: {
                    connect: data.categories.map((category) => ({ id: category })),
                },
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
}
