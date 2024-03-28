import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppResponse } from './response/response.dto';

@ApiTags('App Endpoints')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Redirect('https://api.northbridge.store/swagger')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Welcome to the North Bridge API',
    type: AppResponse,
  })
  getHello(): { message: string } {
    return this.appService.welcome();
  }
}
