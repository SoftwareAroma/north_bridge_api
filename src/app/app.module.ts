import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from '@product/product.module';
import { StoreModule } from '@store/store.module';
import { UserModule } from '@user/user.module';
import { PrismaModule } from '@shared/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {
    JwtStrategy,
    configuration,
    jwtConstants,
    HttpExceptionFilter,
    PrismaClientExceptionFilter
} from '@shared';
import Joi from 'joi';
import { VendorModule } from '@vendor/vendor.module';
import { AdminModule } from '@admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from '@payment/payment.module';

@Module({
    imports: [
        AdminModule,
        UserModule,
        ProductModule,
        StoreModule,
        VendorModule,
        PaymentModule,

        // prisma for database query and connection
        PrismaModule,

        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn },
        }),


        /// prevent brute force attack
        // ThrottlerModule.forRoot({
        //   ttl: 60,
        //   limit: 10,
        // }),

        /// configurations
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
            cache: true,
            expandVariables: true,
            validationSchema: Joi.object({
                UPLOADS_DIR: Joi.string().required(),
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                PORT: Joi.number().default(5000),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        JwtStrategy,
        {
            provide: 'APP_FILTER',
            useClass: HttpExceptionFilter,
        },
        {
            provide: 'PRISMA_FILTER',
            useClass: PrismaClientExceptionFilter,
        }
    ],

})
export class AppModule {
}
