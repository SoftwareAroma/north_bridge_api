import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from '@shared';
import { CreateCartDto, CreateUserDto } from './dto/create.dto';
import { LoginUserDto } from './dto/login.dto';
import { User as UserModel } from '@prisma/client';
import { UpdateCartDto, UpdateUserDto } from './dto/update.dto';
import { UserJwtAuthGuard } from './guard';

@Controller({ path: 'user', version: '1' })
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('register')
    async registerUser(
        @Body() userDto: CreateUserDto,
        @Res({ passthrough: true }) response
    ): Promise<ApiResponse<{ access_token: string }>> {
        const _user = await this.userService.registerUser(userDto, response);
        // response object
        return new ApiResponse<{ access_token: string }>({
            data: { access_token: _user },
            message: 'User logged in successfully',
            success: true,
        });
    }

    @Post('login')
    async loginUser(
        @Body() userDto: LoginUserDto,
        @Res({ passthrough: true }) response
    ): Promise<ApiResponse<{ access_token: string }>> {
        const _user = await this.userService.loginUser(userDto, response);
        return new ApiResponse<{ access_token: string }>({
            data: { access_token: _user },
            message: 'User logged in successfully',
            success: true,
        });
    }

    @Get(':id')
    async getUserById(
        @Param('id') id: string
    ): Promise<ApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.getUserById(id);
        return new ApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'User fetched successfully',
            success: true,
        });
    }

    @Get('users')
    async getAllUsers(): Promise<ApiResponse<{ users: UserModel[] }>> {
        const _users = await this.userService.getUsers();
        return new ApiResponse<{ users: UserModel[] }>({
            data: { users: _users },
            message: 'Users fetched successfully',
            success: true,
        });
    }

    @UseGuards(UserJwtAuthGuard,)
    @Get('profile')
    async getUserProfile(
        @Req() request
    ): Promise<ApiResponse<{ user: UserModel }>> {
        const { userId } = request.user;
        const _user = await this.userService.profile(userId);
        return new ApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'User profile fetched successfully',
            success: true,
        });
    }

    @Patch('user/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() userDto: UpdateUserDto
    ): Promise<ApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.updateUser(id, userDto);
        return new ApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'User updated successfully',
            success: true,
        });
    }

    @Patch('add-cart/:id')
    async addCart(
        @Param('id') id: string,
        @Body() cart: CreateCartDto
    ): Promise<ApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.addCart(id, cart);
        return new ApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart added successfully',
            success: true,
        });
    }

    @Patch('update-cart/:id/:cartId')
    async updateCart(
        @Param('id') id: string,
        @Param('cartId') cartId: string,
        @Body() cart: UpdateCartDto,
    ): Promise<ApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.updateCart(id, cartId, cart);
        return new ApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart updated successfully',
            success: true,
        });
    }

    @Patch('remove-cart/:id')
    async removeCart(
        @Param('id') id: string,
        @Body() cartId: string
    ): Promise<ApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.deleteCart(id, cartId);
        return new ApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart removed successfully',
            success: true,
        });
    }

    @Delete('user/:id')
    async deleteUser(
        @Param('id') id: string,
        @Res({ passthrough: true }) response
    ): Promise<ApiResponse<{ user: string }>> {
        const _user = await this.userService.deleteUser(id);
        response.cookie('access_token', '', { maxAge: 1 });
        return new ApiResponse<{ user: string }>({
            data: { user: _user },
            message: 'User deleted successfully',
            success: true,
        });
    }

    @Get('logout')
    async logoutUser(
        @Res({ passthrough: true }) response
    ): Promise<ApiResponse<boolean>> {
        response.cookie('access_token', '', { maxAge: 1 });
        return new ApiResponse<boolean>({
            data: true,
            message: 'User logged out successfully',
            success: true,
        });
    }
}
