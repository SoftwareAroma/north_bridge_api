import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create.dto';
import { LoginVendorDto } from './dto/login.dto';
import { CustomApiResponse } from '@shared/utils';
import { Vendor as VendorModel } from '@prisma/client';
import { UpdateVendorDto } from './dto/update.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse, BooleanResponse, StringResponse } from '@app/response/response.dto';
import { VendorResponse, VendorsResponse } from './dto/response.dto';
import { JwtAuthGuard } from '@shared';

@ApiTags('Vendor')
@Controller({ path: 'vendor', version: '1' })
export class VendorController {
    constructor(
        private vendorService: VendorService,
    ) { }

    @Post('register')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Vendor created successfully',
        type: AuthResponse,
    })
    async registerVendor(
        @Body() data: CreateVendorDto,
        @Res({ passthrough: true }) response,
    ): Promise<CustomApiResponse<{ access_token: string }>> {
        const _token = await this.vendorService.createVendor(data, response);
        return new CustomApiResponse<{ access_token: string }>({
            data: { access_token: _token },
            message: 'Vendor registered successfully',
            success: true,
        });
    }

    @Post('login')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vendor logged in successfully',
        type: AuthResponse,
    })
    async loginVendor(
        @Body() data: LoginVendorDto,
        @Res({ passthrough: true }) response,
    ): Promise<CustomApiResponse<{ access_token: string }>> {
        const _token = await this.vendorService.loginVendor(data, response);
        return new CustomApiResponse<{ access_token: string }>({
            data: { access_token: _token },
            message: 'Vendor logged in successfully',
            success: true,
        });
    }

    @Get('vendors')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vendors fetched successfully',
        type: VendorsResponse,
    })
    async getAllVendors(): Promise<CustomApiResponse<{ vendors: VendorModel[] }>> {
        const _vendors = await this.vendorService.getVendors();
        return new CustomApiResponse<{ vendors: VendorModel[] }>({
            data: { vendors: _vendors },
            message: 'Vendors fetched successfully',
            success: true,
        });
    }

    @UseGuards(JwtAuthGuard,)
    @Get('profile')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vendor profile retrieved successfully',
        type: VendorResponse,
    })
    async getVendorProfile(
        @Req() request,
    ): Promise<CustomApiResponse<{ vendor: VendorModel }>> {
        const { userId } = request.user;
        const vendor = await this.vendorService.profile(userId);
        return new CustomApiResponse<{ vendor: VendorModel }>({
            data: { vendor: vendor },
            message: 'Vendor profile retrieved successfully',
            success: true,
        });
    }

    @Get('vender/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vendor profile retrieved successfully',
        type: VendorResponse
    })
    async getVendor(
        @Param('id') id: string,
    ): Promise<CustomApiResponse<{ vendor: VendorModel }>> {
        const vendor = await this.vendorService.getVendor(id);
        return new CustomApiResponse<{ vendor: VendorModel }>({
            data: { vendor: vendor },
            message: 'Vendor profile retrieved successfully',
            success: true,
        });
    }

    @Patch('vendor/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vendor profile updated successfully',
        type: VendorResponse
    })
    async updateVendor(
        @Param('id') id: string,
        @Body() data: UpdateVendorDto,
    ): Promise<CustomApiResponse<{ vendor: VendorModel }>> {
        const vendor = await this.vendorService.updateVendor(id, data);
        return new CustomApiResponse<{ vendor: VendorModel }>({
            data: { vendor: vendor },
            message: 'Vendor profile updated successfully',
            success: true,
        });
    }


    @Get('logout')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vendor logged out successfully',
        type: BooleanResponse,
    })
    async logoutVendor(
        @Res({ passthrough: true }) response,
    ): Promise<CustomApiResponse<boolean>> {
        response.cookie('access_token', '', { maxAge: 1 });
        return new CustomApiResponse<boolean>({
            data: true,
            message: 'User logged out successfully',
            success: true,
        });
    }

    @Delete('vendor/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vendor deleted successfully',
        type: StringResponse,
    })
    async deleteVendor(
        @Param('id') id: string,
    ): Promise<CustomApiResponse<{ user: string }>> {
        const _user = await this.vendorService.deleteVendor(id);
        return new CustomApiResponse<{ user: string }>({
            data: { user: _user },
            message: 'Vendor deleted successfully',
            success: true,
        });
    }
}
