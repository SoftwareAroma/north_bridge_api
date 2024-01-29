import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { VenderJwtAuthGuard } from 'src/vendor/guard';

@Module({
  imports: [
  ],
  exports: [StoreService],
  controllers: [StoreController],
  providers: [
    StoreService,
    VenderJwtAuthGuard,
  ],
})
export class StoreModule { }
