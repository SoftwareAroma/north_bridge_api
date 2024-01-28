import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { jwtConstants } from '@shared';
import { UserService } from '@user/user.service';
import { User as UserModel } from '@prisma/client';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
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
        const _user = await this.userService.validateUser(payload.sub);
        return {
            _id: _user?.id,
            role: _user?.role,
            userId: _user?.id,
            username: _user?.email,
        };
    }
}
