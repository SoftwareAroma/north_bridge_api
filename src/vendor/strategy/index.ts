import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { jwtConstants } from '@shared';
import { VendorService } from '../vendor.service';

@Injectable()
export class VendorJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private vendorService: VendorService,
    ) {
        super({
            // get access token form request object
            jwtFromRequest: (request: Request) => {
                // console.log("Request Cookie ", request.headers.cookie);
                // console.log("Request Cookie ", request.headers.cookie);
                if (!request || !request.cookies) {
                    return null;
                }
                else if (request.cookies['access_token'] != undefined || request.cookies['access_token'] != null) {
                    // console.log("Request Cookie ", request.cookies['access_token']);
                    return request.cookies['access_token'];
                } else {
                    // console.log("Request Cookie Header ", request.headers.cookie);
                    return request.headers.cookie;
                }
            },
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }
    async validate(payload: any) {
        // console.log(payload)
        const _vendor = await this.vendorService.validateVendor(payload.sub);
        return {
            _id: _vendor?.id,
            role: _vendor?.role,
            userId: _vendor?.id,
            username: _vendor?.email,
        };
    }
}
