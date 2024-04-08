import * as dotenv from 'dotenv'
dotenv.config();

const PORT: number = parseInt(process.env.PORT, 10) || 5000
const DOMAINS: string = process.env.DOMAINS
const DATABASE_URL: string = process.env.DATABASE_URL
const ORIGIN_URL: string = process.env.ORIGIN_URL
const UPLOADS_DIR: string = process.env.UPLOADS_DIR || 'uploads'
const API_VERSION: string = process.env.API_VERSION
const APP_NAME: string = process.env.APP_NAME
const FRONTEND_URL: string = process.env.FRONTEND_URL
const BACKEND_URL: string = process.env.BACKEND_URL
const SWAGGER_PATH: string = process.env.SWAGGER_PATH
const PAY_STACK_API_KEY: string = process.env.PAY_STACK_API_KEY
const PAY_STACK_CURRENCY: string = process.env.PAY_STACK_CURRENCY
// JWT VARIABLES
const JWT_SECRET: string = process.env.JWT_SECRET
const JWT_ALGORITHM: string = process.env.JWT_ALGORITHM
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN

export const configuration = () => ({
    PORT,
    DOMAINS,
    DATABASE_URL,
    ORIGIN_URL,
    UPLOADS_DIR,
    API_VERSION,
    JWT_SECRET,
    JWT_ALGORITHM,
    JWT_EXPIRES_IN,
    SWAGGER_PATH,
    APP_NAME,
    PAY_STACK_API_KEY,
    PAY_STACK_CURRENCY,
    FRONTEND_URL,
    BACKEND_URL,
});

export {
    PORT,
    DOMAINS,
    DATABASE_URL,
    ORIGIN_URL,
    UPLOADS_DIR,
    API_VERSION,
    JWT_SECRET,
    JWT_ALGORITHM,
    JWT_EXPIRES_IN,
    SWAGGER_PATH,
    APP_NAME,
    PAY_STACK_API_KEY,
    PAY_STACK_CURRENCY,
    FRONTEND_URL,
    BACKEND_URL
}