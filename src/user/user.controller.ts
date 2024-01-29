import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomApiResponse } from '@shared';
import { CreateCartDto, CreateUserDto } from './dto/create.dto';
import { LoginUserDto } from './dto/login.dto';
import { User as UserModel } from '@prisma/client';
import { UpdateCartDto, UpdateUserDto } from './dto/update.dto';
import { JwtAuthGuard } from '@shared';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse, BooleanResponse, StringResponse } from '@app/response/response.dto';
import { UserResponse, UsersResponse } from './dto/response.dto';

@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('register')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User registered successfully',
        type: AuthResponse,
    })
    async registerUser(
        @Body() userDto: CreateUserDto,
        @Res({ passthrough: true }) response
    ): Promise<CustomApiResponse<{ access_token: string }>> {
        const _user = await this.userService.registerUser(userDto, response);
        // response object
        return new CustomApiResponse<{ access_token: string }>({
            data: { access_token: _user },
            message: 'User logged in successfully',
            success: true,
        });
    }

    @Post('login')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User logged in successfully',
        type: AuthResponse,
    })
    async loginUser(
        @Body() userDto: LoginUserDto,
        @Res({ passthrough: true }) response
    ): Promise<CustomApiResponse<{ access_token: string }>> {
        const _user = await this.userService.loginUser(userDto, response);
        return new CustomApiResponse<{ access_token: string }>({
            data: { access_token: _user },
            message: 'User logged in successfully',
            success: true,
        });
    }

    @Get('users')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Users fetched successfully',
        type: UsersResponse,
    })
    async getAllUsers(): Promise<CustomApiResponse<{ users: UserModel[] }>> {
        const _users = await this.userService.getUsers();
        return new CustomApiResponse<{ users: UserModel[] }>({
            data: { users: _users },
            message: 'Users fetched successfully',
            success: true,
        });
    }

    @UseGuards(JwtAuthGuard,)
    @Get('profile')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User profile fetched successfully',
        type: UserResponse,
    })
    async getUserProfile(
        @Req() request
    ): Promise<CustomApiResponse<{ user: UserModel }>> {
        // console.log(request.user)
        const { userId } = request.user;
        const _user = await this.userService.profile(userId);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'User profile fetched successfully',
            success: true,
        });
    }

    @Get('user/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User fetched successfully',
        type: UserResponse,
    })
    async getUserById(
        @Param('id') id: string
    ): Promise<CustomApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.getUserById(id);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'User fetched successfully',
            success: true,
        });
    }

    @Patch('user/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User updated successfully',
        type: UserResponse,
    })
    async updateUser(
        @Param('id') id: string,
        @Body() userDto: UpdateUserDto
    ): Promise<CustomApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.updateUser(id, userDto);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'User updated successfully',
            success: true,
        });
    }

    @Patch('add-cart/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cart added successfully',
        type: UserResponse,
    })
    async addCart(
        @Param('id') id: string,
        @Body() cart: CreateCartDto
    ): Promise<CustomApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.addCart(id, cart);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart added successfully',
            success: true,
        });
    }

    @Patch('update-cart/:id/:cartId')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cart updated successfully',
        type: UserResponse,
    })
    async updateCart(
        @Param('id') id: string,
        @Param('cartId') cartId: string,
        @Body() cart: UpdateCartDto,
    ): Promise<CustomApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.updateCart(id, cartId, cart);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart updated successfully',
            success: true,
        });
    }

    @Patch('remove-cart/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cart removed successfully',
        type: UserResponse,
    })
    async removeCart(
        @Param('id') id: string,
        @Body() cartId: string
    ): Promise<CustomApiResponse<{ user: UserModel }>> {
        const _user = await this.userService.deleteCart(id, cartId);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart removed successfully',
            success: true,
        });
    }

    @Delete('user/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User deleted successfully',
        type: StringResponse,
    })
    async deleteUser(
        @Param('id') id: string,
        @Res({ passthrough: true }) response
    ): Promise<CustomApiResponse<{ user: string }>> {
        const _user = await this.userService.deleteUser(id);
        response.cookie('access_token', '', { maxAge: 1 });
        return new CustomApiResponse<{ user: string }>({
            data: { user: _user },
            message: 'User deleted successfully',
            success: true,
        });
    }

    @Get('logout')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User logged out successfully',
        type: BooleanResponse,
    })
    async logoutUser(
        @Res({ passthrough: true }) response
    ): Promise<CustomApiResponse<boolean>> {
        response.cookie('access_token', '', { maxAge: 1 });
        return new CustomApiResponse<boolean>({
            data: true,
            message: 'User logged out successfully',
            success: true,
        });
    }
}
