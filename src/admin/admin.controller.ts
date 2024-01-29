import {
    Controller,
    Res,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiResponse } from '@shared';
import { CreateAdminDto } from './dto/create.dto';
import { LoginAdminDto } from './dto/login.dto';
import { Admin as AdminModel } from '@prisma/client';
import { AdminJwtAuthGuard } from './guard';
import { UpdateAdminDto } from './dto/update.dto';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) { }

    @Post('register')
    async registerAdmin(
        @Body() adminDto: CreateAdminDto,
        @Res({ passthrough: true }) response
    ): Promise<ApiResponse<{ access_token: string }>> {
        const _admin = await this.adminService.registerAdmin(adminDto, response);
        return new ApiResponse<{ access_token: string }>({
            data: { access_token: _admin },
            message: 'admin logged in successfully',
            success: true,
        });
    }

    @Post('login')
    async loginAdmin(
        @Body() adminDto: LoginAdminDto,
        @Res({ passthrough: true }) response
    ): Promise<ApiResponse<{ access_token: string }>> {
        const _admin = await this.adminService.loginAdmin(adminDto, response);
        return new ApiResponse<{ access_token: string }>({
            data: { access_token: _admin },
            message: 'admin logged in successfully',
            success: true,
        });
    }

    @Get(':id')
    async getAdmin(
        @Param('id') id: string
    ): Promise<ApiResponse<{ admin: AdminModel }>> {
        const _admin = await this.adminService.getAdmin(id);
        return new ApiResponse<{ admin: AdminModel }>({
            data: { admin: _admin },
            message: 'admin fetched successfully',
            success: true,
        });
    }

    @Get('admins')
    async getAdmins(): Promise<ApiResponse<{ admins: AdminModel[] }>> {
        const _admins = await this.adminService.getAdmins();
        return new ApiResponse<{ admins: AdminModel[] }>({
            data: { admins: _admins },
            message: 'admins fetched successfully',
            success: true,
        });
    }

    @UseGuards(AdminJwtAuthGuard,)
    @Get('profile')
    async getAdminProfile(
        @Req() request
    ): Promise<ApiResponse<{ admin: AdminModel }>> {
        const { userId } = request.admin;
        const _admin = await this.adminService.profile(userId);
        return new ApiResponse<{ admin: AdminModel }>({
            data: { admin: _admin },
            message: 'admin profile fetched successfully',
            success: true,
        });
    }

    @Patch(':id')
    async updateAdmin(
        @Param('id') id: string,
        @Body() adminDto: UpdateAdminDto
    ): Promise<ApiResponse<{ admin: AdminModel }>> {
        const _admin = await this.adminService.updateAdmin(id, adminDto);
        return new ApiResponse<{ admin: AdminModel }>({
            data: { admin: _admin },
            message: 'admin updated successfully',
            success: true,
        });
    }


    @Delete(':id')
    async deleteAdmin(
        @Param('id') id: string,
        @Res({ passthrough: true }) response
    ): Promise<ApiResponse<{ admin: string }>> {
        const _admin = await this.adminService.deleteAdmin(id);
        response.cookie('access_token', '', { maxAge: 1 });
        return new ApiResponse<{ admin: string }>({
            data: { admin: _admin },
            message: 'admin deleted successfully',
            success: true,
        });
    }

    @Get('logout')
    async logoutAdmin(
        @Res({ passthrough: true }) response
    ): Promise<ApiResponse<boolean>> {
        response.cookie('access_token', '', { maxAge: 1 });
        return new ApiResponse<boolean>({
            data: true,
            message: 'admin logged out successfully',
            success: true,
        });
    }

}
