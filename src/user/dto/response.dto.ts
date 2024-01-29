import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

// Response Objects
class UserResponseObject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    otherName: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isEmailVerified: boolean;

    @ApiProperty()
    cart: []

    @ApiProperty()
    role: Role;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

class DataRes {
    @ApiProperty({ type: UserResponseObject })
    user: UserResponseObject;
}

export class UserResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: DataRes;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}

class DataRes2 {
    @ApiProperty({ type: [UserResponseObject] })
    users: [UserResponseObject];
}

export class UsersResponse {
    // a json objec that uses the CustomApiResponse class
    @ApiProperty()
    data: DataRes2;

    @ApiProperty()
    message: string;

    @ApiProperty()
    success: boolean;
}
