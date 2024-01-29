import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { APP_NAME, API_VERSION } from '@shared';

describe('AppService', () => {
    let appService: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        appService = module.get<AppService>(AppService);
    });

    describe('welcome', () => {
        it('should return a welcome message with the correct app name and version', () => {
            const result = appService.welcome();

            expect(result).toEqual({
                message: `welcome to ${APP_NAME} API ${API_VERSION}`,
            });
        });
    });
});
