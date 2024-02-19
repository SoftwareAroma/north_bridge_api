import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@shared/prisma/prisma.service';

/*
 * ######################################################
 * ############### BOOTSTRAP THE APP ####################
 * ######################################################
 * */
async function bootstrap(): Promise<void> {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'], // log only in these cases
  });
  // app config service
  const configService: ConfigService<any, any> = app.get(ConfigService);
  app.get(PrismaService);
  app.enableShutdownHooks();
  // string from environment file // can make changes
  const origin: string = configService.get<string>('FRONTEND_URL');
  // api version
  const apiVersion: string = configService.get<string>('API_VERSION');
  const appName: string = 'NORTH BRIDGE';
  const swaggerPath: string = 'swagger';
  app.setGlobalPrefix('api');

  // enable CORS
  app.enableCors({
    origin: origin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  // middlewares
  app.use(cookieParser());
  /* APP VERSIONING */
  app.enableVersioning({
    type: VersioningType.URI,
  });

  /* USE HELMET TO ADD A SECURITY LAYER */
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  /*
   * ###########################################################
   * #################### USE GLOBAL PIPES #####################
   * ###########################################################
   * */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  /*
   * ###########################################################
   * ##################### SWAGGER CONFIG ######################
   * ###########################################################
   * */
  const config: Omit<OpenAPIObject, any> = new DocumentBuilder()
    .setTitle(`${appName} API version ${apiVersion}`)
    .setDescription(
      `The backend api interface for ${appName}`,
    )
    .setVersion(`${apiVersion}`)
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  // path for swagger
  SwaggerModule.setup(`${swaggerPath}`, app, document);

  // get the port from the config file
  const port: number = configService.get<number>('PORT');
  await app
    .listen(port)
    .then((): void => {
      console.log(`Server running on port http://localhost:${port}/api`);
      console.log(
        `Swagger running on port http://localhost:${port}/${swaggerPath}`,
      );
      console.log('Press CTRL-C to stop server');
    })
    .catch((err): void => {
      console.log('There was an error starting server. ', err);
    });
}
bootstrap().then((): void => { console.log() });
