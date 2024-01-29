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
    HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CustomApiResponse } from '@shared';
import { CreateAdminDto } from './dto/create.dto';
import { LoginAdminDto } from './dto/login.dto';
import { Admin as AdminModel } from '@prisma/client';
import { AdminJwtAuthGuard } from './guard';
import { UpdateAdminDto } from './dto/update.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) { }

    @Post('register')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Admin created successfully',
        type: CustomApiResponse,
    })
    async registerAdmin(
        @Body() adminDto: CreateAdminDto,
        @Res({ passthrough: true }) response
    ): Promise<CustomApiResponse<{ access_token: string }>> {
        const _admin = await this.adminService.registerAdmin(adminDto, response);
        return new CustomApiResponse<{ access_token: string }>({
            data: { access_token: _admin },
            message: 'admin logged in successfully',
            success: true,
        });
    }

    @Post('login')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin logged in successfully',
        type: CustomApiResponse,
    })
    async loginAdmin(
        @Body() adminDto: LoginAdminDto,
        @Res({ passthrough: true }) response
    ): Promise<CustomApiResponse<{ access_token: string }>> {
        const _admin = await this.adminService.loginAdmin(adminDto, response);
        return new CustomApiResponse<{ access_token: string }>({
            data: { access_token: _admin },
            message: 'admin logged in successfully',
            success: true,
        });
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin fetched successfully',
        type: CustomApiResponse,
    })
    async getAdmin(
        @Param('id') id: string
    ): Promise<CustomApiResponse<{ admin: AdminModel }>> {
        const _admin = await this.adminService.getAdmin(id);
        return new CustomApiResponse<{ admin: AdminModel }>({
            data: { admin: _admin },
            message: 'admin fetched successfully',
            success: true,
        });
    }

    @Get('admins')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admins fetched successfully',
        type: CustomApiResponse,
    })
    async getAdmins(): Promise<CustomApiResponse<{ admins: AdminModel[] }>> {
        const _admins = await this.adminService.getAdmins();
        return new CustomApiResponse<{ admins: AdminModel[] }>({
            data: { admins: _admins },
            message: 'admins fetched successfully',
            success: true,
        });
    }

    @UseGuards(AdminJwtAuthGuard,)
    @Get('profile')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin profile fetched successfully',
        type: CustomApiResponse,
    })
    async getAdminProfile(
        @Req() request
    ): Promise<CustomApiResponse<{ admin: AdminModel }>> {
        const { userId } = request.admin;
        const _admin = await this.adminService.profile(userId);
        return new CustomApiResponse<{ admin: AdminModel }>({
            data: { admin: _admin },
            message: 'admin profile fetched successfully',
            success: true,
        });
    }

    @Patch(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin updated successfully',
        type: CustomApiResponse,
    })
    async updateAdmin(
        @Param('id') id: string,
        @Body() adminDto: UpdateAdminDto
    ): Promise<CustomApiResponse<{ admin: AdminModel }>> {
        const _admin = await this.adminService.updateAdmin(id, adminDto);
        return new CustomApiResponse<{ admin: AdminModel }>({
            data: { admin: _admin },
            message: 'admin updated successfully',
            success: true,
        });
    }


    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin deleted successfully',
        type: CustomApiResponse,
    })
    async deleteAdmin(
        @Param('id') id: string,
        @Res({ passthrough: true }) response
    ): Promise<CustomApiResponse<{ admin: string }>> {
        const _admin = await this.adminService.deleteAdmin(id);
        response.cookie('access_token', '', { maxAge: 1 });
        return new CustomApiResponse<{ admin: string }>({
            data: { admin: _admin },
            message: 'admin deleted successfully',
            success: true,
        });
    }

    @Get('logout')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin logged out successfully',
        type: CustomApiResponse,
    })
    async logoutAdmin(
        @Res({ passthrough: true }) response
    ): Promise<CustomApiResponse<boolean>> {
        response.cookie('access_token', '', { maxAge: 1 });
        return new CustomApiResponse<boolean>({
            data: true,
            message: 'admin logged out successfully',
            success: true,
        });
    }

}
