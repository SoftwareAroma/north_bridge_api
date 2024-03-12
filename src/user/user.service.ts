import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateCartDto, CreateOrderDto, CreateUserDto } from './dto/create.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/login.dto';
import { comparePassword, generateSalt, getDefaultPropertyValue, hashPassword, PayLoad } from '@shared';
import { Order as OrderModel, User as UserModel } from '@prisma/client';
import { UpdateCartDto, UpdateOrderDto, UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Create or Register a new user and set the access_token in the cookie
     * take the user details through the CreateUserDto
     * @param userDto
     * @param response access token to be set in the cookie
     * @returns access_token
     */
    async registerUser(userDto: CreateUserDto, response: Response): Promise<string> {
        try {// make the email lowercase
            userDto.email = userDto.email.toLowerCase();
            // check if user already exist
            const _userExist: UserModel = await this.prismaService.user.findUnique({
                where: {
                    email: userDto.email
                }
            });
            if (_userExist) {
                throw new HttpException('Email Already Exist', HttpStatus.CONFLICT);
            }

            if (userDto.password.length < 8) {
                throw new HttpException('Password must be at least 8 characters', HttpStatus.BAD_REQUEST);
            }
            const salt: string = await generateSalt();

            // add the salt to the dto
            userDto.salt = salt;

            userDto.password = await hashPassword(
                userDto.password,
                salt,
            );

            const _user: UserModel = await this.prismaService.user.create({
                data: userDto
            });
            const payload: PayLoad = { sub: _user.id, username: _user.email, role: _user.role };
            const token: string = this.jwtService.sign(payload);
            response.cookie('access_token', token, {
                httpOnly: true,
            });
            return token;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Login a user and set the access_token in the cookie
     * take the user email and password through the LoginUserDto
     * @param user
     * @param response access_token to be set in the cookie
     * @returns access_token
     */
    async loginUser(user: LoginUserDto, response: Response): Promise<string> {
        try { // make the email lowercase
            user.email = user.email.toLowerCase();
            const _user: UserModel = await this.prismaService.user.findUnique({
                where: {
                    email: user.email
                }
            });
            // if user does not exist
            if (!_user) {
                throw new HttpException(`No account found for user with email ${user.email}`, HttpStatus.NOT_FOUND);
            }

            const isPasswordValid: boolean = await comparePassword(user.password, _user.password);
            if (!isPasswordValid) {
                throw new HttpException('Invalid email or passowrd', HttpStatus.BAD_REQUEST);
            }
            const payload: PayLoad = { sub: _user.id, username: _user.email, role: _user.role };
            const token: string = this.jwtService.sign(payload);
            response.cookie('access_token', token, {
                httpOnly: true,
            });
            return token;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Validate a user by id
     * @param id the user id to validate
     * @returns [User] object without password and salt
     */
    async validateUser(id: string): Promise<UserModel | null> {
        try {
            const _user: UserModel = await this.prismaService.user.findUnique({
                where: { id: id },
            });
            // console.log(_user)
            if (!_user) {
                return null;
            }
            return this.exclude(_user, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get the profile of a user by id
     * @param id user id to get profile
     * @returns [User] object without password and salt
     */
    async profile(id: string): Promise<UserModel> {
        try {
            const _user: UserModel = await this.prismaService.user.findUnique({
                where: { id: id },
                include: {
                    cart: true,
                }
            });
            if (!_user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return this.exclude(_user, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get the profile of a user by id
     * @param id user id to get profile
     * @returns [User] object without password and salt
     */
    async getUserById(id: string): Promise<UserModel> {
        try {
            const _user: UserModel = await this.prismaService.user.findUnique({
                where: { id: id },
                include: {
                    cart: true,
                }
            });
            if (!_user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return this.exclude(_user, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all users
     * @returns [User[]] array of users without password and salt
     */
    async getUsers(): Promise<UserModel[]> {
        try {
            const _users: Array<UserModel> = await this.prismaService.user.findMany({
                include: {
                    cart: true,
                }
            });
            return _users.map((user: UserModel) => this.exclude(user, ['password', 'salt']));
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a user profile
     * @param id user id to update profile
     * @param user
     * @returns [User] object without password and salt
     */
    async updateUser(id: string, user: UpdateUserDto): Promise<UserModel> {
        try {
            const _user: UserModel = await this.prismaService.user.findUnique({
                where: { id: id },
            });
            if (!_user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            // if user tries to update email
            if (user.email && user.email !== _user.email) {
                throw new HttpException('Email cannot be changed', HttpStatus.BAD_REQUEST);
            }
            const _updatedUser: UserModel = await this.prismaService.user.update({
                where: { id: id },
                data: user
            });
            return this.exclude(_updatedUser, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Add a cart item(s) to a user
     * @param id user id to get cart
     * @param cart
     * @returns [User] object without password and salt
     */
    async addCart(id: string, cart: CreateCartDto): Promise<UserModel> {
        try {
            const _user: UserModel = await this.prismaService.user.findUnique({
                where: { id: id },
                include: {
                    cart: true,
                }
            });
            if (!_user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            const _userUpdate: UserModel = await this.prismaService.user.update({
                where: { id: id },
                data: {
                    cart: {
                        create: cart
                    }
                }
            });
            if (!_user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return this.exclude(_userUpdate, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a cart item(s) to a user
     * @param userId user id to get cart
     * @param cartId card id to update
     * @param cart
     * @returns [User] object without password and salt
     */
    async updateCart(
        userId: string,
        cartId: string,
        cart: UpdateCartDto
    ): Promise<UserModel> {
        try {
            const _user: UserModel = await this.prismaService.user.findUnique({
                where: { id: userId },
                include: {
                    cart: true,
                }
            });
            if (!_user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            const _userUpdate: UserModel = await this.prismaService.user.update({
                where: { id: userId },
                data: {
                    cart: {
                        update: {
                            where: { id: cartId },
                            data: cart
                        }
                    }
                }
            });
            return this.exclude(_userUpdate, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a cart item(s) to a user
     * @param userId user id to get cart
     * @param cartId cart id to delete
     * @returns [User] object without password and salt
     */
    async deleteCart(userId: string, cartId: string): Promise<UserModel> {
        try {
            const _user: UserModel = await this.prismaService.user.findUnique({
                where: { id: userId },
                include: {
                    cart: true,
                }
            });
            if (!_user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            const _userUpdate: UserModel = await this.prismaService.user.update({
                where: { id: userId },
                data: {
                    cart: {
                        delete: {
                            id: cartId
                        }
                    }
                }
            });
            return this.exclude(_userUpdate, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Delete a user by id
     * @param id user id to delete
     * @returns [User] object without password and salt
     */
    async deleteUser(id: string): Promise<string> {
        try {
            const _user: UserModel = await this.prismaService.user.delete({
                where: { id: id },
            });
            if (!_user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return _user.id;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     *  Create an order
     * @param data CreateOrderDto
     * @returns Object -> OrderModel
     */
    async createOrder(data: CreateOrderDto): Promise<OrderModel> {
        try {
            const _order = await this.prismaService.order.create({
                data: {
                    ...data,
                    orderItems: {
                        connect: data.orderItems.map((item) => {
                            return { id: item };
                        })
                    }
                }
            });
            return _order;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all orders
     */
    async getOrders(): Promise<OrderModel[]> {
        try {
            const _orders = await this.prismaService.order.findMany();
            return _orders;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get an order by id
     */
    async getOrderById(id: string): Promise<OrderModel> {
        try {
            const _order = await this.prismaService.order.findUnique({
                where: { id: id },
            });
            if (!_order) {
                throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
            }
            return _order;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all orders by user id
     */
    async getOrdersByUserId(userId: string): Promise<OrderModel[]> {
        try {
            const _orders = await this.prismaService.order.findMany({
                where: { userId: userId },
            });
            return _orders;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     *  Update an order
     * @param id  order id
     * @param data  UpdateOrderDto
     * @returns  Object -> OrderModel
     */
    async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderModel> {
        try {
            const _order = await this.prismaService.order.update({
                where: { id: id },
                data: {
                    ...data,
                    orderItems: {
                        connect: data.orderItems.map((item) => {
                            return { id: item };
                        })
                    }
                }
            });
            return _order;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete an order by id
     * @param id -> order id
     * @returns string -> order id
     */
    async deleteOrder(id: string): Promise<string> {
        try {
            const _order = await this.prismaService.order.delete({
                where: { id: id },
            });
            if (!_order) {
                throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
            }
            return _order.id;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Exclude properties from a user object
     * @param user
     * @param keys
     * @private
     */
    private exclude<UserModel, Key extends keyof UserModel>(
        user: UserModel,
        keys: Array<Key>,
    ): UserModel {
        for (const key of keys) {
            // Populate the value with a default value of its type
            user[key] = getDefaultPropertyValue(user[key]);
        }
        return user;
    }
}
