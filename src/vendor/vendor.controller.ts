import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create.dto';
import { LoginVendorDto } from './dto/login.dto';
import { ApiResponse } from '@shared/utils';
import { Vendor as VendorModel } from '@prisma/client';
import { UpdateVendorDto } from './dto/update.dto';

@Controller({ path: 'vendor', version: '1' })
export class VendorController {
    constructor(
        private vendorService: VendorService,
    ) { }

    @Post('register')
    async registerVendor(
        @Body() data: CreateVendorDto,
        @Res({ passthrough: true }) response,
    ): Promise<ApiResponse<{ access_token: string }>> {
        const _token = await this.vendorService.createVendor(data, response);
        return new ApiResponse<{ access_token: string }>({
            data: { access_token: _token },
            message: 'Vendor registered successfully',
            success: true,
        });
    }

    @Post('login')
    async loginVendor(
        @Body() data: LoginVendorDto,
        @Res({ passthrough: true }) response,
    ): Promise<ApiResponse<{ access_token: string }>> {
        const _token = await this.vendorService.loginVendor(data, response);
        return new ApiResponse<{ access_token: string }>({
            data: { access_token: _token },
            message: 'Vendor logged in successfully',
            success: true,
        });
    }

    @Get('vendors')
    async getAllVendors(): Promise<ApiResponse<{ vendors: VendorModel[] }>> {
        const _vendors = await this.vendorService.getVendors();
        return new ApiResponse<{ vendors: VendorModel[] }>({
            data: { vendors: _vendors },
            message: 'Vendors fetched successfully',
            success: true,
        });
    }

    @Get('profile')
    async getVendorProfile(
        @Req() request,
    ): Promise<ApiResponse<{ vendor: VendorModel }>> {
        const { userId } = request.user;
        const vendor = await this.vendorService.profile(userId);
        return new ApiResponse<{ vendor: VendorModel }>({
            data: { vendor: vendor },
            message: 'Vendor profile retrieved successfully',
            success: true,
        });
    }

    @Get(':id')
    async getVendor(
        @Param('id') id: string,
    ): Promise<ApiResponse<{ vendor: VendorModel }>> {
        const vendor = await this.vendorService.getVendor(id);
        return new ApiResponse<{ vendor: VendorModel }>({
            data: { vendor: vendor },
            message: 'Vendor profile retrieved successfully',
            success: true,
        });
    }

    @Patch(':id')
    async updateVendor(
        @Param('id') id: string,
        @Body() data: UpdateVendorDto,
    ): Promise<ApiResponse<{ vendor: VendorModel }>> {
        const vendor = await this.vendorService.updateVendor(id, data);
        return new ApiResponse<{ vendor: VendorModel }>({
            data: { vendor: vendor },
            message: 'Vendor profile updated successfully',
            success: true,
        });
    }


    @Get('logout')
    async logoutVendor(
        @Res({ passthrough: true }) response,
    ): Promise<ApiResponse<boolean>> {
        response.cookie('access_token', '', { maxAge: 1 });
        return new ApiResponse<boolean>({
            data: true,
            message: 'User logged out successfully',
            success: true,
        });
    }

    @Delete(':id')
    async deleteVendor(
        @Param('id') id: string,
    ): Promise<ApiResponse<boolean>> {
        await this.vendorService.deleteVendor(id);
        return new ApiResponse<boolean>({
            data: true,
            message: 'Vendor deleted successfully',
            success: true,
        });
    }
}
