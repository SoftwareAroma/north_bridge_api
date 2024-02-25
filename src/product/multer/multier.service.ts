import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { UPLOADS_DIR } from "@shared/environment";
import multer, { diskStorage } from "multer";
import path, { extname } from "path";
import process from "process";
import fs from "fs";
import Express from 'express';

export const multerLimits: { fileSize: number } = {
    fileSize: 1024 * 1024 * 10, // 10MB
};

export const multerFileFilter = (_req: any, file: { mimetype: string; }, cb: (arg0: Error, arg1: boolean) => void): void => {
    const allowedMimes: Array<string> = ['image/jpeg', 'image/png', 'image/jpg', 'image/JPEG', 'image/PNG', 'image/JPG'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File not supported'), false);
    }
};

export const multerStorage: multer.StorageEngine = diskStorage({
    // upload to uploads folder outside the src folder
    // destination: path.join(__dirname, UPLOADS_DIR),
    destination: function (_req: any, _file: Express.Multer.File, cb): void {
        const folderPath: string = path.join(`${process.cwd()}/`, `${UPLOADS_DIR}/products`);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        cb(null, `${UPLOADS_DIR}/products`);
    },
    filename: (_req: any, file: Express.Multer.File, cb): void => {
        const name: string = file.originalname.split('.')[0];
        const extension: string = extname(file.originalname);
        const randomName: string = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${name}-${randomName}${extension}`);
    },
});

/**
 * Delete file from the file system
 * @param filePath 
 */
export const deleteFile = (filePath: string): void => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
    });
};

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            dest: UPLOADS_DIR,
        };
    }
}