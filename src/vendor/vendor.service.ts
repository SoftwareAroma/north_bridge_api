import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateVendorDto } from './dto/create.dto';
import { Response } from 'express';
import { comparePassword, generateSalt, getDefaultPropertyValue, hashPassword } from '@shared';
import { JwtService } from '@nestjs/jwt';
import { LoginVendorDto } from './dto/login.dto';
import { UpdateVendorDto } from './dto/update.dto';
import { Vendor as VendorModel } from '@prisma/client';

@Injectable()
export class VendorService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Register a new vendor
     * @param data [CreateVendorDto]
     * @param response [Response]
     * @returns [string]
     */
    async createVendor(data: CreateVendorDto, response: Response): Promise<string> {
        // check if vendor already exist with email
        const vendorExist = await this.prismaService.vendor.findUnique({
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
        const salt = await generateSalt();

        // add the salt to the dto
        data.salt = salt;

        data.password = await hashPassword(
            data.password,
            salt,
        );

        const _vendor = await this.prismaService.vendor.create({
            data: data,
        });
        const payload = { sub: _vendor.id, username: _vendor.email, role: _vendor.role };
        const token = this.jwtService.sign(payload);
        response.cookie('access_token', token, {
            httpOnly: true,
        });
        return token;
    }

    /**
     * Login a vendor
     * @param data [LoginVendorDto]
     * @param response [Response]
     * @returns string
     */
    async loginVendor(data: LoginVendorDto, response: Response): Promise<string> {
        const _vendor = await this.prismaService.vendor.findUnique({
            where: {
                email: data.email,
            },
        });
        // if vendor does not exist
        if (!_vendor) {
            throw new HttpException(`No account found for vendor with email ${_vendor.email}`, HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await comparePassword(data.password, _vendor.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid email or passowrd', HttpStatus.BAD_REQUEST);
        }
        const payload = { sub: _vendor.id, username: _vendor.email, role: _vendor.role };
        const token = this.jwtService.sign(payload);
        response.cookie('access_token', token, {
            httpOnly: true,
        });
        return token;
    }

    /**
     * Get all vendors
     * @returns [Array<VendorModel>]
     */
    async getVendors(): Promise<Array<VendorModel>> {
        const _vendors = await this.prismaService.vendor.findMany({
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
        return _vendors.map((vendor) => this.exclude(vendor, ['password', 'salt']));
    }

    /**
     * Validate a user by id
     * @param id the user id to validate
     * @returns [User] object without password and salt
     */
    async validateVendor(id: string): Promise<VendorModel | null> {
        const _user = await this.prismaService.vendor.findUnique({
            where: { id: id },
        });
        // console.log(_user)
        if (!_user) {
            return null;
        }
        return this.exclude(_user, ['password', 'salt']);
    }

    /**
     * Get a vendor profile
     * @param id id of vendor
     * @returns [VendorModel]
     */
    async profile(id: string): Promise<VendorModel> {
        const _vendor = await this.prismaService.vendor.findUnique({
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
    }

    /**
     * Get a vendor
     * @param id id of vendor
     * @returns [VendorModel]
     */
    async getVendor(id: string): Promise<VendorModel> {
        const _vendor = await this.prismaService.vendor.findUnique({
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
    }

    /**
     * Update a vendor
     * @param id id of vendor to update
     * @param data [UpdateVendorDto]
     * @returns [VendorModel]
     */
    async updateVendor(id: string, data: UpdateVendorDto): Promise<VendorModel> {
        const _vender = await this.prismaService.vendor.update({
            where: {
                id: id,
            },
            data: data,
        });
        return this.exclude(_vender, ['password', 'salt']);
    }

    /**
     * Delete a vendor
     * @param id id of vendor to delete
     * @returns string
     */
    async deleteVendor(id: string): Promise<string> {
        const _vendor = await this.prismaService.vendor.delete({
            where: {
                id: id,
            },
        });

        return _vendor.id;
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
