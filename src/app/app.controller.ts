import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppResponse } from './response/response.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Welcome to the North Bridge API',
    type: AppResponse,
  })
  getHello(): { message: string } {
    return this.appService.welcome();
  }
}
