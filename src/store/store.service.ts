import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateStoreCategoryDto, CreateStoreDto } from './dto/create.dto';
import { UpdateStoreCategoryDto, UpdateStoreDto } from './dto/update.dto';
import { StoreCategory as StoreCategoryModel, Store as StoreModel } from '@prisma/client';

@Injectable()
export class StoreService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    /**
     * Create a new store (for a vendor)
     * @returns [Store] object
     * @param createStoreDto
     */
    async createStore(createStoreDto: CreateStoreDto): Promise<StoreModel> {
        return this.prismaService.store.create({
            data: {
                ...createStoreDto,
                categories: {
                    connect: createStoreDto.categories?.map((storeCategoryId:string): {id:string} => {
                        return {
                            id: storeCategoryId,
                        };
                    }),
                },
            },
        });
    }

    /**
     * Get a store by id
     * @param id store id to get
     * @returns [Store] object
     */
    async getStore(id: string): Promise<StoreModel> {
        if (!id) {
            throw new Error('Store id is required');
        }
        return this.prismaService.store.findUnique({
            where: {
                id: id,
            },
            include: {
                products: true,
                categories: true,
            },
        });
    }

    /**
     * Get all available stores
     * @returns [Store] objects
     */
    async getStores(): Promise<Array<StoreModel>> {
        return this.prismaService.store.findMany({
            include: {
                products: true,
                categories: true,
            },
        });
    }

    /**
     * Update a Store
     * @param id id of the store to update
     * @param updateStoreDto
     * @returns [Store] object
     */
    async updateStore(id: string, updateStoreDto: UpdateStoreDto): Promise<StoreModel> {
        return this.prismaService.store.update({
            where: {
                id: id,
            },
            data: {
                ...updateStoreDto,
                categories: {
                    connect: updateStoreDto.categories?.map((storeCategoryId:string): {id:string} => {
                        return {
                            id: storeCategoryId,
                        };
                    }),
                },
            },
        });
    }

    /**
     * 
     * @param id id of the store to delete
     * @returns 
     */
    async deleteStore(id: string): Promise<string> {
        const resp:StoreModel = await this.prismaService.store.delete({
            where: {
                id: id,
            },
        });
        return resp.id;
    }

    /**
     * Add a store category to a store
     * @param storeId store id to add category to
     * @param storeCategoryId the category id to add
     * @returns [StoreModel]
     */
    async addStoreCategory(storeId: string, storeCategoryId: string): Promise<StoreModel> {
        return this.prismaService.store.update({
            where: {
                id: storeId,
            },
            data: {
                categories: {
                    connect: {
                        id: storeCategoryId,
                    },
                },
            },
        });
    }

    /**
     * Remove a store category from a store
     * @param storeId store id to remove category from
     * @param storeCategoryId store category id to remove
     * @returns [StoreModel]
     */
    async removeStoreCategory(storeId: string, storeCategoryId: string): Promise<StoreModel> {
        return this.prismaService.store.update({
            where: {
                id: storeId,
            },
            data: {
                categories: {
                    disconnect: {
                        id: storeCategoryId,
                    },
                },
            },
        });
    }

    /**
     * add product to store
     * @param storeId store id to add product to
     * @param productId product id to add
     * @returns [StoreModel]
     */
    async addProductToStore(storeId: string, productId: string): Promise<StoreModel> {
        return this.prismaService.store.update({
            where: {
                id: storeId,
            },
            data: {
                products: {
                    connect: {
                        id: productId,
                    },
                },
            },
        });
    }

    /**
     * remove product from store
     * @param storeId store id to remove product from
     * @param productId product id to remove
     * @returns [StoreModel]
     */
    async removeProductFromStore(storeId: string, productId: string): Promise<StoreModel> {
        return this.prismaService.store.update({
            where: {
                id: storeId,
            },
            data: {
                products: {
                    disconnect: {
                        id: productId,
                    },
                },
            },
        });
    }


    ///-----------------------------------------------------
    ///------------------ Store Category -------------------
    ///-----------------------------------------------------
    ///-----------------------------------------------------

    async createStoreCategory(createStoreCategoryDto: CreateStoreCategoryDto): Promise<StoreCategoryModel> {
        // make the name lower case
        createStoreCategoryDto.name = createStoreCategoryDto.name.toLowerCase();
        // if the category already exists, throw an error
        const _category:StoreCategoryModel = await this.prismaService.storeCategory.findUnique({
            where: {
                name: createStoreCategoryDto.name,
            },
        });
        if (_category) {
            throw new HttpException('Store Category already Exist', HttpStatus.CONFLICT);
        }
        return this.prismaService.storeCategory.create({
            data: createStoreCategoryDto,
        });
    }

    async getStoreCategory(id: string): Promise<StoreCategoryModel> {
        return this.prismaService.storeCategory.findUnique({
            where: {
                id: id,
            },
        });
    }

    async getStoreCategories(): Promise<Array<StoreCategoryModel>> {
        return this.prismaService.storeCategory.findMany();
    }

    async updateStoreCategory(id: string, updateStoreCategoryDto: UpdateStoreCategoryDto): Promise<StoreCategoryModel> {
        return this.prismaService.storeCategory.update({
            where: {
                id: id,
            },
            data: updateStoreCategoryDto,
        });
    }

    async deleteStoreCategory(id: string): Promise<string> {
        const _category:StoreCategoryModel = await this.prismaService.storeCategory.delete({
            where: {
                id: id,
            },
        });
        return _category.id;
    }
}
