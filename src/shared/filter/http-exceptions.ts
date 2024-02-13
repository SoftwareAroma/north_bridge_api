import { Request, Response } from 'express';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import {HttpArgumentsHost} from "@nestjs/common/interfaces";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx:HttpArgumentsHost = host.switchToHttp();
        const response:Response<any, any> = ctx.getResponse<Response>();
        const request:Request<any> = ctx.getRequest<Request>();
        const status:number = exception.getStatus();
        const message:string = exception.message.replace(/\n/g, '');

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: message,
            });
    }
}