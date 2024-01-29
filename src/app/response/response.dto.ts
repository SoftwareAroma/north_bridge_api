import { ApiProperty } from "@nestjs/swagger";

/**
 * App Api Response Class
 */
export class AppResponse {
    @ApiProperty()
    message: string;
}

export class AccessToken {
    @ApiProperty()
    access_token: string;
}

export class AuthResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: AccessToken;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

export class StringResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

export class BooleanResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: boolean;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}