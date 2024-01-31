import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create.dto';
import { LoginVendorDto } from './dto/login.dto';
import { CustomApiResponse } from '@shared/utils';
import { Vendor as VendorModel } from '@prisma/client';
import { UpdateVendorDto } from './dto/update.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    AuthResponse,
    BooleanResponse,
    StringResponse
} from '@app/response/response.dto';
import { VendorResponse, VendorsResponse } from './dto/response.dto';
import {
    CheckPolicies,
    JwtAuthGuard,
    PoliciesGuard
} from '@shared';
import {
    DeleteVendorPolicyHandler,
    ReadVendorPolicyHandler,
    UpdateVendorPolicyHandler
} from '@shared/casl/handler/policy.handler';

@ApiTags('Vendor Endpoints')
@Controller({ path: 'vendor', version: '1' })
export class VendorController {
    constructor(
        private vendorService: VendorService,
    ) { }

    /**
     * Register a new vendor
     * @param data [CreateVendorDto]
     * @param response Response
     * @returns access_token
     */
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

    /**
     * Login a vendor
     * @param data [LoginVendorDto]
     * @param response Response
     * @returns access_token
     */
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

    /**
     * Get all vendors
     * @returns List of all vendors
     */
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

    /**
     * Get vendor profile
     * @param request Request
     * @returns Vendor profile
     */
    @CheckPolicies(new ReadVendorPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
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

    /**
     * Get vendor profile
     * @param id Vendor id
     * @returns Vendor profile
     */
    @Get('vendor/:id')
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

    /**
     * Update vendor profile
     * @param id Vendor id
     * @param data UpdateVendorDto
     * @returns Vendor profile
     */
    @CheckPolicies(new UpdateVendorPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
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

    /**
     * Logout a vendor
     * @param response Response
     * @returns true
     */
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

    /**
     * Delete a vendor
     * @param id Vendor id
     * @returns Vendor id
     */
    @CheckPolicies(new DeleteVendorPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
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
