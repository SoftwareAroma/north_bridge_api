import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreCategory as StoreCategoryModel, Store as StoreModel } from '@prisma/client';
import { CreateStoreCategoryDto, CreateStoreDto } from './dto/create.dto';
import { CustomApiResponse } from '@shared/utils';
import { UpdateStoreCategoryDto, UpdateStoreDto } from './dto/update.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Store')
@Controller({ path: 'store', version: '1' })
export class StoreController {
    constructor(
        private readonly storeService: StoreService,
    ) { }

    /**
     * Create a new store
     * @param data [CreateStoreDto]
     * @returns CustomApiResponse<{ store: StoreModel }>()
     */
    @Post('create')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Store created successfully',
        type: CustomApiResponse,
    })
    async createStore(
        @Body() data: CreateStoreDto,
    ): Promise<CustomApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.createStore(data);
        return new CustomApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store created successfully',
            success: true,
        });
    }

    /**
     * Create a new store category
     * @param data [CreateStoreCategoryDto]
     * @returns CustomApiResponse<{ storeCategory: StoreCategoryModel }>()
     */
    @Post('create-category')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Store category created successfully',
        type: CustomApiResponse,
    })
    async createStoreCategory(
        @Body() data: CreateStoreCategoryDto,
    ): Promise<CustomApiResponse<{ storeCategory: StoreCategoryModel }>> {
        const _storeCategory = await this.storeService.createStoreCategory(data);
        return new CustomApiResponse<{ storeCategory: StoreCategoryModel }>({
            data: { storeCategory: _storeCategory },
            message: 'Store category created successfully',
            success: true,
        });
    }

    /**
     * Get all stores
     * @returns CustomApiResponse<{ stores: StoreModel[] }>()
     */
    @Get('stores')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Stores fetched successfully',
        type: CustomApiResponse,
    })
    async getStores(): Promise<CustomApiResponse<{ stores: StoreModel[] }>> {
        const _stores = await this.storeService.getStores();
        return new CustomApiResponse<{ stores: StoreModel[] }>({
            data: { stores: _stores },
            message: 'Stores fetched successfully',
            success: true,
        });
    }

    /**
     * Get all store categories
     * @returns CustomApiResponse<{ storeCategories: StoreCategoryModel[] }>()
     */
    @Get('categories')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store categories fetched successfully',
        type: CustomApiResponse,
    })
    async getStoreCategories(): Promise<CustomApiResponse<{ storeCategories: StoreCategoryModel[] }>> {
        const _storeCategories = await this.storeService.getStoreCategories();
        return new CustomApiResponse<{ storeCategories: StoreCategoryModel[] }>({
            data: { storeCategories: _storeCategories },
            message: 'Store categories fetched successfully',
            success: true,
        });
    }

    /**
     * Get a store
     * @param id id of store to get
     * @returns CustomApiResponse<{ store: StoreModel }>()
     */
    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store fetched successfully',
        type: CustomApiResponse,
    })
    async getStore(id: string): Promise<CustomApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.getStore(id);
        return new CustomApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store fetched successfully',
            success: true,
        });
    }

    /**
     * Get a store category
     * @param id id of store category to get
     * @returns CustomApiResponse<{ storeCategory: StoreCategoryModel }>()
     */
    @Get('category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store category fetched successfully',
        type: CustomApiResponse,
    })
    async getStoreCategory(id: string): Promise<CustomApiResponse<{ storeCategory: StoreCategoryModel }>> {
        const _storeCategory = await this.storeService.getStoreCategory(id);
        return new CustomApiResponse<{ storeCategory: StoreCategoryModel }>({
            data: { storeCategory: _storeCategory },
            message: 'Store category fetched successfully',
            success: true,
        });
    }

    /**
     * Update a store
     * @param id id of store to update
     * @param data [UpdateStoreDto]
     * @returns CustomApiResponse<{ store: StoreModel }>()
     */
    @Patch(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store updated successfully',
        type: CustomApiResponse,
    })
    async updateStore(
        @Param('id') id: string,
        @Body() data: UpdateStoreDto,
    ): Promise<CustomApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.updateStore(id, data);
        return new CustomApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * Update a store category
     * @param id id of store category to update
     * @param data [UpdateStoreCategoryDto]
     * @returns CustomApiResponse<{ storeCategory: StoreCategoryModel }>()
     */
    @Patch('category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store category updated successfully',
        type: CustomApiResponse,
    })
    async updateStoreCategory(
        @Param('id') id: string,
        @Body() data: UpdateStoreCategoryDto,
    ): Promise<CustomApiResponse<{ storeCategory: StoreCategoryModel }>> {
        const _storeCategory = await this.storeService.updateStoreCategory(id, data);
        return new CustomApiResponse<{ storeCategory: StoreCategoryModel }>({
            data: { storeCategory: _storeCategory },
            message: 'Store category updated successfully',
            success: true,
        });
    }

    /**
     * Add a category to a store
     * @param id id of store to add category to
     * @param categoryId category id to add
     * @returns CustomApiResponse<{ store: StoreModel }>()
     */
    @Patch('add-category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store updated successfully',
        type: CustomApiResponse,
    })
    async addCategory(
        @Param('id') id: string,
        @Body('categoryId') categoryId: string,
    ): Promise<CustomApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.addStoreCategory(id, categoryId);
        return new CustomApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * 
     * @param id id of store to remove category from
     * @param categoryId category id to remove
     * @returns CustomApiResponse<{ store: StoreModel }>()
     */
    @Patch('remove-category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store updated successfully',
        type: CustomApiResponse,
    })
    async removeCategory(
        @Param('id') id: string,
        @Body('categoryId') categoryId: string,
    ): Promise<CustomApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.removeStoreCategory(id, categoryId);
        return new CustomApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * add a product to a store
     * @param id id of store to add product to
     * @param productId id of product to add
     * @returns CustomApiResponse<{ store: StoreModel }>()
     */
    @Patch('add-product/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store updated successfully',
        type: CustomApiResponse,
    })
    async addProduct(
        @Param('id') id: string,
        @Body('productId') productId: string,
    ): Promise<CustomApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.addProductToStore(id, productId);
        return new CustomApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * Remove a product from a store
     * @param id id of store to remove product from
     * @param productId id of product to remove
     * @returns CustomApiResponse<{ store: StoreModel }>()
     */
    @Patch('remove-product/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store updated successfully',
        type: CustomApiResponse,
    })
    async removeProduct(
        @Param('id') id: string,
        @Body('productId') productId: string,
    ): Promise<CustomApiResponse<{ store: StoreModel }>> {
        const _store = await this.storeService.removeProductFromStore(id, productId);
        return new CustomApiResponse<{ store: StoreModel }>({
            data: { store: _store },
            message: 'Store updated successfully',
            success: true,
        });
    }

    /**
     * Delete a store
     * @param id id of store to delete
     * @returns CustomApiResponse<{ store: string }>()
     */
    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store deleted successfully',
        type: CustomApiResponse,
    })
    async deleteStore(id: string): Promise<CustomApiResponse<{ store: string }>> {
        const _store = await this.storeService.deleteStore(id);
        return new CustomApiResponse<{ store: string }>({
            data: { store: _store },
            message: 'Store deleted successfully',
            success: true,
        });
    }

    /**
     * Delete a store category
     * @param id id of store category to delete
     * @returns CustomApiResponse<{ store: string }>()
     */
    @Delete('category/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store category deleted successfully',
        type: CustomApiResponse,
    })
    async deleteStoreCategory(id: string): Promise<CustomApiResponse<{ storeCategory: string }>> {
        const _storeCategory = await this.storeService.deleteStoreCategory(id);
        return new CustomApiResponse<{ storeCategory: string }>({
            data: { storeCategory: _storeCategory },
            message: 'Store category deleted successfully',
            success: true,
        });
    }
}
