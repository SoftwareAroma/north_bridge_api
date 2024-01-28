import { Injectable } from '@nestjs/common';
import { API_VERSION, APP_NAME } from '@shared';

@Injectable()
export class AppService {
  constructor() { }
  welcome(): { message: string } {
    return {
      message: `welcome to ${APP_NAME} ${API_VERSION}`,
    };
  }
}
