import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { UPLOADS_DIR } from "@shared/environment";
import { diskStorage } from "multer";
import path, { extname } from "path";

export const multerLimits = {
    fileSize: 1024 * 1024 * 10, // 10MB
};

export const multerFileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/JPEG', 'image/PNG', 'image/JPG'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File not supported'), false);
    }
};

export const multerStorage = diskStorage({
    // upload to uploads folder outside the src folder
    destination: path.join(__dirname, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const extension = extname(file.originalname);
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${name}-${randomName}${extension}`);
    },
});

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            dest: UPLOADS_DIR,
        };
    }
}