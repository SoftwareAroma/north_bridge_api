import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateVendorDto } from './dto/create.dto';
import { Response } from 'express';
import { comparePassword, generateSalt, getDefaultPropertyValue, hashPassword, PayLoad } from '@shared';
import { JwtService } from '@nestjs/jwt';
import { LoginVendorDto } from './dto/login.dto';
import { UpdateVendorDto } from './dto/update.dto';
import { Vendor as VendorModel } from '@prisma/client';

@Injectable()
export class VendorService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {
    }

    /**
     * Register a new vendor
     * @returns [string]
     * @param data
     * @param response
     */
    async createVendor(data: CreateVendorDto, response: Response): Promise<string> {
        try {// check if vendor already exist with email
            const vendorExist: VendorModel = await this.prismaService.vendor.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (vendorExist) {
                throw new HttpException('Email Already Exist', HttpStatus.CONFLICT);
            }

            if (data.password.length < 8) {
                throw new HttpException('Password must be at least 8 characters', HttpStatus.BAD_REQUEST);
            }
            const salt: string = await generateSalt();

            // add the salt to the dto
            data.salt = salt;

            data.password = await hashPassword(
                data.password,
                salt,
            );

            const _vendor: VendorModel = await this.prismaService.vendor.create({
                data: data,
            });
            const payload: PayLoad = { sub: _vendor.id, username: _vendor.email, role: _vendor.role };
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
     * Login a vendor
     * @returns string
     * @param data
     * @param response
     */
    async loginVendor(data: LoginVendorDto, response: Response): Promise<string> {
        try {
            // console.log(data.email);
            const _vendor: VendorModel = await this.prismaService.vendor.findUnique({
                where: {
                    email: data.email,
                },
            });
            // if vendor does not exist
            if (!_vendor) {
                throw new HttpException(`No account found for vendor with email ${data.email}`, HttpStatus.NOT_FOUND);
            }

            const isPasswordValid: boolean = await comparePassword(data.password, _vendor.password);
            if (!isPasswordValid) {
                throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
            }
            const payload: PayLoad = { sub: _vendor.id, username: _vendor.email, role: _vendor.role };
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
     * Get all vendors
     * @returns [Array<VendorModel>]
     */
    async getVendors(): Promise<Array<VendorModel>> {
        try {
            const _vendors: Array<VendorModel> = await this.prismaService.vendor.findMany({
                include: {
                    stores: {
                        include: {
                            products: {
                                include: {
                                    categories: true
                                },
                            },
                        },
                    },
                },
            });
            return _vendors.map((vendor: VendorModel) => this.exclude(vendor, ['password', 'salt']));
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Validate a user by id
     * @param id the user id to validate
     * @returns [User] object without password and salt
     */
    async validateVendor(id: string): Promise<VendorModel | null> {
        try {
            const _user: VendorModel = await this.prismaService.vendor.findUnique({
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
     * Get a vendor profile
     * @param id id of vendor
     * @returns [VendorModel]
     */
    async profile(id: string): Promise<VendorModel> {
        try {
            const _vendor: VendorModel = await this.prismaService.vendor.findUnique({
                where: {
                    id: id,
                },
                include: {
                    stores: {
                        include: {
                            products: {
                                include: {
                                    categories: true
                                },
                            },
                        },
                    },
                },
            });
            return this.exclude(_vendor, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a vendor
     * @param id id of vendor
     * @returns [VendorModel]
     */
    async getVendor(id: string): Promise<VendorModel> {
        try {
            const _vendor: VendorModel = await this.prismaService.vendor.findUnique({
                where: {
                    id: id,
                },
                include: {
                    stores: {
                        include: {
                            products: {
                                include: {
                                    categories: true
                                },
                            },
                        },
                    },
                },
            });
            return this.exclude(_vendor, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a vendor
     * @param id id of vendor to update
     * @param data
     * @returns [VendorModel]
     */
    async updateVendor(id: string, data: UpdateVendorDto): Promise<VendorModel> {
        try {
            const _vendor: VendorModel = await this.prismaService.vendor.findUnique({
                where: {
                    id: id,
                },
            });
            if (!_vendor) {
                throw new HttpException('Vendor not found', HttpStatus.NOT_FOUND);
            }
            // if user tries to update email
            if (data.email && data.email !== _vendor.email) {
                throw new HttpException('Email cannot be changed', HttpStatus.BAD_REQUEST);
            }

            const _updatedVendor: VendorModel = await this.prismaService.vendor.update({
                where: {
                    id: id,
                },
                data: data,
            });
            return this.exclude(_updatedVendor, ['password', 'salt']);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a vendor
     * @param id id of vendor to delete
     * @returns string
     */
    async deleteVendor(id: string): Promise<string> {
        try {
            const _vendor: VendorModel = await this.prismaService.vendor.delete({
                where: {
                    id: id,
                },
            });

            return _vendor.id;
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
    private exclude<VendorModel, Key extends keyof VendorModel>(
        user: VendorModel,
        keys: Key[],
    ): VendorModel {
        for (const key of keys) {
            // Populate the value with a default value of its type
            user[key] = getDefaultPropertyValue(user[key]);
        }
        return user;
    }
}
