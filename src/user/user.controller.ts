import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomApiResponse, PoliciesGuard, JwtAuthGuard, CheckPolicies } from '@shared';
import { CreateCartDto, CreateOrderDto, CreateUserDto } from './dto/create.dto';
import { LoginUserDto } from './dto/login.dto';
import { Order as OrderModel, User as UserModel } from '@prisma/client';
import { UpdateCartDto, UpdateOrderDto, UpdateUserDto } from './dto/update.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse, BooleanResponse, StringResponse } from '@app/response/response.dto';
import { UserResponse, UsersResponse } from './dto/response.dto';
import {
    DeleteUserPolicyHandler,
    ReadUserPolicyHandler,
    UpdateUserPolicyHandler
} from '@shared/casl/handler/policy.handler';
import { Response } from "express";

@ApiTags('User Endpoints')
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
        @Res({ passthrough: true }) response: Response
    ): Promise<CustomApiResponse<{ access_token: string }>> {
        const _user: string = await this.userService.registerUser(userDto, response);
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
        @Res({ passthrough: true }) response: Response
    ): Promise<CustomApiResponse<{ access_token: string }>> {
        const _user: string = await this.userService.loginUser(userDto, response);
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
    async getAllUsers(): Promise<CustomApiResponse<{ users: Array<UserModel> }>> {
        const _users: Array<UserModel> = await this.userService.getUsers();
        return new CustomApiResponse<{ users: UserModel[] }>({
            data: { users: _users },
            message: 'Users fetched successfully',
            success: true,
        });
    }

    @CheckPolicies(new ReadUserPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Get('profile')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User profile fetched successfully',
        type: UserResponse,
    })
    async getUserProfile(
        @Req() request: any
    ): Promise<CustomApiResponse<{ user: UserModel }>> {
        // console.log(request.user)
        const { userId } = request.user;
        const _user: UserModel = await this.userService.profile(userId);
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
        const _user: UserModel = await this.userService.getUserById(id);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'User fetched successfully',
            success: true,
        });
    }

    @CheckPolicies(new UpdateUserPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
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
        const _user: UserModel = await this.userService.updateUser(id, userDto);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'User updated successfully',
            success: true,
        });
    }

    @CheckPolicies(new UpdateUserPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
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
        const _user: UserModel = await this.userService.addCart(id, cart);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart added successfully',
            success: true,
        });
    }

    @CheckPolicies(new UpdateUserPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
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
        const _user: UserModel = await this.userService.updateCart(id, cartId, cart);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart updated successfully',
            success: true,
        });
    }

    @CheckPolicies(new UpdateUserPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Patch('remove-cart/:id/:cartId')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cart removed successfully',
        type: UserResponse,
    })
    async removeCart(
        @Param('id') id: string,
        @Param('cartId') cartId: string,
    ): Promise<CustomApiResponse<{ user: UserModel }>> {
        const _user: UserModel = await this.userService.deleteCart(id, cartId);
        return new CustomApiResponse<{ user: UserModel }>({
            data: { user: _user },
            message: 'Cart removed successfully',
            success: true,
        });
    }


    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Post('add-order')
    async addOrder(
        @Body() order: CreateOrderDto,
    ): Promise<CustomApiResponse<{ order: OrderModel }>> {
        const _order: OrderModel = await this.userService.createOrder(order);
        return new CustomApiResponse<{ order: OrderModel }>({
            data: { order: _order },
            message: 'Order added successfully',
            success: true,
        });
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Get('orders')
    async getOrders(): Promise<CustomApiResponse<{ orders: Array<OrderModel> }>> {
        const _orders: Array<OrderModel> = await this.userService.getOrders();
        return new CustomApiResponse<{ orders: Array<OrderModel> }>({
            data: { orders: _orders },
            message: 'Orders fetched successfully',
            success: true,
        });
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Get('order/:id')
    async getOrderById(
        @Param('id') id: string
    ): Promise<CustomApiResponse<{ order: OrderModel }>> {
        const _order: OrderModel = await this.userService.getOrderById(id);
        return new CustomApiResponse<{ order: OrderModel }>({
            data: { order: _order },
            message: 'Order fetched successfully',
            success: true,
        });
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Get('orders/:userId')
    async getOrdersByUserId(
        @Param('userId') userId: string
    ): Promise<CustomApiResponse<{ orders: Array<OrderModel> }>> {
        const _orders: Array<OrderModel> = await this.userService.getOrdersByUserId(userId);
        return new CustomApiResponse<{ orders: Array<OrderModel> }>({
            data: { orders: _orders },
            message: 'Orders fetched successfully',
            success: true,
        });
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Patch('update-order/:id')
    async updateOrder(
        @Param('id') id: string,
        @Body() order: UpdateOrderDto,
    ): Promise<CustomApiResponse<{ order: OrderModel }>> {
        const _order: OrderModel = await this.userService.updateOrder(id, order);
        return new CustomApiResponse<{ order: OrderModel }>({
            data: { order: _order },
            message: 'Order updated successfully',
            success: true,
        });
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Delete('order/:id')
    async deleteOrder(
        @Param('id') id: string,
    ): Promise<CustomApiResponse<{ order: string }>> {
        const _order: string = await this.userService.deleteOrder(id);
        return new CustomApiResponse<{ order: string }>({
            data: { order: _order },
            message: 'Order deleted successfully',
            success: true,
        });
    }

    @CheckPolicies(new DeleteUserPolicyHandler())
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @Delete('user/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User deleted successfully',
        type: StringResponse,
    })
    async deleteUser(
        @Param('id') id: string,
        @Res({ passthrough: true }) response: Response
    ): Promise<CustomApiResponse<{ user: string }>> {
        const _user: string = await this.userService.deleteUser(id);
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
        @Res({ passthrough: true }) response: Response
    ): Promise<CustomApiResponse<boolean>> {
        response.cookie('access_token', '', { maxAge: 1 });
        return new CustomApiResponse<boolean>({
            data: true,
            message: 'User logged out successfully',
            success: true,
        });
    }
}
