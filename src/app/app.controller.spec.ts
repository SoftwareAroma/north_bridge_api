import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('getHello', () => {
        it('should return a welcome message with the correct app name and version', () => {
            const result = appController.getHello();

            expect(result).toEqual({
                message: 'welcome to NORTH BRIDDGE API API 1.0.1',
            });
        });

        it('should have the correct status code in the ApiResponse decorator', () => {
            const decorators = Reflect.getMetadataKeys(appController.getHello);
            const apiResponseDecorator = decorators.find((d) => d.name === 'ApiResponse');

            expect(apiResponseDecorator).toBeDefined();
            expect(apiResponseDecorator.args[0].status).toBe(HttpStatus.OK);
        });
    });
});
