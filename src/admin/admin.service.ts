import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    comparePassword,
    generateSalt,
    getDefaultPropertyValue,
    hashPassword,
    PayLoad
} from '@shared';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateAdminDto } from './dto/create.dto';
import { Response } from 'express';
import { LoginAdminDto } from './dto/login.dto';
import { Admin as AdminModel } from '@prisma/client';
import { UpdateAdminDto } from './dto/update.dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Create or Register a new admin and set the access_token in the cookie
     * take the admin details through the CreateAdminDto
     * @param adminDto
     * @param response access token to be set in the cookie
     * @returns access_token
     */
    async registerAdmin(adminDto: CreateAdminDto, response: Response): Promise<string> {
        // check if admin already exist
        const _adminExist: AdminModel = await this.prismaService.admin.findUnique({
            where: {
                email: adminDto.email
            }
        });
        if (_adminExist) {
            throw new HttpException('Email Already Exist', HttpStatus.CONFLICT);
        }

        if (adminDto.password.length < 8) {
            throw new HttpException('Password must be at least 8 characters', HttpStatus.BAD_REQUEST);
        }
        const salt: string = await generateSalt();

        // add the salt to the dto
        adminDto.salt = salt;

        adminDto.password = await hashPassword(
            adminDto.password,
            salt,
        );

        const _admin : AdminModel = await this.prismaService.admin.create({
            data: adminDto
        });
        const payload: PayLoad = { sub: _admin.id, username: _admin.email, role: _admin.role };
        const token: string = this.jwtService.sign(payload);
        response.cookie('access_token', token, {
            httpOnly: true,
        });
        return token;
    }

    /**
     * Login an admin and set the access_token in the cookie
     * take the admin email and password through the LoginAdminDto
     * @param admin
     * @param response access_token to be set in the cookie
     * @returns access_token
     */
    async loginAdmin(admin: LoginAdminDto, response: Response): Promise<string> {
        const _admin: AdminModel = await this.prismaService.admin.findUnique({
            where: {
                email: admin.email
            }
        });
        // if admin does not exist
        if (!_admin) {
            throw new HttpException(`No account found for admin with email ${admin.email}`, HttpStatus.NOT_FOUND);
        }

        const isPasswordValid: boolean = await comparePassword(admin.password, _admin.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
        }
        const payload: PayLoad = { sub: _admin.id, username: _admin.email, role: _admin.role };
        const token : string = this.jwtService.sign(payload);
        response.cookie('access_token', token, {
            httpOnly: true,
        });
        return token;
    }

    /**
     * Validate an admin by id
     * @param id the admin id to validate
     * @returns [admin] object without password and salt
     */
    async validateAdmin(id: string): Promise<AdminModel | null> {
        const _admin: AdminModel = await this.prismaService.admin.findUnique({
            where: { id: id },
        });
        // console.log(_admin)
        if (!_admin) {
            return null;
        }
        return this.exclude(_admin, ['password', 'salt']);
    }

    /**
     * Get the profile of a admin by id
     * @param id admin id to get profile
     * @returns [admin] object without password and salt
     */
    async profile(id: string): Promise<AdminModel> {
        const _admin: AdminModel = await this.prismaService.admin.findUnique({
            where: { id: id }
        });
        if (!_admin) {
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
        return this.exclude(_admin, ['password', 'salt']);
    }

    /**
     * Get the profile of an admin by id
     * @param id admin id to get profile
     * @returns [admin] object without password and salt
     */
    async getAdmin(id: string): Promise<AdminModel> {
        const _admin: AdminModel = await this.prismaService.admin.findUnique({
            where: { id: id }
        });
        if (!_admin) {
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
        return this.exclude(_admin, ['password', 'salt']);
    }

    /**
     * Get all admins
     * @returns [admin[]] array of admins without password and salt
     */
    async getAdmins(): Promise<AdminModel[]> {
        const _admins:Array<AdminModel> = await this.prismaService.admin.findMany();
        return _admins.map((admin:AdminModel) => this.exclude(admin, ['password', 'salt']));
    }

    /**
     * Update an admin profile
     * @param id admin id to update profile
     * @param admin
     * @returns [admin] object without password and salt
     */
    async updateAdmin(id: string, admin: UpdateAdminDto): Promise<AdminModel> {
        const _admin: AdminModel = await this.prismaService.admin.findUnique({
            where: { id: id },
        });
        if (!_admin) {
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
        // if the email is not empty and is different from the current email
        if (admin.email && admin.email !== _admin.email) {
            throw new HttpException('Email cannot be changed', HttpStatus.BAD_REQUEST);
        }
        const updatedAdmin :AdminModel = await this.prismaService.admin.update({
            where: { id: id },
            data: admin,
        });
        return this.exclude(updatedAdmin, ['password', 'salt']);
    }

    /**
     * Delete a admin by id
     * @param id admin id to delete
     * @returns [AdminModel] object without password and salt
     */
    async deleteAdmin(id: string): Promise<string> {
        const _admin: AdminModel = await this.prismaService.admin.delete({
            where: { id: id },
        });
        if (!_admin) {
            throw new HttpException('admin not found', HttpStatus.NOT_FOUND);
        }
        return _admin.id;
    }


    /**
     * Exclude properties from a admin object
     * @param admin
     * @param keys
     * @private
     */
    private exclude<AdminModel, Key extends keyof AdminModel>(
        admin: AdminModel,
        keys: Key[],
    ): AdminModel {
        for (const key of keys) {
            // Populate the value with a default value of its type
            admin[key] = getDefaultPropertyValue(admin[key]);
        }
        return admin;
    }

}
