import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Welcome to the North Bridge API',
    type: Object,
  })
  getHello(): { message: string } {
    return this.appService.welcome();
  }
}
