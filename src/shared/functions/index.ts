import bcrypt from 'bcrypt';
// import multer, {diskStorage} from 'multer';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as process from 'process';

/**
 * Hash password
 * @param password
 * @param salt
 */
export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param password
 * @param hashedPassword
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate salt for hashing password
 */
export const generateSalt = async (): Promise<string> => {
  return await bcrypt.genSalt(10);
};

/**
 * Get default value for a property
 * @param value
 */
export const getDefaultPropertyValue = <T>(value: T): T => {
  if (typeof value === 'boolean') {
    return false as T;
  } else if (typeof value === 'string') {
    return '' as T;
  } else if (typeof value === 'number') {
    return 0 as T;
  } else if (typeof value === 'object' && Array.isArray(value)) {
    return [] as T;
  } else if (typeof value === 'object' && value !== null) {
    return {} as T;
  }
  return value;
}

// export const multerStorage = (destination:string): multer.StorageEngine => diskStorage({
//     destination: function (_req:any, _file:Express.Multer.File, cb):void {
//         const folderPath:string = path.join(`${process.cwd()}/`, `${destination}`);
//         if(!fs.existsSync(folderPath)){
//             fs.mkdirSync(folderPath, {recursive: true});
//         }
//         cb(null, `${destination}`)
//     },
//     filename: function (_req:any, file:Express.Multer.File, cb):void {
//         const uniqueSuffix:string = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         const ext:string = file.mimetype.split('/')[1]
//         console.log(file.fieldname + '-' + uniqueSuffix + '.' + ext)
//         cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
//     }
// });
