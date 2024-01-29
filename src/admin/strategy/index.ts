import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { jwtConstants } from '@shared';
import { AdminService } from '@admin/admin.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private adminService: AdminService,
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
        const _user = await this.adminService.validateAdmin(payload.sub);
        return {
            _id: _user?.id,
            role: _user?.role,
            userId: _user?.id,
            username: _user?.email,
        };
    }
}
