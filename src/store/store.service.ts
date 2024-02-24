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
        try {
            return this.prismaService.store.create({
                data: {
                    ...createStoreDto,
                    categories: {
                        connect: createStoreDto.categories?.map((storeCategoryId: string): { id: string } => {
                            return {
                                id: storeCategoryId,
                            };
                        }),
                    },
                },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a store by id
     * @param id store id to get
     * @returns [Store] object
     */
    async getStore(id: string): Promise<StoreModel> {
        try {
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all available stores
     * @returns [Store] objects
     */
    async getStores(): Promise<Array<StoreModel>> {
        try {
            return this.prismaService.store.findMany({
                include: {
                    products: true,
                    categories: true,
                },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a Store
     * @param id id of the store to update
     * @param updateStoreDto
     * @returns [Store] object
     */
    async updateStore(id: string, updateStoreDto: UpdateStoreDto): Promise<StoreModel> {
        try {
            return this.prismaService.store.update({
                where: {
                    id: id,
                },
                data: {
                    ...updateStoreDto,
                    categories: {
                        connect: updateStoreDto.categories?.map((storeCategoryId: string): { id: string } => {
                            return {
                                id: storeCategoryId,
                            };
                        }),
                    },
                },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 
     * @param id id of the store to delete
     * @returns 
     */
    async deleteStore(id: string): Promise<string> {
        try {
            const resp: StoreModel = await this.prismaService.store.delete({
                where: {
                    id: id,
                },
            });
            return resp.id;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Add a store category to a store
     * @param storeId store id to add category to
     * @param storeCategoryId the category id to add
     * @returns [StoreModel]
     */
    async addStoreCategory(storeId: string, storeCategoryId: string): Promise<StoreModel> {
        try {
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a store category from a store
     * @param storeId store id to remove category from
     * @param storeCategoryId store category id to remove
     * @returns [StoreModel]
     */
    async removeStoreCategory(storeId: string, storeCategoryId: string): Promise<StoreModel> {
        try {
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * add product to store
     * @param storeId store id to add product to
     * @param productId product id to add
     * @returns [StoreModel]
     */
    async addProductToStore(storeId: string, productId: string): Promise<StoreModel> {
        try {
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * remove product from store
     * @param storeId store id to remove product from
     * @param productId product id to remove
     * @returns [StoreModel]
     */
    async removeProductFromStore(storeId: string, productId: string): Promise<StoreModel> {
        try {
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    ///-----------------------------------------------------
    ///------------------ Store Category -------------------
    ///-----------------------------------------------------
    ///-----------------------------------------------------

    async createStoreCategory(createStoreCategoryDto: CreateStoreCategoryDto): Promise<StoreCategoryModel> {
        try {// make the name lower case
            createStoreCategoryDto.name = createStoreCategoryDto.name.toLowerCase();
            // if the category already exists, throw an error
            const _category: StoreCategoryModel = await this.prismaService.storeCategory.findUnique({
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
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getStoreCategory(id: string): Promise<StoreCategoryModel> {
        try {
            return this.prismaService.storeCategory.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getStoreCategories(): Promise<Array<StoreCategoryModel>> {
        try {
            return this.prismaService.storeCategory.findMany();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStoreCategory(id: string, updateStoreCategoryDto: UpdateStoreCategoryDto): Promise<StoreCategoryModel> {
        try {
            return this.prismaService.storeCategory.update({
                where: {
                    id: id,
                },
                data: updateStoreCategoryDto,
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteStoreCategory(id: string): Promise<string> {
        try {
            const _category: StoreCategoryModel = await this.prismaService.storeCategory.delete({
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
