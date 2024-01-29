import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';

@Module({
  providers: [SampleService],
  controllers: [SampleController]
})
export class SampleModule {}
