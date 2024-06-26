import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { StoreModule } from '@store/store.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@shared';
import { CaslModule } from '@shared/casl/casl.module';

@Module({
  imports: [
    CaslModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [VendorController],
  exports: [VendorService],
  providers: [
    VendorService
  ],
})
export class VendorModule { }
