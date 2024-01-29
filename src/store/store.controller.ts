import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreCategory as StoreCategoryModel, Store as StoreModel } from '@prisma/client';
import { CreateStoreCategoryDto, CreateStoreDto } from './dto/create.dto';
import { ApiResponse } from '@shared/utils';
import { UpdateStoreCategoryDto, UpdateStoreDto } from './dto/update.dto';

@Controller({ path: 'store', version: '1' })
export class StoreController {
    constructor(
        private readonly storeService: StoreService,
    ) { }

    /**
     * Create a new store
     * @param data [CreateStoreDto]
     * @returns ApiResponse<{ store: StoreModel }>()
     */
    @Post('create')
    async createStore(
        @Body() data: CreateStoreDto,
    ): Promise<ApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.createStore(data);
        return new ApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store created successfully',
            success: true,
        });
    }

    /**
     * Create a new store category
     * @param data [CreateStoreCategoryDto]
     * @returns ApiResponse<{ storeCategory: StoreCategoryModel }>()
     */
    @Post('create-category')
    async createStoreCategory(
        @Body() data: CreateStoreCategoryDto,
    ): Promise<ApiResponse<{ storeCategory: StoreCategoryModel }>> {
        const _storeCategory = await this.storeService.createStoreCategory(data);
        return new ApiResponse<{ storeCategory: StoreCategoryModel }>({
            data: { storeCategory: _storeCategory },
            message: 'Store category created successfully',
            success: true,
        });
    }

    /**
     * Get all stores
     * @returns ApiResponse<{ stores: StoreModel[] }>()
     */
    @Get('stores')
    async getStores(): Promise<ApiResponse<{ stores: StoreModel[] }>> {
        const _stores = await this.storeService.getStores();
        return new ApiResponse<{ stores: StoreModel[] }>({
            data: { stores: _stores },
            message: 'Stores fetched successfully',
            success: true,
        });
    }

    /**
     * Get all store categories
     * @returns ApiResponse<{ storeCategories: StoreCategoryModel[] }>()
     */
    @Get('categories')
    async getStoreCategories(): Promise<ApiResponse<{ storeCategories: StoreCategoryModel[] }>> {
        const _storeCategories = await this.storeService.getStoreCategories();
        return new ApiResponse<{ storeCategories: StoreCategoryModel[] }>({
            data: { storeCategories: _storeCategories },
            message: 'Store categories fetched successfully',
            success: true,
        });
    }

    /**
     * Get a store
     * @param id id of store to get
     * @returns ApiResponse<{ store: StoreModel }>()
     */
    @Get(':id')
    async getStore(id: string): Promise<ApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.getStore(id);
        return new ApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store fetched successfully',
            success: true,
        });
    }

    /**
     * Get a store category
     * @param id id of store category to get
     * @returns ApiResponse<{ storeCategory: StoreCategoryModel }>()
     */
    @Get('category/:id')
    async getStoreCategory(id: string): Promise<ApiResponse<{ storeCategory: StoreCategoryModel }>> {
        const _storeCategory = await this.storeService.getStoreCategory(id);
        return new ApiResponse<{ storeCategory: StoreCategoryModel }>({
            data: { storeCategory: _storeCategory },
            message: 'Store category fetched successfully',
            success: true,
        });
    }

    /**
     * Update a store
     * @param id id of store to update
     * @param data [UpdateStoreDto]
     * @returns ApiResponse<{ store: StoreModel }>()
     */
    @Patch(':id')
    async updateStore(
        @Param('id') id: string,
        @Body() data: UpdateStoreDto,
    ): Promise<ApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.updateStore(id, data);
        return new ApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * Update a store category
     * @param id id of store category to update
     * @param data [UpdateStoreCategoryDto]
     * @returns ApiResponse<{ storeCategory: StoreCategoryModel }>()
     */
    @Patch('category/:id')
    async updateStoreCategory(
        @Param('id') id: string,
        @Body() data: UpdateStoreCategoryDto,
    ): Promise<ApiResponse<{ storeCategory: StoreCategoryModel }>> {
        const _storeCategory = await this.storeService.updateStoreCategory(id, data);
        return new ApiResponse<{ storeCategory: StoreCategoryModel }>({
            data: { storeCategory: _storeCategory },
            message: 'Store category updated successfully',
            success: true,
        });
    }

    /**
     * Add a category to a store
     * @param id id of store to add category to
     * @param categoryId category id to add
     * @returns ApiResponse<{ store: StoreModel }>()
     */
    @Patch('add-category/:id')
    async addCategory(
        @Param('id') id: string,
        @Body('categoryId') categoryId: string,
    ): Promise<ApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.addStoreCategory(id, categoryId);
        return new ApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * 
     * @param id id of store to remove category from
     * @param categoryId category id to remove
     * @returns ApiResponse<{ store: StoreModel }>()
     */
    @Patch('remove-category/:id')
    async removeCategory(
        @Param('id') id: string,
        @Body('categoryId') categoryId: string,
    ): Promise<ApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.removeStoreCategory(id, categoryId);
        return new ApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * add a product to a store
     * @param id id of store to add product to
     * @param productId id of product to add
     * @returns ApiResponse<{ store: StoreModel }>()
     */
    @Patch('add-product/:id')
    async addProduct(
        @Param('id') id: string,
        @Body('productId') productId: string,
    ): Promise<ApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.addProductToStore(id, productId);
        return new ApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * Remove a product from a store
     * @param id id of store to remove product from
     * @param productId id of product to remove
     * @returns ApiResponse<{ store: StoreModel }>()
     */
    @Patch('remove-product/:id')
    async removeProduct(
        @Param('id') id: string,
        @Body('productId') productId: string,
    ): Promise<ApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.removeProductFromStore(id, productId);
        return new ApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * Delete a store
     * @param id id of store to delete
     * @returns ApiResponse<{ store: string }>()
     */
    @Delete(':id')
    async deleteStore(id: string): Promise<ApiResponse<{ store: string }>> {
        const _store = await this.storeService.deleteStore(id);
        return new ApiResponse<{ store: string }>({
            data: { store: _store },
            message: 'Store deleted successfully',
            success: true,
        });
    }

    /**
     * Delete a store category
     * @param id id of store category to delete
     * @returns ApiResponse<{ store: string }>()
     */
    @Delete('category/:id')
    async deleteStoreCategory(id: string): Promise<ApiResponse<{ storeCategory: string }>> {
        const _storeCategory = await this.storeService.deleteStoreCategory(id);
        return new ApiResponse<{ storeCategory: string }>({
            data: { storeCategory: _storeCategory },
            message: 'Store category deleted successfully',
            success: true,
        });
    }
}
