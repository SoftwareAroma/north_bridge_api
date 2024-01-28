import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateCartDto, CreateUserDto } from './dto/create.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/login.dto';
import { comparePassword, generateSalt, getDefaultPropertyValue, hashPassword } from '@shared';
import { User as UserModel } from '@prisma/client';
import { UpdateCartDto, UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Create or Register a new user and set the access_token in the cookie
     * take the user details through the CreateUserDto
     * @param userDto [CreateUserDto]
     * @param response access token to be set in the cookie
     * @returns access_token
     */
    async registerUser(userDto: CreateUserDto, response: Response): Promise<string> {
        // check if user already exist
        const _userExist = await this.prismaService.user.findUnique({
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
        const salt = await generateSalt();

        // add the salt to the dto
        userDto.salt = salt;

        userDto.password = await hashPassword(
            userDto.password,
            salt,
        );

        const _user = await this.prismaService.user.create({
            data: userDto
        });
        const payload = { sub: _user.id, username: _user.email };
        const token = this.jwtService.sign(payload);
        response.cookie('access_token', token, {
            httpOnly: true,
        });
        return token;
    }

    /**
     * Login a user and set the access_token in the cookie
     * take the user email and password through the LoginUserDto
     * @param user [LoginUserDto] - user to login credentials
     * @param response access_token to be set in the cookie
     * @returns access_token
     */
    async loginUser(user: LoginUserDto, response: Response): Promise<string> {
        const _user = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            }
        });
        // if user does not exist
        if (!_user) {
            throw new HttpException(`No account found for user with email ${user.email}`, HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await comparePassword(user.password, _user.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid email or passowrd', HttpStatus.BAD_REQUEST);
        }
        const payload = { sub: _user.id, username: _user.email };
        const token = this.jwtService.sign(payload);
        response.cookie('access_token', token, {
            httpOnly: true,
        });
        return token;
    }

    /**
     * Validate a user by id
     * @param id the user id to validate
     * @returns [User] object without password and salt
     */
    async validateUser(id: string): Promise<UserModel | null> {
        const _user = await this.prismaService.user.findUnique({
            where: { id: id },
        });
        // console.log(_user)
        if (!_user) {
            return null;
        }
        return this.exclude(_user, ['password', 'salt']);
    }

    /**
     * Get the profile of a user by id
     * @param id user id to get profile
     * @returns [User] object without password and salt
     */
    async profile(id: string): Promise<UserModel> {
        const _user = await this.prismaService.user.findUnique({
            where: { id: id },
            include: {
                cart: true,
            }
        });
        if (!_user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return this.exclude(_user, ['password', 'salt']);
    }

    /**
     * Get the profile of a user by id
     * @param id user id to get profile
     * @returns [User] object without password and salt
     */
    async getUserById(id: string): Promise<UserModel> {
        const _user = await this.prismaService.user.findUnique({
            where: { id: id },
            include: {
                cart: true,
            }
        });
        if (!_user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return this.exclude(_user, ['password', 'salt']);
    }

    /**
     * Get all users
     * @returns [User[]] array of users without password and salt
     */
    async getUsers(): Promise<UserModel[]> {
        const _users = await this.prismaService.user.findMany({
            include: {
                cart: true,
            }
        });
        return _users.map(user => this.exclude(user, ['password', 'salt']));
    }

    /**
     * Update a user profile
     * @param id user id to update profile
     * @param user [UpdateUserDto]
     * @returns [User] object without password and salt
     */
    async updateUser(id: string, user: UpdateUserDto): Promise<UserModel> {
        const _user = await this.prismaService.user.update({
            where: { id: id },
            data: user
        });
        if (!_user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return this.exclude(_user, ['password', 'salt']);
    }

    /**
     * Add a cart item(s) to a user
     * @param id user id to get cart
     * @param cart [CreateCartDto]
     * @returns [User] object without password and salt
     */
    async addCart(id: string, cart: CreateCartDto): Promise<UserModel> {
        const _user = await this.prismaService.user.findUnique({
            where: { id: id },
            include: {
                cart: true,
            }
        });
        if (!_user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const _userUpdate = await this.prismaService.user.update({
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
    }

    /**
     * Update a cart item(s) to a user
     * @param userId user id to get cart
     * @param cartId card id to update
     * @param cart [UpdateCartDto] cart item(s) to update
     * @returns [User] object without password and salt
     */
    async updateCart(
        userId: string,
        cartId: string,
        cart: UpdateCartDto
    ): Promise<UserModel> {
        const _user = await this.prismaService.user.findUnique({
            where: { id: userId },
            include: {
                cart: true,
            }
        });
        if (!_user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const _userUpdate = await this.prismaService.user.update({
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
    }

    /**
     * Delete a cart item(s) to a user
     * @param userId user id to get cart
     * @param cartId cart id to delete
     * @returns [User] object without password and salt
     */
    async deleteCart(userId: string, cartId: string): Promise<UserModel> {
        const _user = await this.prismaService.user.findUnique({
            where: { id: userId },
            include: {
                cart: true,
            }
        });
        if (!_user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const _userUpdate = await this.prismaService.user.update({
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
    }

    /**
     * Delete a user by id
     * @param id user id to delete
     * @returns [User] object without password and salt
     */
    async deleteUser(id: string): Promise<string> {
        const _user = await this.prismaService.user.delete({
            where: { id: id },
        });
        if (!_user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return _user.id;
    }


    /**
     * Exclude properties from a user object
     * @param user
     * @param keys
     * @private
     */
    private exclude<CustomerModel, Key extends keyof CustomerModel>(
        user: CustomerModel,
        keys: Key[],
    ): CustomerModel {
        for (const key of keys) {
            // Populate the value with a default value of its type
            user[key] = getDefaultPropertyValue(user[key]);
        }
        return user;
    }
}
